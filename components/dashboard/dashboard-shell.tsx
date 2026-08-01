import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import type { Project } from "@/lib/types";

export function DashboardShell({
  projects,
  activeProjectId,
  userEmail,
  children,
}: {
  projects: Project[];
  activeProjectId: string;
  userEmail: string;
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
        />
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
