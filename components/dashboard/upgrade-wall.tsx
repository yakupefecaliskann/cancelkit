import { Lock } from "lucide-react";
import { signOut } from "@/app/(dashboard)/app/actions";
import { UpgradeButton } from "@/components/dashboard/upgrade-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Full-page paywall shown instead of the dashboard when the trial has ended
 * (or the subscription expired). The widget config API is disabled in the
 * same state, so upgrading is the only way forward.
 */
export function UpgradeWall({ userEmail }: { userEmail: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="size-5 text-primary" aria-hidden />
          </div>
          <CardTitle>Your trial has ended</CardTitle>
          <CardDescription>
            Your widget is paused and no longer shows on your site. Upgrade to Pro to turn it back
            on and keep recovering cancellations — $29/month, cancel anytime.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <UpgradeButton size="lg" className="w-full">
            Upgrade to Pro — $29/mo
          </UpgradeButton>
          <p className="text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{userEmail}</span>
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Sign out
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
