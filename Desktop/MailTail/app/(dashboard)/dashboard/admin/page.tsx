import { createServiceClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const getCachedStats = unstable_cache(
  async () => {
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
    expiredResult,
    suspendedResult,
    todayTemplatesResult,
    weekTemplatesResult,
    monthTemplatesResult,
    recentSignupsResult,
    recentTeamsResult,
  ] = await Promise.all([
    supabase.from("teams").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("team_subscriptions").select("*", { count: "exact", head: true }).eq("status", "trial"),
    supabase.from("team_subscriptions").select("*", { count: "exact", head: true }).eq("status", "expired"),
    supabase.from("team_subscriptions").select("*", { count: "exact", head: true }).eq("status", "suspended"),
    supabase.from("processed_templates").select("*", { count: "exact", head: true }).gte("processed_at", startOfToday.toISOString()),
    supabase.from("processed_templates").select("*", { count: "exact", head: true }).gte("processed_at", startOfWeek.toISOString()),
    supabase.from("processed_templates").select("*", { count: "exact", head: true }).gte("processed_at", startOfMonth.toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", startOfWeek.toISOString()),
    supabase
      .from("teams")
      .select("id, name, created_at, owner_id")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Get owner profiles separately
  const recentTeams = recentTeamsResult.data || [];
  const ownerIds = recentTeams.map((t) => t.owner_id).filter(Boolean);

  let ownersById = new Map<string, { email: string; first_name: string | null; last_name: string | null }>();
  if (ownerIds.length > 0) {
    const { data: owners } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name")
      .in("id", ownerIds);

    ownersById = new Map(
      (owners || []).map((o) => [o.id, { email: o.email, first_name: o.first_name, last_name: o.last_name }])
    );
  }

  // Map teams with their owners
  const normalizedRecentTeams = recentTeams.map((team) => ({
    id: team.id,
    name: team.name,
    created_at: team.created_at,
    owner: team.owner_id ? ownersById.get(team.owner_id) || null : null,
  }));

  return {
    totalBrands: teamsResult.count || 0,
    totalUsers: usersResult.count || 0,
    activeTrials: activeTrialsResult.count || 0,
    expiredTrials: expiredResult.count || 0,
    suspended: suspendedResult.count || 0,
    templatesProcessedToday: todayTemplatesResult.count || 0,
    templatesProcessedWeek: weekTemplatesResult.count || 0,
    templatesProcessedMonth: monthTemplatesResult.count || 0,
    recentSignups: recentSignupsResult.count || 0,
    recentTeams: normalizedRecentTeams,
  };
  },
  ["admin-dashboard-stats"],
  { revalidate: 30, tags: ["admin-dashboard"] }
);

async function getStats() {
  return getCachedStats();
}

function StatCard({
  title,
  value,
  subtitle,
  trend,
  href,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  href?: string;
}) {
  const content = (
    <Card className={href ? "hover:border-[#171717]/20 transition-colors cursor-pointer" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#171717]">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of MailTail platform activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Brands"
          value={stats.totalBrands}
          subtitle="All registered teams"
          href="/dashboard/admin/brands"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle="Across all brands"
          href="/dashboard/admin/users"
        />
        <StatCard
          title="Active Trials"
          value={stats.activeTrials}
          subtitle={`${stats.expiredTrials} expired`}
          href="/dashboard/admin/brands?status=trial"
        />
        <StatCard
          title="New Signups"
          value={stats.recentSignups}
          subtitle="Last 7 days"
        />
      </div>

      {/* Templates Processed */}
      <div>
        <h2 className="text-lg font-semibold text-[#171717] mb-4">Templates Processed</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Today"
            value={stats.templatesProcessedToday}
          />
          <StatCard
            title="This Week"
            value={stats.templatesProcessedWeek}
          />
          <StatCard
            title="This Month"
            value={stats.templatesProcessedMonth}
          />
        </div>
      </div>

      {/* Recent Brands & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Brands */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Brands</CardTitle>
              <Link href="/dashboard/admin/brands" className="text-xs text-muted-foreground hover:text-[#171717]">
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentTeams.length === 0 ? (
              <p className="text-sm text-muted-foreground">No brands yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentTeams.map((team: { id: string; name: string; created_at: string; owner: { email: string; first_name: string | null; last_name: string | null } | null }) => (
                  <Link
                    key={team.id}
                    href={`/dashboard/admin/brands/${team.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-[#f5f5f5] transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{team.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {team.owner?.email || "No owner"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(team.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Link
                href="/dashboard/admin/brands"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-[#f5f5f5] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <path d="M9 22v-4h6v4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Manage Brands</p>
                  <p className="text-xs text-muted-foreground">View and manage all brands</p>
                </div>
              </Link>
              <Link
                href="/dashboard/admin/plans"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-[#f5f5f5] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Manage Plans</p>
                  <p className="text-xs text-muted-foreground">Create and edit subscription plans</p>
                </div>
              </Link>
              <Link
                href="/dashboard/admin/activity"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-[#f5f5f5] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">View Activity</p>
                  <p className="text-xs text-muted-foreground">Monitor platform activity</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(stats.suspended > 0 || stats.expiredTrials > 0) && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-base text-amber-800">Attention Required</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.suspended > 0 && (
                <p className="text-sm text-amber-700">
                  • {stats.suspended} suspended account{stats.suspended !== 1 ? "s" : ""}
                </p>
              )}
              {stats.expiredTrials > 0 && (
                <p className="text-sm text-amber-700">
                  • {stats.expiredTrials} expired trial{stats.expiredTrials !== 1 ? "s" : ""} - potential conversions
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
