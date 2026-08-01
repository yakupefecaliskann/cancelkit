import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

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
    >
      {children}
    </DashboardShell>
  );
}
