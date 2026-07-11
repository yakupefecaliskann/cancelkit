"use client";

import { useActionState, useEffect, useState } from "react";
import { saveOffer, type SaveOfferState } from "@/app/(dashboard)/app/offers/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import type { Offer } from "@/lib/types";

const initialState: SaveOfferState = { status: "idle" };

export function OfferForm({ offer, onSaved }: { offer?: Offer; onSaved: () => void }) {
  const [state, formAction, isPending] = useActionState(saveOffer, initialState);
  const [type, setType] = useState<"discount" | "pause">(offer?.type ?? "discount");

  useEffect(() => {
    if (state.status === "success") onSaved();
  }, [state, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      {offer && <input type="hidden" name="offerId" value={offer.id} />}
      <input type="hidden" name="type" value={type} />

      <div className="space-y-1.5">
        <Label>Offer type</Label>
        <Select value={type} onValueChange={(value) => setType(value as "discount" | "pause")}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="discount">Discount</SelectItem>
            <SelectItem value="pause">Pause subscription</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          name="headline"
          defaultValue={offer?.headline}
          placeholder="Stay for 20% off"
          required
        />
      </div>

      {type === "discount" ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="percentOff">Discount %</Label>
            <Input
              id="percentOff"
              name="percentOff"
              type="number"
              min={1}
              max={100}
              defaultValue={offer?.percent_off ?? 20}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="durationMonths">Duration (months)</Label>
            <Input
              id="durationMonths"
              name="durationMonths"
              type="number"
              min={1}
              defaultValue={offer?.duration_months ?? 3}
              required
            />
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label htmlFor="pauseMonths">Pause length (months)</Label>
          <Input
            id="pauseMonths"
            name="pauseMonths"
            type="number"
            min={1}
            defaultValue={offer?.pause_months ?? 1}
            required
          />
        </div>
      )}

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : offer ? "Save changes" : "Create offer"}
        </Button>
      </DialogFooter>
    </form>
  );
}
