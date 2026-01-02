"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BrandActionsProps {
  brand: {
    id: string;
    name: string;
    subscription: {
      id: string;
      status: string;
      trial_type: string | null;
      trial_ends_at: string | null;
      trial_template_limit: number | null;
      trial_templates_used: number;
      admin_notes: string | null;
    } | null;
    klaviyo_connection: {
      id: string;
    } | null;
  };
}

export function BrandActions({ brand }: BrandActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trial dialog state
  const [trialDialogOpen, setTrialDialogOpen] = useState(false);
  const [trialType, setTrialType] = useState<"time" | "usage">("time");
  const [trialValue, setTrialValue] = useState("14");

  // Extend dialog state
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendValue, setExtendValue] = useState("7");

  // Suspend dialog state
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  // Notes dialog state
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [notes, setNotes] = useState(brand.subscription?.admin_notes || "");

  async function handleStartTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          type: trialType,
          value: parseInt(trialValue),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTrialDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start trial");
    } finally {
      setLoading(false);
    }
  }

  async function handleExtendTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "extend",
          value: parseInt(extendValue),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setExtendDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extend trial");
    } finally {
      setLoading(false);
    }
  }

  async function handleEndTrial() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to end trial");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate");
    } finally {
      setLoading(false);
    }
  }

  async function handleSuspend() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: suspendReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuspendDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend");
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsuspend() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/suspend`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unsuspend");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateNotes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setNotesDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update notes");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnectKlaviyo() {
    if (!confirm("Are you sure you want to disconnect Klaviyo for this brand?")) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/brands/${brand.id}/klaviyo`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to disconnect Klaviyo");
    } finally {
      setLoading(false);
    }
  }

  const isSuspended = brand.subscription?.status === "suspended";
  const isOnTrial = brand.subscription?.status === "trial";
  const isActive = brand.subscription?.status === "active";

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {/* Start Trial */}
          <Dialog open={trialDialogOpen} onOpenChange={setTrialDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Start Trial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start Trial for {brand.name}</DialogTitle>
                <DialogDescription>
                  Configure the trial type and duration for this brand.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Trial Type</Label>
                  <Select
                    value={trialType}
                    onValueChange={(v) => setTrialType(v as "time" | "usage")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time">Time-based (days)</SelectItem>
                      <SelectItem value="usage">Usage-based (templates)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    {trialType === "time" ? "Days" : "Templates"}
                  </Label>
                  <Input
                    type="number"
                    value={trialValue}
                    onChange={(e) => setTrialValue(e.target.value)}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    {trialType === "time"
                      ? "Number of days for the trial period"
                      : "Number of templates they can process"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setTrialDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStartTrial} disabled={loading}>
                  {loading ? "Starting..." : "Start Trial"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Extend Trial */}
          {isOnTrial && (
            <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Extend Trial
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Extend Trial for {brand.name}</DialogTitle>
                  <DialogDescription>
                    Add more {brand.subscription?.trial_type === "time" ? "days" : "templates"} to the current trial.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>
                      Additional {brand.subscription?.trial_type === "time" ? "Days" : "Templates"}
                    </Label>
                    <Input
                      type="number"
                      value={extendValue}
                      onChange={(e) => setExtendValue(e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExtendDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleExtendTrial} disabled={loading}>
                    {loading ? "Extending..." : "Extend Trial"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* End Trial */}
          {isOnTrial && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEndTrial}
              disabled={loading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              End Trial
            </Button>
          )}

          {/* Activate (convert to full plan) */}
          {!isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleActivate}
              disabled={loading}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              Activate
            </Button>
          )}

          {/* Suspend / Unsuspend */}
          {isSuspended ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnsuspend}
              disabled={loading}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              Unsuspend
            </Button>
          ) : (
            <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  Suspend
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Suspend {brand.name}</DialogTitle>
                  <DialogDescription>
                    This will prevent the brand from processing any templates.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Reason (optional)</Label>
                    <Textarea
                      value={suspendReason}
                      onChange={(e) => setSuspendReason(e.target.value)}
                      placeholder="Enter reason for suspension..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSuspend}
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {loading ? "Suspending..." : "Suspend Brand"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Admin Notes */}
          <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit Notes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Admin Notes for {brand.name}</DialogTitle>
                <DialogDescription>
                  Add internal notes about this brand.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter admin notes..."
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateNotes} disabled={loading}>
                  {loading ? "Saving..." : "Save Notes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Disconnect Klaviyo */}
          {brand.klaviyo_connection && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnectKlaviyo}
              disabled={loading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Disconnect Klaviyo
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
