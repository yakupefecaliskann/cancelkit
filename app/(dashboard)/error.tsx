"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dashboard error boundary: catches render/data failures in the /app layout and
// pages (e.g. a transient Supabase outage while loading projects — ERR-3) and
// offers a retry instead of a blank page or an incorrect onboarding redirect.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[cancelkit] dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-5 text-destructive" strokeWidth={1.75} />
      </div>
      <p className="text-base font-medium text-foreground">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        We couldn&apos;t load your dashboard. This is usually temporary — please try again.
      </p>
      <Button size="sm" className="mt-2" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
