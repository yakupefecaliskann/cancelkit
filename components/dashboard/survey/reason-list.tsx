"use client";

import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { updateReasonLabel, deleteReason, moveReason } from "@/app/(dashboard)/app/survey/actions";
import { ConfirmDeleteButton } from "@/components/dashboard/confirm-delete-button";
import type { SurveyReason } from "@/lib/types";

export function ReasonList({ reasons }: { reasons: SurveyReason[] }) {
  return (
    <div className="divide-y divide-border">
      {reasons.map((reason, index) => (
        <ReasonRow key={reason.id} reason={reason} isFirst={index === 0} isLast={index === reasons.length - 1} />
      ))}
    </div>
  );
}

function ReasonRow({ reason, isFirst, isLast }: { reason: SurveyReason; isFirst: boolean; isLast: boolean }) {
  const [label, setLabel] = useState(reason.label);
  const [isPending, startTransition] = useTransition();

  function commitLabel() {
    const trimmed = label.trim();
    if (!trimmed || trimmed === reason.label) {
      setLabel(reason.label);
      return;
    }
    const formData = new FormData();
    formData.set("reasonId", reason.id);
    formData.set("label", trimmed);
    startTransition(async () => {
      const result = await updateReasonLabel(formData);
      if (!result.ok) {
        setLabel(reason.label);
        toast.error(result.message ?? "Couldn't rename the reason.");
      }
    });
  }

  function move(direction: "up" | "down") {
    const formData = new FormData();
    formData.set("reasonId", reason.id);
    formData.set("direction", direction);
    startTransition(async () => {
      const result = await moveReason(formData);
      if (!result.ok) toast.error(result.message ?? "Couldn't reorder the reason.");
    });
  }

  async function remove() {
    const formData = new FormData();
    formData.set("reasonId", reason.id);
    const result = await deleteReason(formData);
    if (!result.ok) toast.error(result.message ?? "Couldn't delete the reason.");
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          disabled={isFirst || isPending}
          onClick={() => move("up")}
          className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ArrowUp className="size-3.5" />
          <span className="sr-only">Move up</span>
        </button>
        <button
          type="button"
          disabled={isLast || isPending}
          onClick={() => move("down")}
          className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <ArrowDown className="size-3.5" />
          <span className="sr-only">Move down</span>
        </button>
      </div>
      <Input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        onBlur={commitLabel}
        disabled={isPending}
        className="h-8 max-w-sm"
      />
      <div className="ml-auto">
        <ConfirmDeleteButton onConfirm={remove} label="Delete reason" />
      </div>
    </div>
  );
}
