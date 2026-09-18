import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only same-site relative paths: "@evil.com" or ".evil.com" appended to the
  // origin would otherwise turn this into an open redirect.
  const requested = searchParams.get("redirectTo");
  const redirectTo =
    requested && requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\")
      ? requested
      : "/app";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
