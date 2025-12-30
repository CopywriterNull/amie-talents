import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlansManager } from "./plans-manager";

interface Plan {
  id: string;
  name: string;
  type: "trial_time" | "trial_usage" | "paid";
  template_limit: number | null;
  trial_days: number | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
}

async function getPlans(): Promise<Plan[]> {
  const supabase = await createClient();

  const { data: plans, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }

  return plans || [];
}

export default async function PlansPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#171717]">Plans</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage subscription plans and trial configurations
        </p>
      </div>

      {/* Plans Manager */}
      <PlansManager initialPlans={plans} />

      {/* Existing Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {plans.length} Plan{plans.length !== 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No plans created yet. Create your first plan above.
            </p>
          ) : (
            <div className="divide-y">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        plan.type === "paid"
                          ? "bg-green-100"
                          : plan.type === "trial_time"
                          ? "bg-blue-100"
                          : "bg-purple-100"
                      }`}
                    >
                      {plan.type === "paid" ? (
                        <svg
                          className="w-5 h-5 text-green-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="1" y="4" width="22" height="16" rx="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      ) : plan.type === "trial_time" ? (
                        <svg
                          className="w-5 h-5 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5 text-purple-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#171717]">{plan.name}</p>
                        {plan.is_default && (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px]">
                            Default
                          </Badge>
                        )}
                        {!plan.is_active && (
                          <Badge variant="outline" className="text-gray-400 text-[10px]">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {plan.type === "trial_time" && plan.trial_days
                          ? `${plan.trial_days} day trial`
                          : plan.type === "trial_usage" && plan.template_limit
                          ? `${plan.template_limit} template trial`
                          : plan.type === "paid"
                          ? plan.template_limit
                            ? `${plan.template_limit} templates/month`
                            : "Unlimited templates"
                          : "No limits"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        plan.type === "paid"
                          ? "border-green-200 text-green-700"
                          : plan.type === "trial_time"
                          ? "border-blue-200 text-blue-700"
                          : "border-purple-200 text-purple-700"
                      }
                    >
                      {plan.type === "paid"
                        ? "Paid"
                        : plan.type === "trial_time"
                        ? "Time Trial"
                        : "Usage Trial"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
