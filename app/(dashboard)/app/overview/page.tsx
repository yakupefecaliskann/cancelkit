import { LineChart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { HeroMetrics } from "@/components/dashboard/overview/hero-metrics";
import { MonthlyTrendChart } from "@/components/dashboard/overview/monthly-trend-chart";
import { ReasonBreakdownChart } from "@/components/dashboard/overview/reason-breakdown-chart";
import { sumSavedCents, computeSaveRate, computeMonthlyTrend, computeReasonBreakdown } from "@/lib/analytics";
import type { CancelSession } from "@/lib/types";

type OverviewSessionRow = Pick<CancelSession, "outcome" | "saved_mrr_cents" | "resolved_at" | "reason_text" | "currency"> & {
  reason: { label: string } | null;
};

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <p className="text-sm text-muted-foreground">Revenue saved from cancellations, at a glance.</p>
    </div>
  );
}

export default async function OverviewPage() {
  const { active } = await getProjectsAndActive();
  if (!active) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cancel_sessions")
    .select("outcome, saved_mrr_cents, resolved_at, reason_text, currency, reason:survey_reasons(label)")
    .eq("project_id", active.id)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    console.error("[cancelkit] overview page load failed:", error.message);
    return (
      <div className="space-y-6">
        <PageHeader />
        <ErrorState message="We couldn't load your overview. Please try again." />
      </div>
    );
  }

  const sessions = (data ?? []) as unknown as OverviewSessionRow[];

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <EmptyState
          icon={LineChart}
          title="No cancel sessions yet"
          description="Install the widget on your cancel button to start seeing recovered revenue here."
          actionLabel="Get your snippet"
          actionHref="/app/settings"
        />
      </div>
    );
  }

  const monthlyTrend = computeMonthlyTrend(sessions);
  const savedThisMonthCents = monthlyTrend[monthlyTrend.length - 1]?.savedCents ?? 0;
  const totalSavedCents = sumSavedCents(sessions);
  const saveRate = computeSaveRate(sessions);
  const reasonBreakdown = computeReasonBreakdown(sessions);
  const currency = sessions.find((s) => s.outcome === "saved")?.currency ?? "usd";

  return (
    <div className="space-y-6">
      <PageHeader />
      <HeroMetrics
        totalSavedCents={totalSavedCents}
        savedThisMonthCents={savedThisMonthCents}
        saveRate={saveRate}
        currency={currency}
      />
      <MonthlyTrendChart data={monthlyTrend} />
      <ReasonBreakdownChart data={reasonBreakdown} />
    </div>
  );
}
