"use client";

import { useActionState, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { connectStripeKey, skipStripeKey, type StripeKeyState } from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isFullStripeSecretKey } from "@/lib/keys";

const initialState: StripeKeyState = { status: "idle" };

export function StripeKeyForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState(connectStripeKey, initialState);
  const [key, setKey] = useState("");

  return (
    <div className="space-y-4">
      <form action={formAction} className="space-y-4">
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
          <p className="text-xs text-muted-foreground">
            Create a restricted key in your Stripe dashboard with{" "}
            <span className="font-mono">Customers: Read</span>,{" "}
            <span className="font-mono">Subscriptions: Write</span>, and{" "}
            <span className="font-mono">Coupons: Write</span> — nothing more.
          </p>
        </div>

        {isFullStripeSecretKey(key) && (
          <Alert className="border-warning/40 bg-warning/10 [&>svg]:text-warning">
            <TriangleAlert />
            <AlertTitle>This looks like a full secret key</AlertTitle>
            <AlertDescription>
              We strongly recommend a restricted key (rk_...) scoped to only the permissions above,
              so CancelKit never has more access to your Stripe account than it needs.
            </AlertDescription>
          </Alert>
        )}

        {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Validating…" : "Connect Stripe"}
        </Button>
      </form>

      <form action={skipStripeKey}>
        <input type="hidden" name="projectId" value={projectId} />
        <Button type="submit" variant="ghost" className="w-full">
          Skip for now
        </Button>
      </form>
    </div>
  );
}
