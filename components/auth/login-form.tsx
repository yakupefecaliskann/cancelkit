"use client";

import { useActionState } from "react";
import { sendMagicLink, signInWithGoogle, type MagicLinkState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const initialState: MagicLinkState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(sendMagicLink, initialState);

  return (
    <div className="space-y-6">
      <form action={signInWithGoogle}>
        <Button type="submit" variant="outline" className="w-full">
          Continue with Google
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <form action={formAction} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@yourcompany.com"
            autoComplete="email"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Sending…" : "Send magic link"}
        </Button>
        {state.status === "success" && (
          <p className="text-sm text-success">{state.message}</p>
        )}
        {state.status === "error" && (
          <p className="text-sm text-destructive">{state.message}</p>
        )}
      </form>
    </div>
  );
}
