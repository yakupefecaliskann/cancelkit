import "server-only";
import { computeBillingState, type BillingState } from "@/lib/billing";
import { createServiceClient } from "@/lib/supabase/service";
import type { CancelSession, Profile, Project } from "@/lib/types";

export const CORS_ALLOWED_METHODS = "GET, POST, OPTIONS";
export const CORS_ALLOWED_HEADERS = "Content-Type";

/** Only echoes the Origin back when it is on the project's allowlist — never "*". */
export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": CORS_ALLOWED_METHODS,
    "Access-Control-Allow-Headers": CORS_ALLOWED_HEADERS,
    Vary: "Origin",
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

/**
 * Browsers always attach an Origin header to cross-origin fetch/XHR requests
 * — it cannot be suppressed by page JS. A missing Origin therefore means the
 * request is same-origin (e.g. our own /demo page) or a non-browser caller,
 * never a third-party site embedding someone else's key; only a present,
 * cross-origin Origin needs to be checked against the allowlist.
 */
export function isOriginAllowed(project: Project, origin: string | null): boolean {
  if (!origin) return true;
  return project.allowed_origins.includes(origin);
}

export async function resolveProjectByKey(key: string | null): Promise<Project | null> {
  if (!key || !key.startsWith("pk_")) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("publishable_key", key)
    .maybeSingle();

  if (error) {
    // A DB/infra failure is not the same as "unknown key" — log it so a real
    // Supabase outage on this business-critical path is observable (ERR-12).
    console.error("[cancelkit] project key lookup failed:", error.message);
    return null;
  }
  if (!data) return null;
  return data as Project;
}

/**
 * Resolves the requesting project from a pk_ key and validates the request's
 * Origin against that project's allowlist. Returns a typed result so callers
 * can distinguish "unknown key" from "origin not allowed" for CORS purposes.
 */
export async function authenticateWidgetRequest(
  key: string | null,
  origin: string | null,
): Promise<
  | { ok: true; project: Project }
  | { ok: false; reason: "invalid_key" | "origin_not_allowed" }
> {
  const project = await resolveProjectByKey(key);
  if (!project) return { ok: false, reason: "invalid_key" };
  if (!isOriginAllowed(project, origin)) {
    return { ok: false, reason: "origin_not_allowed" };
  }
  return { ok: true, project };
}

/**
 * Billing state of the project OWNER (our customer, not their end-customer).
 * Widget entry points (config, session create) answer 403 when this says
 * widgetEnabled=false, so an expired trial never shows the widget on the
 * customer's site. A missing profile fails open — a data glitch on our side
 * must not break a customer's cancel button.
 */
export async function resolveOwnerBillingState(project: Project): Promise<BillingState> {
  const supabase = createServiceClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, trial_ends_at, past_due_since")
    .eq("id", project.user_id)
    .maybeSingle<Pick<Profile, "subscription_status" | "trial_ends_at" | "past_due_since">>();

  if (!profile) {
    return { plan: "pro", trialDaysLeft: 0, showBadge: true, widgetEnabled: true };
  }
  return computeBillingState(profile);
}

/**
 * Resolves an "open" cancel_session scoped to a project + verifies the
 * caller holds the matching session_token. This is the primary tenant
 * guard for /accept and /close (per ARCHITECTURE.md §3.3), on top of the
 * pk_ + Origin check already done by authenticateWidgetRequest.
 */
export async function resolveOpenSession(
  project: Project,
  sessionId: string,
  sessionToken: string | undefined,
): Promise<CancelSession | null> {
  if (!sessionToken) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("cancel_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("project_id", project.id)
    .eq("session_token", sessionToken)
    .eq("outcome", "open")
    .maybeSingle();

  return (data as CancelSession) ?? null;
}
