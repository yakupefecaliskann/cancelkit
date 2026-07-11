import { getProjectsAndActive } from "@/lib/active-project";
import { SnippetBox } from "@/components/snippet-box";
import { AllowedOriginsEditor } from "@/components/onboarding/allowed-origins-editor";
import { StripeKeySettingsForm } from "@/components/dashboard/stripe-key-settings-form";
import { ProjectDetailsForm } from "@/components/dashboard/project-details-form";
import { DangerZone } from "@/components/dashboard/danger-zone";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const { active } = await getProjectsAndActive();

  if (!active) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">{active.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project details</CardTitle>
          <CardDescription>Name and accent color used in the widget.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectDetailsForm projectId={active.id} name={active.name} accentColor={active.accent_color} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Stripe connection</CardTitle>
          <CardDescription>
            {active.encrypted_stripe_key ? (
              <Badge className="bg-success text-success-foreground">Connected</Badge>
            ) : (
              <Badge variant="outline">Not connected</Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StripeKeySettingsForm projectId={active.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Widget snippet</CardTitle>
          <CardDescription>Install this on your site, right before the closing body tag.</CardDescription>
        </CardHeader>
        <CardContent>
          <SnippetBox publishableKey={active.publishable_key} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Allowed origins</CardTitle>
          <CardDescription>Domains permitted to call the widget API with this project&apos;s key.</CardDescription>
        </CardHeader>
        <CardContent>
          <AllowedOriginsEditor projectId={active.id} initialOrigins={active.allowed_origins ?? []} />
        </CardContent>
      </Card>

      <DangerZone projectId={active.id} projectName={active.name} />
    </div>
  );
}
