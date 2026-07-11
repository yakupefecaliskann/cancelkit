import type { CancelSession } from "@/lib/types";

type SessionOutcomeRow = Pick<CancelSession, "outcome" | "saved_mrr_cents" | "resolved_at">;

export function sumSavedCents(sessions: Pick<CancelSession, "outcome" | "saved_mrr_cents">[]): number {
  return sessions
    .filter((s) => s.outcome === "saved")
    .reduce((sum, s) => sum + (s.saved_mrr_cents ?? 0), 0);
}

export function computeSaveRate(sessions: Pick<CancelSession, "outcome">[]): number | null {
  const decided = sessions.filter((s) => s.outcome === "saved" || s.outcome === "churned");
  if (decided.length === 0) return null;
  const saved = decided.filter((s) => s.outcome === "saved").length;
  return saved / decided.length;
}

function sumSavedCentsInMonth(sessions: SessionOutcomeRow[], year: number, month: number): number {
  return sessions
    .filter((s) => {
      if (s.outcome !== "saved" || !s.resolved_at) return false;
      const d = new Date(s.resolved_at);
      return d.getUTCFullYear() === year && d.getUTCMonth() === month;
    })
    .reduce((sum, s) => sum + (s.saved_mrr_cents ?? 0), 0);
}

export type MonthlyTrendPoint = { monthKey: string; label: string; savedCents: number };

export function computeMonthlyTrend(
  sessions: SessionOutcomeRow[],
  monthsBack = 6,
  now: Date = new Date(),
): MonthlyTrendPoint[] {
  const points: MonthlyTrendPoint[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    points.push({
      monthKey: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
      savedCents: sumSavedCentsInMonth(sessions, year, month),
    });
  }
  return points;
}

export type ReasonCount = { label: string; count: number };

export function computeReasonBreakdown(
  sessions: { reason?: { label: string } | null; reason_text?: string | null }[],
  topN = 6,
): ReasonCount[] {
  const counts = new Map<string, number>();
  for (const s of sessions) {
    const label = s.reason?.label ?? (s.reason_text ? "Other (free text)" : "No reason given");
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}
