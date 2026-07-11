"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_PROJECT_COOKIE } from "@/lib/active-project";
import { createCheckoutUrl, LemonSqueezyConfigError } from "@/lib/lemonsqueezy";

export async function setActiveProject(projectId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PROJECT_COOKIE, projectId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function upgradeToPro(): Promise<{ error: string } | void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let checkoutUrl: string;
  try {
    checkoutUrl = await createCheckoutUrl({ email: user.email ?? "", userId: user.id });
  } catch (err) {
    if (err instanceof LemonSqueezyConfigError) {
      return { error: "Billing is not configured yet. Set the Lemon Squeezy env vars first." };
    }
    console.error("[billing] Checkout creation failed:", err);
    return { error: "Could not start checkout. Please try again in a moment." };
  }

  redirect(checkoutUrl);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
