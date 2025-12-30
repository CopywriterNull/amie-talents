"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Plan {
  id: string;
  name: string;
  type: "trial_time" | "trial_usage" | "paid";
  template_limit: number | null;
  trial_days: number | null;
  is_default: boolean;
  is_active: boolean;
}

interface PlansManagerProps {
  initialPlans: Plan[];
}

export function PlansManager({ initialPlans }: PlansManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"trial_time" | "trial_usage" | "paid">("trial_time");
  const [trialDays, setTrialDays] = useState("14");
  const [templateLimit, setTemplateLimit] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          trial_days: type === "trial_time" ? parseInt(trialDays) : null,
          template_limit:
            type === "trial_usage" || type === "paid"
              ? templateLimit
                ? parseInt(templateLimit)
                : null
              : null,
          is_default: isDefault,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
      setName("");
      setTrialDays("14");
      setTemplateLimit("");
      setIsDefault(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Create New Plan</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            Plan created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Starter Plan"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Plan Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial_time">Time-based Trial</SelectItem>
                  <SelectItem value="trial_usage">Usage-based Trial</SelectItem>
                  <SelectItem value="paid">Paid Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === "trial_time" && (
              <div className="space-y-2">
                <Label htmlFor="trialDays">Trial Duration (days)</Label>
                <Input
                  id="trialDays"
                  type="number"
                  value={trialDays}
                  onChange={(e) => setTrialDays(e.target.value)}
                  min="1"
                  required
                />
              </div>
            )}

            {(type === "trial_usage" || type === "paid") && (
              <div className="space-y-2">
                <Label htmlFor="templateLimit">
                  Template Limit {type === "paid" && "(leave empty for unlimited)"}
                </Label>
                <Input
                  id="templateLimit"
                  type="number"
                  value={templateLimit}
                  onChange={(e) => setTemplateLimit(e.target.value)}
                  min="1"
                  placeholder={type === "paid" ? "Unlimited" : ""}
                  required={type === "trial_usage"}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
            <Label htmlFor="isDefault" className="text-sm">
              Set as default plan for new signups
            </Label>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Plan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
