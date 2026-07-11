import { ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { ReasonList } from "@/components/dashboard/survey/reason-list";
import { AddReasonForm } from "@/components/dashboard/survey/add-reason-form";
import type { SurveyReason } from "@/lib/types";

export default async function SurveyPage() {
  const { active } = await getProjectsAndActive();
  if (!active) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("survey_reasons")
    .select("*")
    .eq("project_id", active.id)
    .order("sort_order", { ascending: true });

  const header = (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Survey</h1>
      <p className="text-sm text-muted-foreground">
        Reasons shown to customers on the exit survey step. Reorder, rename, add, or remove them.
      </p>
    </div>
  );

  if (error) {
    console.error("[cancelkit] survey page load failed:", error.message);
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message="We couldn't load your survey reasons. Please try again." />
      </div>
    );
  }

  const reasons = (data ?? []) as SurveyReason[];

  if (reasons.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          icon={ClipboardList}
          title="No survey reasons yet"
          description="Add at least one reason so customers can tell you why they're cancelling."
        />
        <Card>
          <CardContent className="p-0">
            <AddReasonForm />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <Card>
        <CardContent className="divide-y divide-border p-0">
          <ReasonList reasons={reasons} />
          <AddReasonForm />
        </CardContent>
      </Card>
    </div>
  );
}
