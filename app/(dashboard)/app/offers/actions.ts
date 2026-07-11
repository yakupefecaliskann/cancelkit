"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";

export type SaveOfferState = { status: "idle" | "success" | "error"; message?: string };

/** Result for lightweight mutations invoked outside a form-state hook. */
export type MutationResult = { ok: boolean; message?: string };

const GENERIC_SAVE_ERROR = "We couldn't save your changes. Please try again.";

export async function saveOffer(
  _prevState: SaveOfferState,
  formData: FormData,
): Promise<SaveOfferState> {
  const { active } = await getProjectsAndActive();
  if (!active) {
    return { status: "error", message: "No active project." };
  }

  const offerId = String(formData.get("offerId") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const headline = String(formData.get("headline") ?? "").trim();

  if (type !== "discount" && type !== "pause") {
    return { status: "error", message: "Choose an offer type." };
  }
  if (!headline) {
    return { status: "error", message: "Give the offer a headline." };
  }

  let percentOff: number | null = null;
  let durationMonths: number | null = null;
  let pauseMonths: number | null = null;

  if (type === "discount") {
    percentOff = Number(formData.get("percentOff"));
    durationMonths = Number(formData.get("durationMonths"));
    if (!Number.isInteger(percentOff) || percentOff < 1 || percentOff > 100) {
      return { status: "error", message: "Discount must be a whole percentage between 1 and 100." };
    }
    if (!Number.isInteger(durationMonths) || durationMonths < 1) {
      return { status: "error", message: "Duration must be at least 1 month." };
    }
  } else {
    pauseMonths = Number(formData.get("pauseMonths"));
    if (!Number.isInteger(pauseMonths) || pauseMonths < 1) {
      return { status: "error", message: "Pause length must be at least 1 month." };
    }
  }

  const supabase = await createClient();

  if (offerId) {
    const { error } = await supabase
      .from("offers")
      .update({
        type,
        headline,
        percent_off: percentOff,
        duration_months: durationMonths,
        pause_months: pauseMonths,
      })
      .eq("id", offerId)
      .eq("project_id", active.id);

    if (error) {
      // ERR-8: log the raw Postgres detail server-side, show generic copy.
      console.error("[cancelkit] offer update failed:", error.message);
      return { status: "error", message: GENERIC_SAVE_ERROR };
    }
    revalidatePath("/app/offers");
    return { status: "success", message: "Offer updated." };
  }

  const { count } = await supabase
    .from("offers")
    .select("id", { count: "exact", head: true })
    .eq("project_id", active.id);

  const { error } = await supabase.from("offers").insert({
    project_id: active.id,
    type,
    headline,
    percent_off: percentOff,
    duration_months: durationMonths,
    pause_months: pauseMonths,
    sort_order: count ?? 0,
  });

  if (error) {
    console.error("[cancelkit] offer insert failed:", error.message);
    return { status: "error", message: GENERIC_SAVE_ERROR };
  }

  revalidatePath("/app/offers");
  return { status: "success", message: "Offer created." };
}

export async function setOfferActive(formData: FormData): Promise<MutationResult> {
  const offerId = String(formData.get("offerId") ?? "");
  const isActive = formData.get("isActive") === "true";
  if (!offerId) return { ok: false, message: GENERIC_SAVE_ERROR };

  // GDPR-3: scope by the active project's id (defense-in-depth on top of RLS).
  const { active } = await getProjectsAndActive();
  if (!active) return { ok: false, message: "No active project." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("offers")
    .update({ is_active: isActive })
    .eq("id", offerId)
    .eq("project_id", active.id);

  if (error) {
    // ERR-2: no longer swallowed — report so the UI can surface a toast.
    console.error("[cancelkit] offer toggle failed:", error.message);
    return { ok: false, message: GENERIC_SAVE_ERROR };
  }
  revalidatePath("/app/offers");
  return { ok: true };
}

export async function deleteOffer(formData: FormData): Promise<MutationResult> {
  const offerId = String(formData.get("offerId") ?? "");
  if (!offerId) return { ok: false, message: GENERIC_SAVE_ERROR };

  const { active } = await getProjectsAndActive();
  if (!active) return { ok: false, message: "No active project." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", offerId)
    .eq("project_id", active.id);

  if (error) {
    console.error("[cancelkit] offer delete failed:", error.message);
    return { ok: false, message: GENERIC_SAVE_ERROR };
  }
  revalidatePath("/app/offers");
  return { ok: true };
}
