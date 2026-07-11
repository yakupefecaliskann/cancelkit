import { Plus, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProjectsAndActive } from "@/lib/active-project";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { OfferList } from "@/components/dashboard/offers/offer-list";
import { OfferDialog } from "@/components/dashboard/offers/offer-dialog";
import { Button } from "@/components/ui/button";
import type { Offer } from "@/lib/types";

export default async function OffersPage() {
  const { active } = await getProjectsAndActive();
  if (!active) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .eq("project_id", active.id)
    .order("sort_order", { ascending: true });

  const header = (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Offers</h1>
        <p className="text-sm text-muted-foreground">
          Discount and pause offers shown when a customer tries to cancel.
        </p>
      </div>
      <OfferDialog
        trigger={
          <Button size="sm">
            <Plus /> Create offer
          </Button>
        }
      />
    </div>
  );

  if (error) {
    console.error("[cancelkit] offers page load failed:", error.message);
    return (
      <div className="space-y-6">
        {header}
        <ErrorState message="We couldn't load your offers. Please try again." />
      </div>
    );
  }

  const offers = (data ?? []) as Offer[];

  if (offers.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <EmptyState
          icon={Tag}
          title="No offers configured"
          description="Offers let you save customers with a discount or a subscription pause instead of losing them. Create your first offer to start showing it in the widget."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      <OfferList offers={offers} />
    </div>
  );
}
