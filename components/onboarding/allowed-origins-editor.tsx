"use client";

import { useActionState } from "react";
import { updateAllowedOrigins, type SaveOriginsState } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: SaveOriginsState = { status: "idle" };

export function AllowedOriginsEditor({
  projectId,
  initialOrigins,
}: {
  projectId: string;
  initialOrigins: string[];
}) {
  const [state, formAction, isPending] = useActionState(updateAllowedOrigins, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="projectId" value={projectId} />
      <Label htmlFor="origins">Allowed origins</Label>
      <Textarea
        id="origins"
        name="origins"
        placeholder={"https://app.yourproduct.com\nhttps://yourproduct.com"}
        defaultValue={initialOrigins.join("\n")}
        rows={4}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        One origin per line. The widget only responds to requests from these domains.
      </p>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : "Save"}
        </Button>
        {state.status === "success" && <span className="text-xs text-success">{state.message}</span>}
        {state.status === "error" && <span className="text-xs text-destructive">{state.message}</span>}
      </div>
    </form>
  );
}
