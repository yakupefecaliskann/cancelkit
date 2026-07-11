"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OfferForm } from "@/components/dashboard/offers/offer-form";
import type { Offer } from "@/lib/types";

export function OfferDialog({ offer, trigger }: { offer?: Offer; trigger: React.ReactElement }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{offer ? "Edit offer" : "Create offer"}</DialogTitle>
          <DialogDescription>
            Shown to customers on the second step of the cancel flow, right after the exit survey.
          </DialogDescription>
        </DialogHeader>
        <OfferForm offer={offer} onSaved={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
