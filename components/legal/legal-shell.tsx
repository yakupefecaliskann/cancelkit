import Link from "next/link";
import type { ReactNode } from "react";

export function LegalShell({
  title,
  effectiveDate,
  children,
}: {
  title: string;
  effectiveDate: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60 bg-[#0f172a]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="font-heading text-lg font-semibold tracking-tight text-white"
          >
            CancelKit
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Effective {effectiveDate}
        </p>
        <div className="legal-prose mt-10 flex flex-col gap-8 text-sm leading-relaxed text-foreground/90 sm:text-base">
          {children}
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span className="font-heading font-semibold text-foreground">
            CancelKit
          </span>
          <nav className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/refund" className="hover:text-foreground">
              Refunds
            </Link>
          </nav>
          <span>&copy; {new Date().getFullYear()} CancelKit. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-heading text-xl font-semibold tracking-tight">
        {heading}
      </h2>
      {children}
    </section>
  );
}
