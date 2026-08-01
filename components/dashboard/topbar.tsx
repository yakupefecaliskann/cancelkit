import { signOut } from "@/app/(dashboard)/app/actions";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { ProjectSwitcher } from "@/components/dashboard/project-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/lib/types";

export function Topbar({
  projects,
  activeProjectId,
  userEmail,
}: {
  projects: Project[];
  activeProjectId: string;
  userEmail: string;
}) {
  const initial = userEmail.charAt(0).toUpperCase() || "?";

  return (
    <header className="relative flex h-14 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileNav />
        <ProjectSwitcher
          projects={projects.map((p) => ({ id: p.id, name: p.name }))}
          activeId={activeProjectId}
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar className="size-8 cursor-pointer">
              <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal text-muted-foreground">
                {userEmail}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0" variant="destructive">
              <form action={signOut} className="w-full">
                <button type="submit" className="w-full px-1.5 py-1 text-left">
                  Sign out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
