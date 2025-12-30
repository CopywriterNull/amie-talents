"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface TeamMember {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

interface TeamInvite {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  token: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const supabase = createClient();

  function copyInviteLink(invite: TeamInvite) {
    const link = `${window.location.origin}/invite/${invite.token}`;
    navigator.clipboard.writeText(link);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  useEffect(() => {
    fetchTeamData();
  }, []);

  async function fetchTeamData() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's team
      const { data: team } = await supabase
        .from("teams")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (team) {
        // Fetch all team members with their profiles
        const { data: memberData } = await supabase
          .from("team_members")
          .select("user_id, role")
          .eq("team_id", team.id);

        if (memberData && memberData.length > 0) {
          // Fetch profiles for all members
          const userIds = memberData.map(m => m.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .in("id", userIds);

          // Get emails from auth (we need to match with profiles)
          const membersWithDetails: TeamMember[] = await Promise.all(
            memberData.map(async (member) => {
              const profile = profiles?.find(p => p.id === member.user_id);
              // For the current user, we have the email
              const email = member.user_id === user.id
                ? user.email || ""
                : profile?.first_name
                  ? `${profile.first_name}@...`
                  : "Team member";

              return {
                id: member.user_id,
                email: member.user_id === user.id ? user.email || "" : email,
                first_name: profile?.first_name || null,
                last_name: profile?.last_name || null,
                role: member.role,
              };
            })
          );

          setMembers(membersWithDetails);
        }

        // Fetch pending invites for this team
        const { data: inviteData } = await supabase
          .from("team_invites")
          .select("id, email, role, status, created_at, token")
          .eq("team_id", team.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (inviteData) {
          setInvites(inviteData);
        }
      } else {
        // No team yet, just show current user
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
          .single();

        setMembers([{
          id: user.id,
          email: user.email || "",
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null,
          role: "owner",
        }]);
      }
    } catch (err) {
      console.error("Error fetching team data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setInviting(true);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invite");
      }

      setSuccess(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
      fetchTeamData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setInviting(false);
    }
  }

  async function handleCancelInvite(inviteId: string) {
    try {
      const res = await fetch(`/api/team/invite/${inviteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel invite");
      }

      fetchTeamData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  function getInitials(firstName: string | null, lastName: string | null, email: string) {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return email[0]?.toUpperCase() || "?";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#e5e5e5] border-t-[#0f0f0f] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Team</h1>
        <p className="text-[#737373] text-sm">
          Manage your team members and send invites.
        </p>
      </div>

      {/* Invite Form */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#e5e5e5]">
          <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
            <MailIcon className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Invite Team Member</h2>
            <p className="text-xs text-[#737373]">Send an invite to collaborate</p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-4 text-sm text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-10 text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <select
                id="role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full h-10 text-sm bg-white border border-[#e5e5e5] rounded-md px-3 focus:border-[#0f0f0f] focus:ring-[#0f0f0f] focus:outline-none"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <Button
            type="submit"
            disabled={inviting || !inviteEmail}
            className="h-9 px-4 text-sm"
          >
            {inviting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Sending...
              </>
            ) : (
              <>
                <PlusIcon className="w-4 h-4 mr-2" />
                Send Invite
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Pending Invites */}
      {invites.length > 0 && (
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e5e5e5]">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
              <ClockIcon className="w-4 h-4 text-[#737373]" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Pending Invites</h2>
              <p className="text-xs text-[#737373]">{invites.length} pending</p>
            </div>
          </div>

          <div className="space-y-2">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[#fafafa] border border-[#e5e5e5]"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#f5f5f5] text-[#737373] text-xs">
                      {invite.email[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{invite.email}</p>
                    <p className="text-xs text-[#737373] capitalize">{invite.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyInviteLink(invite)}
                    className="p-1.5 rounded hover:bg-[#f5f5f5] text-[#737373] hover:text-[#0f0f0f] transition-colors"
                    title="Copy invite link"
                  >
                    {copiedId === invite.id ? (
                      <CheckIcon className="w-4 h-4 text-[#15803d]" />
                    ) : (
                      <LinkIcon className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleCancelInvite(invite.id)}
                    className="p-1.5 rounded hover:bg-[#f5f5f5] text-[#737373] hover:text-[#dc2626] transition-colors"
                    title="Cancel invite"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Members */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e5e5e5]">
          <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Team Members</h2>
            <p className="text-xs text-[#737373]">{members.length} member{members.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#fafafa] border border-[#e5e5e5]"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#0f0f0f] text-white text-xs font-medium">
                    {getInitials(member.first_name, member.last_name, member.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {member.first_name && member.last_name
                      ? `${member.first_name} ${member.last_name}`
                      : member.email}
                  </p>
                  <p className="text-xs text-[#737373]">{member.email}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-[#737373] bg-[#f5f5f5] px-2 py-1 rounded capitalize">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
