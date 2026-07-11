"use client";

import { useActionState, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { updateStripeKey, type UpdateStripeKeyState } from "@/app/(dashboard)/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isFullStripeSecretKey } from "@/lib/keys";

const initialState: UpdateStripeKeyState = { status: "idle" };

export function StripeKeySettingsForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState(updateStripeKey, initialState);
  const [key, setKey] = useState("");

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="space-y-1.5">
        <Label htmlFor="secretKey">Stripe restricted key</Label>
        <Input
          id="secretKey"
          name="secretKey"
          type="password"
          placeholder="rk_live_..."
          value={key}
          onChange={(event) => setKey(event.target.value)}
          autoComplete="off"
          required
        />
      </div>

      {isFullStripeSecretKey(key) && (
        <Alert className="border-warning/40 bg-warning/10 [&>svg]:text-warning">
          <TriangleAlert />
          <AlertTitle>This looks like a full secret key</AlertTitle>
          <AlertDescription>
            Use a restricted key (rk_...) scoped to Customers: Read, Subscriptions: Write, and Coupons: Write instead.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Validating…" : "Update key"}
        </Button>
        {state.status === "success" && <span className="text-xs text-success">{state.message}</span>}
        {state.status === "error" && <span className="text-xs text-destructive">{state.message}</span>}
      </div>
    </form>
  );
}
