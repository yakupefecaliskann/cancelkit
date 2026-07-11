"use client";

import { useActionState, useState } from "react";
import { deleteProject, type DeleteProjectState } from "@/app/(dashboard)/app/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialState: DeleteProjectState = { status: "idle" };

export function DangerZone({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [state, formAction, isPending] = useActionState(deleteProject, initialState);

  const canDelete = confirmText.trim() === projectName;

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-base text-destructive">Danger zone</CardTitle>
        <CardDescription>
          Deleting a project permanently removes its widget key, offers, survey reasons, and cancel session
          history. This can&apos;t be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) setConfirmText("");
          }}
        >
          <DialogTrigger
            render={
              <Button variant="destructive" size="sm">
                Delete project
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
              <DialogDescription>
                This permanently deletes the project, its widget key, offers, survey reasons, and all recorded
                cancel sessions. Type the project name to confirm.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="space-y-3">
              <input type="hidden" name="projectId" value={projectId} />
              <input type="hidden" name="expectedName" value={projectName} />
              <div className="space-y-1.5">
                <Label htmlFor="confirmName">Type &ldquo;{projectName}&rdquo; to confirm</Label>
                <Input
                  id="confirmName"
                  name="confirmName"
                  value={confirmText}
                  onChange={(event) => setConfirmText(event.target.value)}
                  autoComplete="off"
                />
              </div>
              {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
                <Button type="submit" variant="destructive" disabled={!canDelete || isPending}>
                  {isPending ? "Deleting…" : "Delete project"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
