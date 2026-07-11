import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { SessionsTable, type SessionRow } from "@/components/dashboard/sessions/sessions-table";
import { SessionsPagination } from "@/components/dashboard/sessions/sessions-pagination";

const PAGE_SIZE = 20;

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { active } = await getProjectsAndActive();
  if (!active) return null;

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("cancel_sessions")
    .select(
      "id, customer_id, customer_email, reason_text, outcome, created_at, reason:survey_reasons(label), offer:offers(headline)",
      { count: "exact" },
    )
    .eq("project_id", active.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const header = (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
      <p className="text-sm text-muted-foreground">Every cancel attempt: reason, offer shown, and outcome.</p>
    </div>
  );

  if (error) {
    console.error("[cancelkit] sessions page load failed:", error.message);
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message="We couldn't load your sessions. Please try again." />
      </div>
    );
  }

  const sessions = (data ?? []) as unknown as SessionRow[];
  const total = count ?? 0;

  if (total === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          icon={Inbox}
          title="No cancel sessions yet"
          description="Once your widget is live, every cancel attempt will show up here with its reason, offer, and outcome."
          actionLabel="Get your snippet"
          actionHref="/app/settings"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <SessionsTable sessions={sessions} />
      <SessionsPagination page={page} pageSize={PAGE_SIZE} total={total} />
    </div>
  );
}
