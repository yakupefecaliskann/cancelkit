import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { SnippetBox } from "@/components/snippet-box";
import { AllowedOriginsEditor } from "@/components/onboarding/allowed-origins-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Install the snippet — CancelKit",
};

export default async function SnippetOnboardingPage({
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
    .select("id, publishable_key, allowed_origins")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) {
    redirect("/onboarding");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <OnboardingProgress step={3} />
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl tracking-tight">Install the snippet</CardTitle>
            <CardDescription>
              Paste this before the closing <span className="font-mono">&lt;/body&gt;</span> tag on your site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SnippetBox publishableKey={project.publishable_key} />
            <AllowedOriginsEditor projectId={project.id} initialOrigins={project.allowed_origins ?? []} />
            <Button
              className="w-full"
              nativeButton={false}
              render={<a href="/app/overview">Go to dashboard</a>}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
