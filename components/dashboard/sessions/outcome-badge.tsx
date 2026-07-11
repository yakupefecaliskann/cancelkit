import { Badge } from "@/components/ui/badge";
import type { CancelSessionOutcome } from "@/lib/types";

export function OutcomeBadge({ outcome }: { outcome: CancelSessionOutcome }) {
  switch (outcome) {
    case "saved":
      return <Badge className="bg-success text-success-foreground">Saved</Badge>;
    case "churned":
      return <Badge variant="destructive">Churned</Badge>;
    case "abandoned":
      return <Badge className="bg-warning/10 text-warning">Abandoned</Badge>;
    case "open":
    default:
      return <Badge variant="outline">Open</Badge>;
  }
}
