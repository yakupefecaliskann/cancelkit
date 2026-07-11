import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCentsAsCurrency, formatPercent } from "@/lib/format";

export function HeroMetrics({
  totalSavedCents,
  savedThisMonthCents,
  saveRate,
  currency,
}: {
  totalSavedCents: number;
  savedThisMonthCents: number;
  saveRate: number | null;
  currency: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Saved this month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="tabular-nums text-3xl font-semibold text-success">
            {formatCentsAsCurrency(savedThisMonthCents, currency)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Total saved</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="tabular-nums text-3xl font-semibold">{formatCentsAsCurrency(totalSavedCents, currency)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Save rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="tabular-nums text-3xl font-semibold">{saveRate === null ? "—" : formatPercent(saveRate)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
