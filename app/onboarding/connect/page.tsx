import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { StripeKeyForm } from "@/components/onboarding/stripe-key-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Connect Stripe — CancelKit",
};

export default async function ConnectStripePage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string }>;
}) {
  const { project: projectId } = await searchParams;
  if (!projectId) {
    redirect("/onboarding");
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <OnboardingProgress step={2} />
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl tracking-tight">Connect Stripe</CardTitle>
            <CardDescription>
              Needed so CancelKit can apply discounts and pauses when a customer accepts a save offer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StripeKeyForm projectId={project.id} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
