import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export const ACTIVE_PROJECT_COOKIE = "ck_active_project";

export async function getProjectsAndActive(): Promise<{
  projects: Project[];
  active: Project | null;
  /** True when the projects query itself failed (DB/infra), as opposed to the
   *  user genuinely having no projects — callers must not treat this as empty. */
  error: boolean;
}> {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  // ERR-3: a transient DB error must not be mistaken for "no projects" (which
  // would bounce an existing customer back into onboarding). Surface it.
  if (error) {
    console.error("[cancelkit] projects load failed:", error.message);
    return { projects: [], active: null, error: true };
  }

  if (!projects || projects.length === 0) {
    return { projects: [], active: null, error: false };
  }

  const cookieStore = await cookies();
  const requestedId = cookieStore.get(ACTIVE_PROJECT_COOKIE)?.value;
  const active = projects.find((p) => p.id === requestedId) ?? projects[0];

  return { projects: projects as Project[], active: active as Project, error: false };
}
