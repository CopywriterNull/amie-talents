"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface InviteData {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  teams: {
    name: string;
  } | null;
}

export default function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadInvite() {
      setLoading(true);
      try {
        // Check auth status
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser({ email: authUser.email || "" });
        }

        // Fetch invite details
        const { data: inviteData, error: inviteError } = await supabase
          .from("team_invites")
          .select("id, email, role, status, expires_at, teams(name)")
          .eq("token", token)
          .single();

        if (inviteError || !inviteData) {
          setError("Invite not found or has been cancelled");
          return;
        }

        setInvite(inviteData as unknown as InviteData);

        // Check if expired
        if (new Date(inviteData.expires_at) < new Date()) {
          setError("This invite has expired");
          return;
        }

        // Check if already used
        if (inviteData.status !== "pending") {
          setError("This invite has already been used");
          return;
        }
      } catch (err) {
        console.error("Error loading invite:", err);
        setError("Failed to load invite");
      } finally {
        setLoading(false);
      }
    }

    loadInvite();
  }, [token, supabase]);

  async function handleAccept() {
    if (!user) {
      // Redirect to login with return URL
      router.push(`/login?redirect=/invite/${token}`);
      return;
    }

    setAccepting(true);
    setError(null);

    try {
      const res = await fetch("/api/team/invite/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to accept invite");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/team");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setAccepting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e5e5e5] border-t-[#0f0f0f] rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 max-w-md w-full text-center card-shadow">
          <div className="w-12 h-12 rounded-full bg-[#fef2f2] flex items-center justify-center mx-auto mb-4">
            <XIcon className="w-6 h-6 text-[#dc2626]" />
          </div>
          <h1 className="text-lg font-semibold mb-2">Invalid Invite</h1>
          <p className="text-[#737373] text-sm mb-6">{error}</p>
          <Link href="/">
            <Button variant="outline" className="h-10">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 max-w-md w-full text-center card-shadow">
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-6 h-6 text-[#15803d]" />
          </div>
          <h1 className="text-lg font-semibold mb-2">Welcome to the team!</h1>
          <p className="text-[#737373] text-sm">Redirecting you to the dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 max-w-md w-full card-shadow">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4">
            <MailIcon className="w-6 h-6 text-[#737373]" />
          </div>
          <h1 className="text-lg font-semibold mb-1">Team Invitation</h1>
          <p className="text-[#737373] text-sm">
            You&apos;ve been invited to join a team on MailTail
          </p>
        </div>

        {invite && (
          <div className="bg-[#fafafa] rounded-lg border border-[#e5e5e5] p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#737373]">Team</span>
                <span className="font-medium">{invite.teams?.name || "Team"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Role</span>
                <span className="font-medium capitalize">{invite.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Invited email</span>
                <span className="font-medium">{invite.email}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 mb-4 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg">
            {error}
          </div>
        )}

        {!user ? (
          <div className="space-y-3">
            <p className="text-sm text-[#737373] text-center">
              Please sign in to accept this invitation
            </p>
            <Button onClick={handleAccept} className="w-full h-10">
              Sign in to Accept
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-[#737373] text-center">
              Signed in as <span className="font-medium text-[#0f0f0f]">{user.email}</span>
            </p>
            <Button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full h-10"
            >
              {accepting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Accepting...
                </>
              ) : (
                "Accept Invitation"
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
