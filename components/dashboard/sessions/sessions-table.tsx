import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OutcomeBadge } from "@/components/dashboard/sessions/outcome-badge";
import type { CancelSession } from "@/lib/types";

export type SessionRow = Pick<
  CancelSession,
  "id" | "customer_id" | "customer_email" | "reason_text" | "outcome" | "created_at"
> & {
  reason: { label: string } | null;
  offer: { headline: string } | null;
};

export function SessionsTable({ sessions }: { sessions: SessionRow[] }) {
  return (
    <div className="rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Offer</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell className="font-medium">
                {session.customer_email ?? session.customer_id ?? "Anonymous"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {session.reason?.label ?? (session.reason_text ? "Other (free text)" : "—")}
              </TableCell>
              <TableCell className="text-muted-foreground">{session.offer?.headline ?? "—"}</TableCell>
              <TableCell>
                <OutcomeBadge outcome={session.outcome} />
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {new Date(session.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
