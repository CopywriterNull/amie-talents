import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionStatus } from "@/lib/admin";

export interface SubscriptionStatusResponse {
  hasTeam: boolean;
  hasSubscription: boolean;
  status: "active" | "trial" | "expired" | "suspended" | "none";
  canProcess: boolean;
  trialType: "time" | "usage" | null;
  trialEndsAt: string | null;
  trialTemplatesUsed: number;
  trialTemplateLimit: number | null;
  remainingTemplates: number | null;
  daysRemaining: number | null;
  teamName: string | null;
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's team membership
    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id, teams(id, name)")
      .eq("user_id", user.id)
      .single();

    if (!membership?.team_id) {
      return NextResponse.json({
        hasTeam: false,
        hasSubscription: false,
        status: "none",
        canProcess: true, // Allow processing for users without teams (legacy/individual)
        trialType: null,
        trialEndsAt: null,
        trialTemplatesUsed: 0,
        trialTemplateLimit: null,
        remainingTemplates: null,
        daysRemaining: null,
        teamName: null,
      } satisfies SubscriptionStatusResponse);
    }

    const teamId = membership.team_id;
    // Normalize Supabase relations that may come as arrays
    const rawTeam = membership.teams;
    const team = (Array.isArray(rawTeam) ? rawTeam[0] : rawTeam) as { id: string; name: string } | null;

    // Get subscription
    const { data: subscription } = await supabase
      .from("team_subscriptions")
      .select("*")
      .eq("team_id", teamId)
      .single();

    if (!subscription) {
      return NextResponse.json({
        hasTeam: true,
        hasSubscription: false,
        status: "none",
        canProcess: false, // No subscription = can't process
        trialType: null,
        trialEndsAt: null,
        trialTemplatesUsed: 0,
        trialTemplateLimit: null,
        remainingTemplates: null,
        daysRemaining: null,
        teamName: team?.name || null,
      } satisfies SubscriptionStatusResponse);
    }

    // Calculate status
    const computedStatus = getSubscriptionStatus(subscription);
    const isExpired = computedStatus === "expired" || subscription.status === "expired";
    const isSuspended = subscription.status === "suspended";

    // Calculate remaining
    let remainingTemplates: number | null = null;
    let daysRemaining: number | null = null;

    if (subscription.trial_type === "usage" && subscription.trial_template_limit !== null) {
      remainingTemplates = Math.max(0, subscription.trial_template_limit - subscription.trial_templates_used);
    }

    if (subscription.trial_type === "time" && subscription.trial_ends_at) {
      const endDate = new Date(subscription.trial_ends_at);
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    // Determine if can process
    let canProcess = true;
    if (isSuspended) {
      canProcess = false;
    } else if (isExpired) {
      canProcess = false;
    } else if (subscription.trial_type === "usage" && remainingTemplates === 0) {
      canProcess = false;
    }

    // Determine display status
    let displayStatus: "active" | "trial" | "expired" | "suspended" | "none" = subscription.status;
    if (isSuspended) {
      displayStatus = "suspended";
    } else if (isExpired) {
      displayStatus = "expired";
    } else if (subscription.status === "trial" && !isExpired) {
      displayStatus = "trial";
    } else if (subscription.status === "active") {
      displayStatus = "active";
    }

    return NextResponse.json({
      hasTeam: true,
      hasSubscription: true,
      status: displayStatus,
      canProcess,
      trialType: subscription.trial_type,
      trialEndsAt: subscription.trial_ends_at,
      trialTemplatesUsed: subscription.trial_templates_used,
      trialTemplateLimit: subscription.trial_template_limit,
      remainingTemplates,
      daysRemaining,
      teamName: team?.name || null,
    } satisfies SubscriptionStatusResponse);
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
