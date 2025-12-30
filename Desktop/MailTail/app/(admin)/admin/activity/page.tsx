import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ActivityLog {
  id: string;
  team_id: string | null;
  user_id: string | null;
  action: string;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
  team?: {
    id: string;
    name: string;
  } | null;
  user?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

async function getActivityLogs(limit = 100): Promise<ActivityLog[]> {
  const supabase = await createClient();

  // Get activity logs without FK relationships
  const { data: logs, error } = await supabase
    .from("activity_log")
    .select("id, team_id, user_id, action, details, ip_address, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching activity logs:", error);
    return [];
  }

  if (!logs || logs.length === 0) {
    return [];
  }

  // Get unique team IDs and user IDs
  const teamIds = [...new Set(logs.map((l) => l.team_id).filter(Boolean))] as string[];
  const userIds = [...new Set(logs.map((l) => l.user_id).filter(Boolean))] as string[];

  // Fetch teams and users separately
  const [teamsResult, usersResult] = await Promise.all([
    teamIds.length > 0
      ? supabase.from("teams").select("id, name").in("id", teamIds)
      : Promise.resolve({ data: [] }),
    userIds.length > 0
      ? supabase.from("profiles").select("id, email, first_name, last_name").in("id", userIds)
      : Promise.resolve({ data: [] }),
  ]);

  const teamsById = new Map(
    (teamsResult.data || []).map((t) => [t.id, { id: t.id, name: t.name }])
  );

  const usersById = new Map(
    (usersResult.data || []).map((u) => [u.id, { email: u.email, first_name: u.first_name, last_name: u.last_name }])
  );

  // Map logs with their related data
  return logs.map((log) => ({
    id: log.id,
    team_id: log.team_id,
    user_id: log.user_id,
    action: log.action,
    details: log.details as Record<string, unknown>,
    ip_address: log.ip_address,
    created_at: log.created_at,
    team: log.team_id ? teamsById.get(log.team_id) || null : null,
    user: log.user_id ? usersById.get(log.user_id) || null : null,
  }));
}

function getActionBadgeColor(action: string) {
  if (action.includes("processed") || action.includes("created")) {
    return "bg-green-100 text-green-700";
  }
  if (action.includes("connected") || action.includes("login")) {
    return "bg-blue-100 text-blue-700";
  }
  if (action.includes("disconnected") || action.includes("deleted")) {
    return "bg-red-100 text-red-700";
  }
  return "bg-gray-100 text-gray-700";
}

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#171717]">Activity Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform activity across all brands and users
        </p>
      </div>

      {/* Activity List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Recent Activity ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No activity recorded yet
            </p>
          ) : (
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#f5f5f5] flex items-center justify-center mt-0.5">
                        <svg
                          className="w-4 h-4 text-[#737373]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={`${getActionBadgeColor(log.action)} hover:${getActionBadgeColor(log.action)} text-xs`}
                          >
                            {log.action.replace(/_/g, " ")}
                          </Badge>
                          {log.team && (
                            <Link
                              href={`/admin/brands/${log.team.id}`}
                              className="text-sm text-muted-foreground hover:text-[#171717] hover:underline"
                            >
                              {log.team.name}
                            </Link>
                          )}
                        </div>
                        <p className="text-sm text-[#525252] mt-1">
                          {log.user?.email || "Unknown user"}
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1 font-mono">
                            {JSON.stringify(log.details)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </p>
                      {log.ip_address && (
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {log.ip_address}
                        </p>
                      )}
                    </div>
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
