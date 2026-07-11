"use client";

import { useActionState, useState } from "react";
import { updateProjectDetails, type UpdateProjectDetailsState } from "@/app/(dashboard)/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: UpdateProjectDetailsState = { status: "idle" };

export function ProjectDetailsForm({
  projectId,
  name,
  accentColor,
}: {
  projectId: string;
  name: string;
  accentColor: string;
}) {
  const [state, formAction, isPending] = useActionState(updateProjectDetails, initialState);
  const [color, setColor] = useState(accentColor);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />

      <div className="space-y-1.5">
        <Label htmlFor="name">Project name</Label>
        <Input id="name" name="name" defaultValue={name} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="accentColor">Accent color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="size-8 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
            aria-label="Accent color picker"
          />
          <Input
            id="accentColor"
            name="accentColor"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="w-32 font-mono uppercase"
            maxLength={7}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Used for the primary button and selected states in the widget.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        {state.status === "success" && <span className="text-xs text-success">{state.message}</span>}
        {state.status === "error" && <span className="text-xs text-destructive">{state.message}</span>}
      </div>
    </form>
  );
}
