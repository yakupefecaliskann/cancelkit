"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export type MagicLinkState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function sendMagicLink(
  _prevState: MagicLinkState,
  formData: FormData,
): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { status: "error", message: "Enter your email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${appUrl}/auth/callback` },
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  return { status: "success", message: `Magic link sent to ${email}. Check your inbox.` };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${appUrl}/auth/callback` },
  });

  if (error || !data.url) {
    redirect("/login?error=google_oauth_failed");
  }

  redirect(data.url);
}
