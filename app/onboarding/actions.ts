"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { encrypt } from "@/lib/crypto";
import { generatePublishableKey } from "@/lib/keys";
import { validateStripeKey } from "@/lib/stripe-key";

export type CreateProjectState = { status: "idle" | "error"; message?: string };

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { status: "error", message: "Give your project a name." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name,
      publishable_key: generatePublishableKey(),
    })
    .select("id")
    .single();

  if (error || !project) {
    console.error("[cancelkit] project create failed:", error?.message);
    return { status: "error", message: "Could not create your project. Please try again." };
  }

  redirect(`/onboarding/connect?project=${project.id}`);
}

export type StripeKeyState = { status: "idle" | "error"; message?: string };

export async function connectStripeKey(
  _prevState: StripeKeyState,
  formData: FormData,
): Promise<StripeKeyState> {
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

  let encryptedKey: string;
  try {
    encryptedKey = encrypt(secretKey);
  } catch (err) {
    console.error("[cancelkit] onboarding Stripe key encryption failed:", err);
    return { status: "error", message: "We couldn't securely store your key. Please try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ encrypted_stripe_key: encryptedKey })
    .eq("id", projectId);

  if (error) {
    console.error("[cancelkit] onboarding Stripe key update failed:", error.message);
    return { status: "error", message: "We couldn't save your key. Please try again." };
  }

  redirect(`/onboarding/snippet?project=${projectId}`);
}

export async function skipStripeKey(formData: FormData) {
  const projectId = String(formData.get("projectId") ?? "");
  redirect(`/onboarding/snippet?project=${projectId}`);
}

export type SaveOriginsState = { status: "idle" | "success" | "error"; message?: string };

export async function updateAllowedOrigins(
  _prevState: SaveOriginsState,
  formData: FormData,
): Promise<SaveOriginsState> {
  const projectId = String(formData.get("projectId") ?? "");
  const raw = String(formData.get("origins") ?? "");
  const origins = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ allowed_origins: origins })
    .eq("id", projectId);

  if (error) {
    console.error("[cancelkit] allowed origins update failed:", error.message);
    return { status: "error", message: "We couldn't save your allowed origins. Please try again." };
  }

  revalidatePath("/app/settings");
  return { status: "success", message: "Allowed origins saved." };
}
