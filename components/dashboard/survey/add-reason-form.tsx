"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { addReason, type ReasonFormState } from "@/app/(dashboard)/app/survey/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: ReasonFormState = { status: "idle" };

export function AddReasonForm() {
  const [state, formAction, isPending] = useActionState(addReason, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex items-center gap-2 px-4 py-3">
      <Input name="label" placeholder="e.g. Missing a feature I need" className="h-8 max-w-sm" required />
      <Button type="submit" size="sm" disabled={isPending}>
        <Plus /> {isPending ? "Adding…" : "Add reason"}
      </Button>
      {state.status === "error" && <span className="text-xs text-destructive">{state.message}</span>}
    </form>
  );
}
