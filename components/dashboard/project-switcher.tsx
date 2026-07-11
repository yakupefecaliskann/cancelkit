"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setActiveProject } from "@/app/(dashboard)/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectSwitcher({
  projects,
  activeId,
}: {
  projects: { id: string; name: string }[];
  activeId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      items={projects.map((project) => ({ value: project.id, label: project.name }))}
      value={activeId}
      disabled={isPending || projects.length <= 1}
      onValueChange={(value) => {
        if (!value) return;
        startTransition(async () => {
          await setActiveProject(value);
          router.refresh();
        });
      }}
    >
      <SelectTrigger size="sm" className="w-28 sm:w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
