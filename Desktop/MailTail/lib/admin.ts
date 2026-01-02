import { createServiceClient } from "@/lib/supabase/server";

// Types
export interface Plan {
  id: string;
  name: string;
  type: "trial_time" | "trial_usage" | "paid";
  template_limit: number | null;
  trial_days: number | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamSubscription {
  id: string;
  team_id: string;
  plan_id: string | null;
  status: "trial" | "active" | "expired" | "suspended";
  trial_type: "time" | "usage" | null;
  trial_ends_at: string | null;
  trial_template_limit: number | null;
  trial_templates_used: number;
  custom_template_limit: number | null;
  custom_ends_at: string | null;
  admin_notes: string | null;
  started_at: string;
  created_at: string;
  updated_at: string;
  plan?: Plan;
}

export interface Admin {
  id: string;
  user_id: string;
  role: "super_admin" | "admin" | "support";
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  team_id: string | null;
  user_id: string | null;
  action: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  subscription?: TeamSubscription;
  members_count?: number;
  templates_processed?: number;
}

export interface TeamWithDetails extends Team {
  owner_email?: string;
  owner_name?: string;
  klaviyo_connected?: boolean;
}

// Check if current user is an admin
export async function isAdmin(): Promise<{ isAdmin: boolean; admin: Admin | null }> {
  const supabase = createServiceClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, admin: null };
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return { isAdmin: !!admin, admin };
}

// Check if admin has permission for an action
export function canAdminPerform(admin: Admin, action: "read" | "write" | "manage_admins"): boolean {
  if (action === "read") {
    return true; // All admins can read
  }
  if (action === "write") {
    return admin.role === "super_admin" || admin.role === "admin";
  }
  if (action === "manage_admins") {
    return admin.role === "super_admin";
  }
  return false;
}

// Get subscription status for a team
export function getSubscriptionStatus(subscription: TeamSubscription): "active" | "expired" {
  // 1. Check usage limit first (if set) - takes priority
  if (subscription.trial_type === "usage" && subscription.trial_template_limit !== null) {
    if (subscription.trial_templates_used >= subscription.trial_template_limit) {
      return "expired";
    }
    return "active";
  }

  // 2. Check time limit (if set)
  if (subscription.trial_type === "time" && subscription.trial_ends_at) {
    if (new Date() > new Date(subscription.trial_ends_at)) {
      return "expired";
    }
    return "active";
  }

  // 3. Check paid/active status
  if (subscription.status === "active") {
    return "active";
  }

  return "expired";
}

// Check if a team can process templates
export async function canTeamProcessTemplate(teamId: string): Promise<{ allowed: boolean; reason?: string; remaining?: number | null }> {
  const supabase = createServiceClient();

  const { data: subscription, error } = await supabase
    .from("team_subscriptions")
    .select("*")
    .eq("team_id", teamId)
    .single();

  if (error || !subscription) {
    return { allowed: false, reason: "No subscription found" };
  }

  if (subscription.status === "suspended") {
    return { allowed: false, reason: "Account suspended" };
  }

  // Check usage-based trial first (takes priority)
  if (subscription.trial_type === "usage" && subscription.trial_template_limit !== null) {
    if (subscription.trial_templates_used >= subscription.trial_template_limit) {
      return { allowed: false, reason: "Trial template limit reached" };
    }
    return { allowed: true, remaining: subscription.trial_template_limit - subscription.trial_templates_used };
  }

  // Check time-based trial
  if (subscription.trial_type === "time" && subscription.trial_ends_at) {
    if (new Date() > new Date(subscription.trial_ends_at)) {
      return { allowed: false, reason: "Trial expired" };
    }
    return { allowed: true };
  }

  // Check active paid plan with custom limit
  if (subscription.status === "active") {
    if (subscription.custom_template_limit !== null) {
      // Get monthly usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count } = await supabase
        .from("processed_templates")
        .select("*", { count: "exact", head: true })
        .eq("team_id", teamId)
        .gte("processed_at", startOfMonth.toISOString());

      const monthlyUsage = count || 0;
      if (monthlyUsage >= subscription.custom_template_limit) {
        return { allowed: false, reason: "Monthly limit reached" };
      }
      return { allowed: true, remaining: subscription.custom_template_limit - monthlyUsage };
    }
    // Unlimited
    return { allowed: true, remaining: null };
  }

  return { allowed: false, reason: "Subscription expired" };
}

// Log an admin action
export async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  const supabase = createServiceClient();

  await supabase.from("admin_audit_log").insert({
    admin_id: adminId,
    action,
    target_type: targetType,
    target_id: targetId,
    details: details || {},
    ip_address: ipAddress,
  });
}

// Log user activity
export async function logActivity(
  action: string,
  teamId?: string,
  userId?: string,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  const supabase = createServiceClient();

  await supabase.from("activity_log").insert({
    team_id: teamId,
    user_id: userId,
    action,
    details: details || {},
    ip_address: ipAddress,
  });
}

// Increment trial usage for a team
export async function incrementTrialUsage(teamId: string): Promise<void> {
  const supabase = createServiceClient();

  await supabase.rpc("increment_trial_usage", { p_team_id: teamId });
}

// Admin actions

// Start a trial for a team
export async function startTrial(
  teamId: string,
  type: "time" | "usage",
  value: number, // days for time, templates for usage
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  const updateData: Partial<TeamSubscription> = {
    status: "trial",
    trial_type: type,
    trial_templates_used: 0,
    started_at: new Date().toISOString(),
  };

  if (type === "time") {
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + value);
    updateData.trial_ends_at = endsAt.toISOString();
    updateData.trial_template_limit = null;
  } else {
    updateData.trial_template_limit = value;
    updateData.trial_ends_at = null;
  }

  // Check if subscription exists
  const { data: existing } = await supabase
    .from("team_subscriptions")
    .select("id")
    .eq("team_id", teamId)
    .single();

  let error;
  if (existing) {
    const result = await supabase
      .from("team_subscriptions")
      .update(updateData)
      .eq("team_id", teamId);
    error = result.error;
  } else {
    const result = await supabase
      .from("team_subscriptions")
      .insert({ ...updateData, team_id: teamId });
    error = result.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(adminId, "start_trial", "team", teamId, { type, value });

  return { success: true };
}

// Extend a trial
export async function extendTrial(
  teamId: string,
  additionalValue: number, // days or templates depending on trial type
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  const { data: subscription, error: fetchError } = await supabase
    .from("team_subscriptions")
    .select("*")
    .eq("team_id", teamId)
    .single();

  if (fetchError || !subscription) {
    return { success: false, error: "Subscription not found" };
  }

  const updateData: Partial<TeamSubscription> = {};

  if (subscription.trial_type === "time") {
    const currentEnd = subscription.trial_ends_at
      ? new Date(subscription.trial_ends_at)
      : new Date();
    currentEnd.setDate(currentEnd.getDate() + additionalValue);
    updateData.trial_ends_at = currentEnd.toISOString();
  } else if (subscription.trial_type === "usage") {
    updateData.trial_template_limit = (subscription.trial_template_limit || 0) + additionalValue;
  } else {
    return { success: false, error: "No active trial to extend" };
  }

  // Reset to active status if was expired
  updateData.status = "trial";

  const { error } = await supabase
    .from("team_subscriptions")
    .update(updateData)
    .eq("team_id", teamId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(adminId, "extend_trial", "team", teamId, {
    trial_type: subscription.trial_type,
    additional_value: additionalValue,
  });

  return { success: true };
}

// End a trial (set to expired)
export async function endTrial(
  teamId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("team_subscriptions")
    .update({
      status: "expired",
      trial_ends_at: new Date().toISOString(),
    })
    .eq("team_id", teamId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(adminId, "end_trial", "team", teamId);

  return { success: true };
}

// Upgrade to active plan
export async function upgradeToPaid(
  teamId: string,
  planId: string | null,
  customLimit?: number,
  adminId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  const subscriptionData = {
    status: "active" as const,
    plan_id: planId,
    trial_type: null,
    trial_ends_at: null,
    custom_template_limit: customLimit ?? null,
  };

  // Check if subscription exists
  const { data: existing } = await supabase
    .from("team_subscriptions")
    .select("id")
    .eq("team_id", teamId)
    .single();

  let error;
  if (existing) {
    // Update existing subscription
    const result = await supabase
      .from("team_subscriptions")
      .update(subscriptionData)
      .eq("team_id", teamId);
    error = result.error;
  } else {
    // Create new subscription
    const result = await supabase
      .from("team_subscriptions")
      .insert({
        ...subscriptionData,
        team_id: teamId,
        started_at: new Date().toISOString(),
      });
    error = result.error;
  }

  if (error) {
    return { success: false, error: error.message };
  }

  if (adminId) {
    await logAdminAction(adminId, "upgrade_to_paid", "team", teamId, { plan_id: planId, custom_limit: customLimit });
  }

  return { success: true };
}

// Suspend a team
export async function suspendTeam(
  teamId: string,
  adminId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("team_subscriptions")
    .update({
      status: "suspended",
      admin_notes: reason,
    })
    .eq("team_id", teamId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(adminId, "suspend_team", "team", teamId, { reason });

  return { success: true };
}

// Unsuspend a team
export async function unsuspendTeam(
  teamId: string,
  adminId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  // Get current subscription to determine what status to restore
  const { data: subscription } = await supabase
    .from("team_subscriptions")
    .select("*")
    .eq("team_id", teamId)
    .single();

  let newStatus: "trial" | "active" | "expired" = "expired";

  if (subscription) {
    if (subscription.trial_type === "usage" && subscription.trial_template_limit) {
      newStatus = subscription.trial_templates_used < subscription.trial_template_limit ? "trial" : "expired";
    } else if (subscription.trial_type === "time" && subscription.trial_ends_at) {
      newStatus = new Date() < new Date(subscription.trial_ends_at) ? "trial" : "expired";
    } else if (subscription.plan_id) {
      newStatus = "active";
    }
  }

  const { error } = await supabase
    .from("team_subscriptions")
    .update({ status: newStatus })
    .eq("team_id", teamId);

  if (error) {
    return { success: false, error: error.message };
  }

  await logAdminAction(adminId, "unsuspend_team", "team", teamId, { restored_status: newStatus });

  return { success: true };
}

// Get dashboard stats
export async function getAdminDashboardStats(): Promise<{
  totalBrands: number;
  totalUsers: number;
  activeTrials: number;
  expiredTrials: number;
  templatesProcessedToday: number;
  templatesProcessedWeek: number;
  templatesProcessedMonth: number;
  recentSignups: number;
}> {
  const supabase = createServiceClient();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Get counts in parallel
  const [
    teamsResult,
    usersResult,
    activeTrialsResult,
    expiredTrialsResult,
    todayTemplatesResult,
    weekTemplatesResult,
    monthTemplatesResult,
    recentSignupsResult,
  ] = await Promise.all([
    supabase.from("teams").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("team_subscriptions").select("*", { count: "exact", head: true }).eq("status", "trial"),
    supabase.from("team_subscriptions").select("*", { count: "exact", head: true }).eq("status", "expired"),
    supabase.from("processed_templates").select("*", { count: "exact", head: true }).gte("processed_at", startOfToday.toISOString()),
    supabase.from("processed_templates").select("*", { count: "exact", head: true }).gte("processed_at", startOfWeek.toISOString()),
    supabase.from("processed_templates").select("*", { count: "exact", head: true }).gte("processed_at", startOfMonth.toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", startOfWeek.toISOString()),
  ]);

  return {
    totalBrands: teamsResult.count || 0,
    totalUsers: usersResult.count || 0,
    activeTrials: activeTrialsResult.count || 0,
    expiredTrials: expiredTrialsResult.count || 0,
    templatesProcessedToday: todayTemplatesResult.count || 0,
    templatesProcessedWeek: weekTemplatesResult.count || 0,
    templatesProcessedMonth: monthTemplatesResult.count || 0,
    recentSignups: recentSignupsResult.count || 0,
  };
}
