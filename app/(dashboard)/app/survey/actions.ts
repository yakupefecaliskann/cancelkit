"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";

export type ReasonFormState = { status: "idle" | "success" | "error"; message?: string };

/** Result for lightweight mutations invoked outside a form-state hook. */
export type MutationResult = { ok: boolean; message?: string };

const GENERIC_SAVE_ERROR = "We couldn't save your changes. Please try again.";

export async function addReason(
  _prevState: ReasonFormState,
  formData: FormData,
): Promise<ReasonFormState> {
  const { active } = await getProjectsAndActive();
  if (!active) {
    return { status: "error", message: "No active project." };
  }

  const label = String(formData.get("label") ?? "").trim();
  if (!label) {
    return { status: "error", message: "Give the reason a label." };
  }

  const supabase = await createClient();
  const { count } = await supabase
    .from("survey_reasons")
    .select("id", { count: "exact", head: true })
    .eq("project_id", active.id);

  const { error } = await supabase
    .from("survey_reasons")
    .insert({ project_id: active.id, label, sort_order: count ?? 0 });

  if (error) {
    // ERR-8: raw detail to the server log, generic copy to the user.
    console.error("[cancelkit] reason insert failed:", error.message);
    return { status: "error", message: GENERIC_SAVE_ERROR };
  }

  revalidatePath("/app/survey");
  return { status: "success" };
}

export async function updateReasonLabel(formData: FormData): Promise<MutationResult> {
  const reasonId = String(formData.get("reasonId") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  if (!reasonId || !label) return { ok: false, message: GENERIC_SAVE_ERROR };

  // GDPR-3: scope by the active project's id (defense-in-depth on top of RLS).
  const { active } = await getProjectsAndActive();
  if (!active) return { ok: false, message: "No active project." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("survey_reasons")
    .update({ label })
    .eq("id", reasonId)
    .eq("project_id", active.id);

  if (error) {
    // ERR-2: no longer swallowed.
    console.error("[cancelkit] reason rename failed:", error.message);
    return { ok: false, message: GENERIC_SAVE_ERROR };
  }
  revalidatePath("/app/survey");
  return { ok: true };
}

export async function deleteReason(formData: FormData): Promise<MutationResult> {
  const reasonId = String(formData.get("reasonId") ?? "");
  if (!reasonId) return { ok: false, message: GENERIC_SAVE_ERROR };

  const { active } = await getProjectsAndActive();
  if (!active) return { ok: false, message: "No active project." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("survey_reasons")
    .delete()
    .eq("id", reasonId)
    .eq("project_id", active.id);

  if (error) {
    console.error("[cancelkit] reason delete failed:", error.message);
    return { ok: false, message: GENERIC_SAVE_ERROR };
  }
  revalidatePath("/app/survey");
  return { ok: true };
}

export async function moveReason(formData: FormData): Promise<MutationResult> {
  const reasonId = String(formData.get("reasonId") ?? "");
  const direction = String(formData.get("direction") ?? "");
  const { active } = await getProjectsAndActive();
  if (!active || !reasonId) return { ok: false, message: GENERIC_SAVE_ERROR };

  const supabase = await createClient();
  const { data: reasons, error: loadError } = await supabase
    .from("survey_reasons")
    .select("id, sort_order")
    .eq("project_id", active.id)
    .order("sort_order", { ascending: true });

  if (loadError) {
    console.error("[cancelkit] reason reorder load failed:", loadError.message);
    return { ok: false, message: GENERIC_SAVE_ERROR };
  }
  if (!reasons) return { ok: false, message: GENERIC_SAVE_ERROR };

  const index = reasons.findIndex((r) => r.id === reasonId);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= reasons.length) {
    return { ok: false, message: GENERIC_SAVE_ERROR };
  }

  const current = reasons[index];
  const swap = reasons[swapIndex];

  const [a, b] = await Promise.all([
    supabase
      .from("survey_reasons")
      .update({ sort_order: swap.sort_order })
      .eq("id", current.id)
      .eq("project_id", active.id),
    supabase
      .from("survey_reasons")
      .update({ sort_order: current.sort_order })
      .eq("id", swap.id)
      .eq("project_id", active.id),
  ]);

  if (a.error || b.error) {
    console.error("[cancelkit] reason reorder failed:", a.error?.message ?? b.error?.message);
    return { ok: false, message: GENERIC_SAVE_ERROR };
  }
  revalidatePath("/app/survey");
  return { ok: true };
}
