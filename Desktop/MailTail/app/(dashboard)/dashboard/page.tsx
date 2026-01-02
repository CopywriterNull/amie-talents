import Link from "next/link";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { canTeamProcessTemplate } from "@/lib/admin";
import { getTeamApiKey } from "@/lib/api-keys";
import { HowItWorksCard } from "@/components/how-it-works-card";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function formatRelativeDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function RssIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Use service client for onboarding operations to bypass RLS
  const serviceClient = createServiceClient();

  // Ensure user has a profile (fallback if auth callback was skipped)
  const { data: existingProfile } = await serviceClient
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!existingProfile) {
    const metadata = user.user_metadata || {};
    await serviceClient.from("profiles").upsert({
      id: user.id,
      email: user.email,
      first_name: metadata.first_name || null,
      last_name: metadata.last_name || null,
      brand_name: metadata.brand_name || null,
    }, { onConflict: "id" });
  }

  // Get user's team membership
  let { data: membership } = await serviceClient
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .single();

  // If no team exists, create one (fallback if auth callback was skipped)
  if (!membership) {
    const metadata = user.user_metadata || {};
    const brandName = metadata.brand_name || user.email?.split("@")[0] || "My Brand";

    // Create team
    const { data: team } = await serviceClient
      .from("teams")
      .insert({
        name: brandName,
        owner_id: user.id,
      })
      .select()
      .single();

    if (team) {
      // Add user as team admin
      await serviceClient.from("team_members").insert({
        team_id: team.id,
        user_id: user.id,
        role: "admin",
      });

      // Refetch membership
      const { data: newMembership } = await serviceClient
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .single();

      membership = newMembership;
    }
  }

  const teamId = membership?.team_id;

  // Check subscription status if user has a team
  let canProcess = true;
  let subscriptionReason: string | null = null;
  if (teamId) {
    const result = await canTeamProcessTemplate(teamId);
    canProcess = result.allowed;
    subscriptionReason = result.reason || null;
  }

  // Get web feed status
  let feedStatus: { is_active: boolean; request_count: number } | null = null;
  if (teamId) {
    const apiKeyInfo = await getTeamApiKey(teamId);
    if (apiKeyInfo) {
      feedStatus = {
        is_active: apiKeyInfo.is_active,
        request_count: apiKeyInfo.request_count,
      };
    }
  }

  const { data: connection } = await supabase
    .from("klaviyo_connections")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: recentTemplates } = await supabase
    .from("processed_templates")
    .select("*")
    .eq("user_id", user.id)
    .order("processed_at", { ascending: false })
    .limit(5);

  const { count: templateCount } = await supabase
    .from("processed_templates")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const isConnected = !!connection;

  if (!isConnected) {
    return (
      <div className="max-w-sm mx-auto pt-16 animate-slide-up">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 text-center card-shadow">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#171717] to-[#404040] flex items-center justify-center mx-auto mb-5">
            <MailIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold mb-2">Connect Klaviyo</h1>
          <p className="text-sm text-[#737373] mb-6">
            Link your Klaviyo account to start processing templates.
          </p>
          <Link href="/dashboard/settings">
            <Button size="sm" className="w-full">
              Connect Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-[#737373]">Welcome back</p>
        </div>
        {canProcess ? (
          <Link href="/dashboard/process">
            <Button size="sm" className="gap-1.5">
              <ZapIcon className="w-3.5 h-3.5" />
              Process
            </Button>
          </Link>
        ) : (
          <Button size="sm" disabled className="gap-1.5 opacity-50 cursor-not-allowed">
            <LockIcon className="w-3.5 h-3.5" />
            Process
          </Button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-4 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#737373] font-medium">Processed</p>
              <p className="text-2xl font-bold mt-0.5">{templateCount ?? 0}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
              <ZapIcon className="w-4 h-4 text-[#737373]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e5e5] p-4 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#737373] font-medium">Klaviyo</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <p className="text-sm font-semibold text-[#22c55e]">Connected</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-[#22c55e]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e5e5] p-4 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#737373] font-medium">Web Feed</p>
              {feedStatus ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${feedStatus.is_active ? "bg-[#22c55e]" : "bg-[#a3a3a3]"}`} />
                  <p className={`text-sm font-semibold ${feedStatus.is_active ? "text-[#22c55e]" : "text-[#a3a3a3]"}`}>
                    {feedStatus.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
              ) : (
                <p className="text-sm font-semibold text-[#a3a3a3] mt-0.5">Not set up</p>
              )}
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feedStatus?.is_active ? "bg-[#f0fdf4]" : "bg-[#f5f5f5]"}`}>
              <RssIcon className={`w-4 h-4 ${feedStatus?.is_active ? "text-[#22c55e]" : "text-[#737373]"}`} />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <HowItWorksCard
        defaultExpanded={!recentTemplates || recentTemplates.length === 0}
        hasProcessedTemplates={!!recentTemplates && recentTemplates.length > 0}
      />

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] card-shadow overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e5e5]">
          <h2 className="text-sm font-semibold">Recent Activity</h2>
          {recentTemplates && recentTemplates.length > 0 && (
            <Link
              href="/dashboard/history"
              className="text-xs text-[#737373] hover:text-[#171717] flex items-center gap-1"
            >
              View all
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          )}
        </div>

        {!recentTemplates || recentTemplates.length === 0 ? (
          <div className="p-8 text-center">
            {/* Mini illustration */}
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f5] to-[#e5e5e5] rounded-xl rotate-3" />
              <div className="absolute inset-0 bg-white rounded-xl border border-[#e5e5e5] flex items-center justify-center">
                <ZapIcon className="w-6 h-6 text-[#d4d4d4]" />
              </div>
            </div>
            <p className="text-sm font-medium text-[#525252] mb-1">No activity yet</p>
            <p className="text-xs text-[#a3a3a3] mb-4">Process a template to get started</p>
            {canProcess ? (
              <Link href="/dashboard/process">
                <Button size="sm" className="gap-1.5">
                  <ZapIcon className="w-3.5 h-3.5" />
                  Process Template
                </Button>
              </Link>
            ) : (
              <Button size="sm" disabled className="opacity-50">
                Processing disabled
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#e5e5e5]">
            {recentTemplates.map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                    <ZapIcon className="w-3 h-3 text-[#22c55e]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {template.template_name?.replace(" - MailTail", "") || "Untitled"}
                    </p>
                    <p className="text-xs text-[#a3a3a3]">
                      {formatRelativeDate(template.processed_at)}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://www.klaviyo.com/email-editor/${template.new_template_id}/edit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-[#f5f5f5] text-[#a3a3a3] hover:text-[#737373] transition-colors"
                >
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {canProcess ? (
          <Link href="/dashboard/process" className="group">
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-4 card-shadow hover:border-[#171717] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#171717] to-[#404040] flex items-center justify-center">
                  <ZapIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Process Template</p>
                  <p className="text-xs text-[#a3a3a3]">Add MailTail footer</p>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="bg-white rounded-xl border border-[#e5e5e5] p-4 card-shadow opacity-60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
                <LockIcon className="w-4 h-4 text-[#a3a3a3]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#a3a3a3]">Process Template</p>
                <p className="text-xs text-[#d4d4d4]">{subscriptionReason || "Unavailable"}</p>
              </div>
            </div>
          </div>
        )}

        <Link href="/dashboard/history" className="group">
          <div className="bg-white rounded-xl border border-[#e5e5e5] p-4 card-shadow hover:border-[#171717] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#737373]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">View History</p>
                <p className="text-xs text-[#a3a3a3]">Past templates</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
