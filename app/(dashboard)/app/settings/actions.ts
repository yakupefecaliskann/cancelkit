"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/crypto";
import { validateStripeKey } from "@/lib/stripe-key";
import { ACTIVE_PROJECT_COOKIE } from "@/lib/active-project";

export type UpdateStripeKeyState = { status: "idle" | "success" | "error"; message?: string };

export async function updateStripeKey(
  _prevState: UpdateStripeKeyState,
  formData: FormData,
): Promise<UpdateStripeKeyState> {
  const projectId = String(formData.get("projectId") ?? "");
  const secretKey = String(formData.get("secretKey") ?? "").trim();

  if (!projectId) {
    return { status: "error", message: "Missing project." };
  }
  if (!secretKey) {
    return { status: "error", message: "Paste your Stripe restricted key." };
  }

  const validation = await validateStripeKey(secretKey);
  if (!validation.ok) {
    return { status: "error", message: validation.message };
  }

  // ERR-11: a misconfigured ENCRYPTION_KEY makes encrypt() throw — catch it so
  // the user sees a clean error instead of an unhandled Server Action crash.
  let encryptedKey: string;
  try {
    encryptedKey = encrypt(secretKey);
  } catch (err) {
    console.error("[cancelkit] Stripe key encryption failed:", err);
    return { status: "error", message: "We couldn't securely store your key. Please try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ encrypted_stripe_key: encryptedKey })
    .eq("id", projectId);

  if (error) {
    // ERR-8: raw detail to the server log, generic copy to the user.
    console.error("[cancelkit] Stripe key update failed:", error.message);
    return { status: "error", message: "We couldn't save your key. Please try again." };
  }

  revalidatePath("/app/settings");
  return { status: "success", message: "Stripe key updated." };
}

export type UpdateProjectDetailsState = { status: "idle" | "success" | "error"; message?: string };

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export async function updateProjectDetails(
  _prevState: UpdateProjectDetailsState,
  formData: FormData,
): Promise<UpdateProjectDetailsState> {
  const projectId = String(formData.get("projectId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const accentColor = String(formData.get("accentColor") ?? "").trim();

  if (!projectId) {
    return { status: "error", message: "Missing project." };
  }
  if (!name) {
    return { status: "error", message: "Project name can't be empty." };
  }
  if (!HEX_COLOR_RE.test(accentColor)) {
    return { status: "error", message: "Accent color must be a hex value like #6366F1." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ name, accent_color: accentColor })
    .eq("id", projectId);

  if (error) {
    console.error("[cancelkit] project details update failed:", error.message);
    return { status: "error", message: "We couldn't save your changes. Please try again." };
  }

  revalidatePath("/app/settings");
  return { status: "success", message: "Project details saved." };
}

export type DeleteProjectState = { status: "idle" | "error"; message?: string };

export async function deleteProject(
  _prevState: DeleteProjectState,
  formData: FormData,
): Promise<DeleteProjectState> {
  const projectId = String(formData.get("projectId") ?? "");
  const confirmName = String(formData.get("confirmName") ?? "").trim();
  const expectedName = String(formData.get("expectedName") ?? "").trim();

  if (!projectId) {
    return { status: "error", message: "Missing project." };
  }
  if (confirmName !== expectedName) {
    return { status: "error", message: "Type the project name exactly to confirm deletion." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) {
    console.error("[cancelkit] project delete failed:", error.message);
    return { status: "error", message: "We couldn't delete the project. Please try again." };
  }

  const cookieStore = await cookies();
  cookieStore.delete(ACTIVE_PROJECT_COOKIE);

  const { data: remaining } = await supabase.from("projects").select("id").limit(1);
  redirect(remaining && remaining.length > 0 ? "/app/overview" : "/onboarding");
}
