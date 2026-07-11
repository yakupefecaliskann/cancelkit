import { signOut } from "@/app/(dashboard)/app/actions";
import { ProjectSwitcher } from "@/components/dashboard/project-switcher";
import { UpgradeButton } from "@/components/dashboard/upgrade-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BillingState } from "@/lib/billing";
import type { Project } from "@/lib/types";

function BillingIndicator({ billing }: { billing: BillingState }) {
  if (billing.plan === "trial") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-normal text-muted-foreground">
          Trial · {billing.trialDaysLeft} {billing.trialDaysLeft === 1 ? "day" : "days"} left
        </Badge>
        <UpgradeButton />
      </div>
    );
  }
  if (billing.plan === "past_due") {
    return (
      <Badge className="bg-warning/10 font-normal text-warning">
        Payment issue — check your billing email
      </Badge>
    );
  }
  return null;
}

export function Topbar({
  projects,
  activeProjectId,
  userEmail,
  billing,
}: {
  projects: Project[];
  activeProjectId: string;
  userEmail: string;
  billing: BillingState;
}) {
  const initial = userEmail.charAt(0).toUpperCase() || "?";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-6">
      <ProjectSwitcher
        projects={projects.map((p) => ({ id: p.id, name: p.name }))}
        activeId={activeProjectId}
      />

      <div className="flex items-center gap-4">
        <BillingIndicator billing={billing} />

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
