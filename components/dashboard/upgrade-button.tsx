"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { upgradeToPro } from "@/app/(dashboard)/app/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UpgradeButton({
  size = "sm",
  className,
  children = "Upgrade to Pro",
}: {
  size?: "sm" | "default" | "lg";
  className?: string;
  children?: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await upgradeToPro();
      if (result?.error) toast.error(result.error);
    });
  }

  return (
    <Button size={size} className={cn(className)} onClick={handleClick} disabled={isPending}>
      {isPending ? "Opening checkout…" : children}
    </Button>
  );
}
