import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import {
  authenticateWidgetRequest,
  corsHeaders,
  optionalString,
  readJsonObject,
  resolveOpenSession,
} from "@/lib/widget-auth";

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const origin = request.headers.get("origin");
  const key = request.nextUrl.searchParams.get("key");
  const { id } = await params;

  const auth = await authenticateWidgetRequest(key, origin);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.reason },
      { status: auth.reason === "invalid_key" ? 401 : 403, headers: corsHeaders(origin) },
    );
  }

  const body = await readJsonObject(request);
  if (!body) {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const outcome = body.outcome;
  if (outcome !== "churned" && outcome !== "abandoned") {
    return NextResponse.json(
      { error: "invalid_outcome" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const session = await resolveOpenSession(
    auth.project,
    id,
    optionalString(body.sessionToken, 64),
  );
  if (!session) {
    return NextResponse.json(
      { error: "session_not_found" },
      { status: 404, headers: corsHeaders(origin) },
    );
  }

  // Transition only from "open": a concurrent /accept may have just recorded
  // a save, and overwriting it with "churned" would lose that saved MRR.
  const supabase = createServiceClient();
  const { data: updated, error } = await supabase
    .from("cancel_sessions")
    .update({ outcome, resolved_at: new Date().toISOString() })
    .eq("id", session.id)
    .eq("outcome", "open")
    .select("id");

  if (error) {
    return NextResponse.json(
      { error: "update_failed" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }
  if (!updated || updated.length === 0) {
    return NextResponse.json(
      { error: "session_not_found" },
      { status: 404, headers: corsHeaders(origin) },
    );
  }

  return NextResponse.json(
    { outcome },
    { status: 200, headers: corsHeaders(origin) },
  );
}
