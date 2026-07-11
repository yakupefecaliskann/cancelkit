import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

// Lightweight DB-backed rate limiter for widget-facing endpoints (ARCHITECTURE
// §4.7). Scoped to (project, customer): the abuse vector that matters — spamming
// session creation to enumerate reasons or drive discount attempts — always
// targets a known customer id. Anonymous (customer-less) sessions can't be
// accepted at all (no Stripe customer), so they are not rate-limited here to
// avoid throttling legitimate high-traffic sites that share a null customer id.
//
// This is a coarse count-based limiter, not a token bucket; it is a backstop on
// top of the one-save-per-customer DB invariant that actually caps discount
// abuse. Distributed IP-level limiting (e.g. Upstash) is future hardening.

const SESSION_CREATE_WINDOW_MS = 10 * 60 * 1000;
const SESSION_CREATE_MAX = 20;

/**
 * True when this (project, customer) has created too many sessions recently.
 * Fails open (returns false) if the count query itself errors — a limiter
 * outage must never break a real customer's cancel flow.
 */
export async function isSessionCreateRateLimited(
  projectId: string,
  customerId: string | null | undefined,
): Promise<boolean> {
  if (!customerId) return false;

  const since = new Date(Date.now() - SESSION_CREATE_WINDOW_MS).toISOString();
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from("cancel_sessions")
    .select("id", { count: "exact", head: true })
    .eq("project_id", projectId)
    .eq("customer_id", customerId)
    .gte("created_at", since);

  if (error) {
    console.error("[cancelkit] rate-limit count failed:", error.message);
    return false;
  }
  return (count ?? 0) >= SESSION_CREATE_MAX;
}
