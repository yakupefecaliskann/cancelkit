import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { authenticateWidgetRequest, corsHeaders, resolveOpenSession } from "@/lib/widget-auth";

type CloseBody = { sessionToken?: string; outcome?: "churned" | "abandoned" };

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

  let body: CloseBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  if (body.outcome !== "churned" && body.outcome !== "abandoned") {
    return NextResponse.json(
      { error: "invalid_outcome" },
      { status: 400, headers: corsHeaders(origin) },
    );
  }

  const session = await resolveOpenSession(auth.project, id, body.sessionToken);
  if (!session) {
    return NextResponse.json(
      { error: "session_not_found" },
      { status: 404, headers: corsHeaders(origin) },
    );
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("cancel_sessions")
    .update({ outcome: body.outcome, resolved_at: new Date().toISOString() })
    .eq("id", session.id);

  if (error) {
    return NextResponse.json(
      { error: "update_failed" },
      { status: 500, headers: corsHeaders(origin) },
    );
  }

  return NextResponse.json(
    { outcome: body.outcome },
    { status: 200, headers: corsHeaders(origin) },
  );
}
