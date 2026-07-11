"use client";

import { useActionState } from "react";
import { createProject, type CreateProjectState } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: CreateProjectState = { status: "idle" };

export function ProjectForm() {
  const [state, formAction, isPending] = useActionState(createProject, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Project name</Label>
        <Input id="name" name="name" placeholder="Acme Inc." autoFocus required />
        <p className="text-xs text-muted-foreground">
          Usually your product or company name. You can change this later.
        </p>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating…" : "Create project"}
      </Button>
    </form>
  );
}
