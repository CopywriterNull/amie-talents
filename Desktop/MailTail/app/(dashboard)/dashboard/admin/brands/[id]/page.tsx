import { createServiceClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BrandActions } from "./brand-actions";

interface BrandDetail {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
  owner: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
  subscription: {
    id: string;
    status: string;
    trial_type: string | null;
    trial_ends_at: string | null;
    trial_template_limit: number | null;
    trial_templates_used: number;
    custom_template_limit: number | null;
    admin_notes: string | null;
    plan_id: string | null;
    started_at: string;
    created_at: string;
  } | null;
  members: Array<{
    id: string;
    user_id: string;
    role: string;
    created_at: string;
    user: {
      email: string;
      first_name: string | null;
      last_name: string | null;
    } | null;
  }>;
  templates_processed: Array<{
    id: string;
    template_name: string | null;
    original_template_id: string;
    new_template_id: string;
    processed_at: string;
  }>;
  klaviyo_connection: {
    id: string;
    created_at: string;
  } | null;
  activity: Array<{
    id: string;
    action: string;
    details: Record<string, unknown>;
    created_at: string;
    user_id: string | null;
  }>;
}

const getCachedBrand = unstable_cache(
  async (id: string): Promise<BrandDetail | null> => {
    const supabase = createServiceClient();

  // Get team basic info
  const { data: team, error } = await supabase
    .from("teams")
    .select("id, name, created_at, owner_id")
    .eq("id", id)
    .single();

  if (error || !team) {
    return null;
  }

  // Get related data in parallel
  const [subscriptionResult, membersResult, templatesResult, activityResult] =
    await Promise.all([
      supabase.from("team_subscriptions").select("*").eq("team_id", id).single(),
      supabase
        .from("team_members")
        .select("id, user_id, role, created_at")
        .eq("team_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("processed_templates")
        .select("id, template_name, original_template_id, new_template_id, processed_at")
        .eq("team_id", id)
        .order("processed_at", { ascending: false })
        .limit(20),
      supabase
        .from("activity_log")
        .select("id, action, details, created_at, user_id")
        .eq("team_id", id)
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  // Get all user IDs we need to look up (owner + members)
  const members = membersResult.data || [];
  const memberUserIds = members.map((m) => m.user_id).filter(Boolean);
  const allUserIds = [...new Set([team.owner_id, ...memberUserIds].filter(Boolean))];

  // Fetch all user profiles in one query
  let usersById = new Map<string, { id: string; email: string; first_name: string | null; last_name: string | null }>();
  if (allUserIds.length > 0) {
    const { data: users } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name")
      .in("id", allUserIds);

    usersById = new Map(
      (users || []).map((u) => [u.id, u])
    );
  }

  // Check for Klaviyo connection by user_id (any team member)
  let klaviyoConnection = null;
  if (allUserIds.length > 0) {
    const { data: klaviyo } = await supabase
      .from("klaviyo_connections")
      .select("id, created_at, user_id")
      .in("user_id", allUserIds)
      .limit(1)
      .single();

    if (klaviyo) {
      klaviyoConnection = { id: klaviyo.id, created_at: klaviyo.created_at };
    }
  }

  // Map owner
  const owner = team.owner_id ? usersById.get(team.owner_id) || null : null;

  // Map members with their user profiles
  const normalizedMembers = members.map((m) => ({
    id: m.id,
    user_id: m.user_id,
    role: m.role,
    created_at: m.created_at,
    user: m.user_id ? usersById.get(m.user_id) || null : null,
  }));

  return {
    id: team.id,
    name: team.name,
    created_at: team.created_at,
    owner_id: team.owner_id,
    owner: owner as BrandDetail["owner"],
    subscription: subscriptionResult.data,
    members: normalizedMembers as BrandDetail["members"],
    templates_processed: templatesResult.data || [],
    klaviyo_connection: klaviyoConnection,
    activity: (activityResult.data || []) as BrandDetail["activity"],
  };
  },
  ["admin-brand-detail"],
  { revalidate: 30, tags: ["admin-brands"] }
);

async function getBrand(id: string): Promise<BrandDetail | null> {
  return getCachedBrand(id);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "trial":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Trial</Badge>;
    case "active":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
    case "expired":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Expired</Badge>;
    case "suspended":
      return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Suspended</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrand(id);

  if (!brand) {
    notFound();
  }

  const templatesThisMonth = brand.templates_processed.filter((t) => {
    const date = new Date(t.processed_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/brands"
            className="p-2 rounded-lg hover:bg-[#f5f5f5] transition-colors"
          >
            <svg
              className="w-5 h-5 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#171717]">{brand.name}</h1>
              {brand.subscription && getStatusBadge(brand.subscription.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Created {new Date(brand.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <BrandActions brand={brand} />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              {brand.subscription ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm font-medium capitalize">{brand.subscription.status}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Trial Type</p>
                      <p className="text-sm font-medium capitalize">
                        {brand.subscription.trial_type || "None"}
                      </p>
                    </div>
                    {brand.subscription.trial_type === "time" && brand.subscription.trial_ends_at && (
                      <div>
                        <p className="text-xs text-muted-foreground">Trial Ends</p>
                        <p className="text-sm font-medium">
                          {new Date(brand.subscription.trial_ends_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {brand.subscription.trial_type === "usage" && (
                      <div>
                        <p className="text-xs text-muted-foreground">Templates Used</p>
                        <p className="text-sm font-medium">
                          {brand.subscription.trial_templates_used} /{" "}
                          {brand.subscription.trial_template_limit || "∞"}
                        </p>
                      </div>
                    )}
                    {brand.subscription.custom_template_limit && (
                      <div>
                        <p className="text-xs text-muted-foreground">Monthly Limit</p>
                        <p className="text-sm font-medium">
                          {brand.subscription.custom_template_limit} templates
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">Started</p>
                      <p className="text-sm font-medium">
                        {new Date(brand.subscription.started_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {brand.subscription.admin_notes && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Admin Notes</p>
                      <p className="text-sm text-[#525252]">{brand.subscription.admin_notes}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No subscription set up</p>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Team Members ({brand.members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brand.members.length === 0 ? (
                <p className="text-sm text-muted-foreground">No team members</p>
              ) : (
                <div className="space-y-3">
                  {brand.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center text-xs font-medium">
                          {member.user?.first_name?.[0] ||
                            member.user?.email?.[0]?.toUpperCase() ||
                            "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {member.user?.first_name
                              ? `${member.user.first_name} ${member.user.last_name || ""}`
                              : member.user?.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.user?.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize text-xs">
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Recent Templates ({brand.templates_processed.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {brand.templates_processed.length === 0 ? (
                <p className="text-sm text-muted-foreground">No templates processed yet</p>
              ) : (
                <div className="space-y-2">
                  {brand.templates_processed.slice(0, 10).map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {template.template_name || template.original_template_id}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {template.original_template_id} → {template.new_template_id}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(template.processed_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Templates</span>
                  <span className="text-sm font-medium">{brand.templates_processed.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="text-sm font-medium">{templatesThisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Team Size</span>
                  <span className="text-sm font-medium">{brand.members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Klaviyo</span>
                  <span className="text-sm font-medium">
                    {brand.klaviyo_connection ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-400 text-xs">
                        Not Connected
                      </Badge>
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Owner</CardTitle>
            </CardHeader>
            <CardContent>
              {brand.owner ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-sm font-semibold">
                    {brand.owner.first_name?.[0] || brand.owner.email[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {brand.owner.first_name
                        ? `${brand.owner.first_name} ${brand.owner.last_name || ""}`
                        : brand.owner.email}
                    </p>
                    <p className="text-xs text-muted-foreground">{brand.owner.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No owner assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {brand.activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity recorded</p>
              ) : (
                <div className="space-y-3">
                  {brand.activity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="text-sm">
                      <p className="font-medium capitalize">
                        {activity.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
