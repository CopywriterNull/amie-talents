import { createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
  admin?: {
    user_id: string;
    role: string;
    user?: {
      email: string;
    } | null;
  } | null;
}

async function getAuditLogs(limit = 100): Promise<AuditLog[]> {
  const supabase = createServiceClient();

  // Get audit logs without FK relationships
  const { data: logs, error } = await supabase
    .from("admin_audit_log")
    .select("id, admin_id, action, target_type, target_id, details, ip_address, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching audit logs:", error);
    return [];
  }

  if (!logs || logs.length === 0) {
    return [];
  }

  // Get unique admin IDs
  const adminIds = [...new Set(logs.map((l) => l.admin_id).filter(Boolean))] as string[];

  // Fetch admins separately
  let adminsById = new Map<string, { user_id: string; role: string }>();
  if (adminIds.length > 0) {
    const { data: admins } = await supabase
      .from("admins")
      .select("id, user_id, role")
      .in("id", adminIds);

    adminsById = new Map(
      (admins || []).map((a) => [a.id, { user_id: a.user_id, role: a.role }])
    );
  }

  // Get unique user IDs from admins to fetch their emails
  const adminUserIds = [...new Set(
    Array.from(adminsById.values())
      .map((a) => a.user_id)
      .filter(Boolean)
  )] as string[];

  let emailsByUserId = new Map<string, string>();
  if (adminUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", adminUserIds);

    emailsByUserId = new Map(
      (profiles || []).map((p) => [p.id, p.email])
    );
  }

  // Map logs with their admin info
  return logs.map((log) => {
    const admin = log.admin_id ? adminsById.get(log.admin_id) : null;
    return {
      id: log.id,
      admin_id: log.admin_id,
      action: log.action,
      target_type: log.target_type,
      target_id: log.target_id,
      details: log.details as Record<string, unknown>,
      ip_address: log.ip_address,
      created_at: log.created_at,
      admin: admin
        ? {
            user_id: admin.user_id,
            role: admin.role,
            user: {
              email: emailsByUserId.get(admin.user_id) || "Unknown",
            },
          }
        : null,
    };
  });
}

function getActionBadgeColor(action: string) {
  if (action.includes("start") || action.includes("create") || action.includes("unsuspend")) {
    return "bg-green-100 text-green-700";
  }
  if (action.includes("extend") || action.includes("update")) {
    return "bg-blue-100 text-blue-700";
  }
  if (action.includes("end") || action.includes("suspend") || action.includes("disconnect")) {
    return "bg-red-100 text-red-700";
  }
  return "bg-gray-100 text-gray-700";
}

export default async function AuditPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#171717]">Admin Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track all administrative actions taken in the system
        </p>
      </div>

      {/* Audit List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Recent Admin Actions ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No admin actions recorded yet
            </p>
          ) : (
            <div className="divide-y">
              {logs.map((log) => (
                <div key={log.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-4 h-4 text-amber-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge
                            className={`${getActionBadgeColor(log.action)} hover:${getActionBadgeColor(log.action)} text-xs`}
                          >
                            {log.action.replace(/_/g, " ")}
                          </Badge>
                          {log.target_type && log.target_id && (
                            <span className="text-xs text-muted-foreground">
                              on{" "}
                              {log.target_type === "team" ? (
                                <Link
                                  href={`/dashboard/admin/brands/${log.target_id}`}
                                  className="text-[#171717] hover:underline"
                                >
                                  {log.target_type}
                                </Link>
                              ) : (
                                log.target_type
                              )}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#525252] mt-1">
                          by {log.admin?.user?.email || "Unknown admin"}
                          <span className="text-xs text-muted-foreground ml-2 capitalize">
                            ({log.admin?.role?.replace("_", " ") || "unknown role"})
                          </span>
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
