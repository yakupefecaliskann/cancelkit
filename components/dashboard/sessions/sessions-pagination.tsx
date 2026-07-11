import Link from "next/link";
import { Button } from "@/components/ui/button";

function PageLink({ href, disabled, children }: { href: string; disabled: boolean; children: React.ReactNode }) {
  if (disabled) {
    return (
      <span className="inline-flex h-7 items-center rounded-lg border border-border px-2.5 text-[0.8rem] text-muted-foreground opacity-50">
        {children}
      </span>
    );
  }
  return (
    <Button size="sm" variant="outline" nativeButton={false} render={<Link href={href}>{children}</Link>} />
  );
}

export function SessionsPagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Page {page} of {totalPages} · {total} sessions
      </span>
      <div className="flex items-center gap-2">
        <PageLink href={`/app/sessions?page=${page - 1}`} disabled={page <= 1}>
          Previous
        </PageLink>
        <PageLink href={`/app/sessions?page=${page + 1}`} disabled={page >= totalPages}>
          Next
        </PageLink>
      </div>
    </div>
  );
}
