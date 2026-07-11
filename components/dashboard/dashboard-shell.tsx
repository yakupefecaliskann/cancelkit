import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { BillingState } from "@/lib/billing";
import type { Project } from "@/lib/types";

export function DashboardShell({
  projects,
  activeProjectId,
  userEmail,
  billing,
  children,
}: {
  projects: Project[];
  activeProjectId: string;
  userEmail: string;
  billing: BillingState;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          projects={projects}
          activeProjectId={activeProjectId}
          userEmail={userEmail}
          billing={billing}
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
