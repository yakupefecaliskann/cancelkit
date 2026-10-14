import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Daily Vercel Cron target (see vercel.json). Supabase's free tier pauses a
 * project after a stretch of inactivity, which silently takes down sign-in and
 * the whole widget API — one cheap query a day keeps the database awake.
 *
 * When CRON_SECRET is set, Vercel sends it as a Bearer token and anything else
 * is rejected; without it the route stays callable but only runs a head count.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("projects").select("id", { count: "exact", head: true });

  if (error) {
    console.error("[cancelkit] keepalive query failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
