import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authenticateWidgetRequest, corsHeaders } from "@/lib/widget-auth";
import type { Offer, SurveyReason } from "@/lib/types";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function GET(request: NextRequest) {
  const origin = request.headers.get("origin");
  const key = request.nextUrl.searchParams.get("key");

  const auth = await authenticateWidgetRequest(key, origin);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.reason },
      { status: auth.reason === "invalid_key" ? 401 : 403 },
    );
  }

  const supabase = createServiceClient();
  const [{ data: reasons }, { data: offers }] = await Promise.all([
    supabase
      .from("survey_reasons")
      .select("id, label, sort_order")
      .eq("project_id", auth.project.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("offers")
      .select("*")
      .eq("project_id", auth.project.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const body = {
    projectId: auth.project.id,
    accentColor: auth.project.accent_color,
    // CancelKit is free for everyone, so the badge is always on — there is no
    // paid tier left that could remove it.
    poweredByBadge: true,
    reasons: (reasons ?? []).map((r: Pick<SurveyReason, "id" | "label">) => ({
      id: r.id,
      label: r.label,
    })),
    offers: (offers ?? []).map((o: Offer) => ({
      id: o.id,
      type: o.type,
      headline: o.headline,
      percentOff: o.percent_off,
      durationMonths: o.duration_months,
      pauseMonths: o.pause_months,
    })),
  };

  return NextResponse.json(body, {
    headers: {
      ...corsHeaders(origin),
      "Cache-Control": "public, max-age=300",
    },
  });
}
