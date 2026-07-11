import { redirect } from "next/navigation";
import { computeBillingState, type BillingState } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { UpgradeWall } from "@/components/dashboard/upgrade-wall";
import type { Profile } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Profile>();

  // The signup trigger guarantees a profile row; if it is somehow missing we
  // fail open (dashboard keeps working) rather than lock a paying user out.
  const billing: BillingState = profile
    ? computeBillingState(profile)
    : { plan: "pro", trialDaysLeft: 0, showBadge: false, widgetEnabled: true };

  if (billing.plan === "locked") {
    return <UpgradeWall userEmail={user.email ?? ""} />;
  }

  const { projects, active, error } = await getProjectsAndActive();

  // ERR-3: a DB failure loading projects throws into the dashboard error
  // boundary (retry-able) rather than silently redirecting to onboarding.
  if (error) {
    throw new Error("Failed to load your projects.");
  }

  if (!active) {
    redirect("/onboarding");
  }

  return (
    <DashboardShell
      projects={projects}
      activeProjectId={active.id}
      userEmail={user.email ?? ""}
      billing={billing}
    >
      {children}
    </DashboardShell>
  );
}
