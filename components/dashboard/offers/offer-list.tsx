"use client";

import { useTransition } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/dashboard/confirm-delete-button";
import { OfferDialog } from "@/components/dashboard/offers/offer-dialog";
import { setOfferActive, deleteOffer } from "@/app/(dashboard)/app/offers/actions";
import type { Offer } from "@/lib/types";

function describeOffer(offer: Offer): string {
  if (offer.type === "discount") {
    const months = offer.duration_months ?? 1;
    return `${offer.percent_off}% off for ${months} month${months === 1 ? "" : "s"}`;
  }
  const months = offer.pause_months ?? 1;
  return `Pause billing for ${months} month${months === 1 ? "" : "s"}`;
}

export function OfferList({ offers }: { offers: Offer[] }) {
  return (
    <Card>
      <CardContent className="divide-y divide-border p-0">
        {offers.map((offer) => (
          <OfferRow key={offer.id} offer={offer} />
        ))}
      </CardContent>
    </Card>
  );
}

function OfferRow({ offer }: { offer: Offer }) {
  const [isPending, startTransition] = useTransition();

  function toggleActive(nextActive: boolean) {
    const formData = new FormData();
    formData.set("offerId", offer.id);
    formData.set("isActive", String(nextActive));
    startTransition(async () => {
      const result = await setOfferActive(formData);
      if (!result.ok) toast.error(result.message ?? "Couldn't update the offer.");
    });
  }

  async function remove() {
    const formData = new FormData();
    formData.set("offerId", offer.id);
    const result = await deleteOffer(formData);
    if (!result.ok) toast.error(result.message ?? "Couldn't delete the offer.");
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{offer.headline}</span>
          <Badge variant="secondary">{offer.type === "discount" ? "Discount" : "Pause"}</Badge>
        </div>
        <p className="text-xs text-muted-foreground">{describeOffer(offer)}</p>
      </div>
      <Switch checked={offer.is_active} disabled={isPending} onCheckedChange={toggleActive} />
      <OfferDialog
        offer={offer}
        trigger={
          <Button variant="outline" size="icon-sm">
            <Pencil />
            <span className="sr-only">Edit offer</span>
          </Button>
        }
      />
      <ConfirmDeleteButton onConfirm={remove} label="Delete offer" />
    </div>
  );
}
