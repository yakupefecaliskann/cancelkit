"use client";

import { useState, useTransition } from "react";
import { Check, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDeleteButton({
  onConfirm,
  label = "Delete",
}: {
  onConfirm: () => void | Promise<void>;
  label?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="icon-sm"
          variant="destructive"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await onConfirm();
              setConfirming(false);
            })
          }
        >
          <Check />
          <span className="sr-only">Confirm {label}</span>
        </Button>
        <Button type="button" size="icon-sm" variant="ghost" onClick={() => setConfirming(false)}>
          <X />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    );
  }

  return (
    <Button type="button" size="icon-sm" variant="ghost" onClick={() => setConfirming(true)}>
      <Trash2 />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
