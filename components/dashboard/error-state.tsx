"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ErrorState({ message }: { message: string }) {
  const router = useRouter();

  useEffect(() => {
    toast.error("Couldn't load this page", {
      description: message,
      action: { label: "Retry", onClick: () => router.refresh() },
    });
  }, [message, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="size-5 text-destructive" strokeWidth={1.75} />
      </div>
      <p className="text-sm font-medium text-foreground">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button size="sm" className="mt-2" onClick={() => router.refresh()}>
        Try again
      </Button>
    </div>
  );
}
