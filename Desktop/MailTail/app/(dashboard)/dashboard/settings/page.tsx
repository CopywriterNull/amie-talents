"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Web Feed state
  const [feedKey, setFeedKey] = useState<{
    api_key: string;
    masked_key: string;
    is_active: boolean;
    request_count: number;
    last_used_at: string | null;
    feed_url: string;
  } | null>(null);
  const [feedLoading, setFeedLoading] = useState(true);
  const [feedSaving, setFeedSaving] = useState(false);
  const [feedSuccess, setFeedSuccess] = useState<string | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [showFullKey, setShowFullKey] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
    fetchProfile();
    fetchFeedKey();
  }, []);

  async function fetchFeedKey() {
    try {
      const res = await fetch("/api/feed/key");
      if (res.ok) {
        const data = await res.json();
        setFeedKey(data);
      }
    } catch {
      // Key might not exist yet
    } finally {
      setFeedLoading(false);
    }
  }

  async function handleRegenerateFeedKey() {
    if (!confirm("Are you sure you want to regenerate your API key? You will need to update the web feed URL in Klaviyo.")) {
      return;
    }

    setFeedSaving(true);
    setFeedError(null);
    setFeedSuccess(null);

    try {
      const res = await fetch("/api/feed/key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "regenerate" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to regenerate key");
      }

      setFeedKey((prev) => prev ? {
        ...prev,
        api_key: data.api_key,
        masked_key: data.masked_key,
        feed_url: data.feed_url,
      } : null);
      setFeedSuccess(data.message);
      setShowFullKey(true);
    } catch (err) {
      setFeedError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFeedSaving(false);
    }
  }

  async function handleToggleFeedKey() {
    if (!feedKey) return;

    setFeedSaving(true);
    setFeedError(null);
    setFeedSuccess(null);

    try {
      const res = await fetch("/api/feed/key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", is_active: !feedKey.is_active }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle key");
      }

      setFeedKey((prev) => prev ? { ...prev, is_active: data.is_active } : null);
      setFeedSuccess(data.message);
    } catch (err) {
      setFeedError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setFeedSaving(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setFeedSuccess("Copied to clipboard!");
    setTimeout(() => setFeedSuccess(null), 2000);
  }

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, brand_name")
        .eq("id", user.id)
        .single();

      if (profile) {
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
      }

      // Get team name (more accurate than profile.brand_name)
      const { data: membership } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .single();

      if (membership) {
        const { data: team } = await supabase
          .from("teams")
          .select("name")
          .eq("id", membership.team_id)
          .single();

        if (team) {
          setBrandName(team.name || "");
        }
      } else if (profile) {
        setBrandName(profile.brand_name || "");
      }
    }
  }

  async function checkConnectionStatus() {
    try {
      const res = await fetch("/api/klaviyo/status");
      const data = await res.json();
      setIsConnected(data.connected);
    } catch {
      // Ignore errors on status check
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch("/api/klaviyo/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to connect");
      }

      setSuccess("Klaviyo connected successfully!");
      setIsConnected(true);
      setApiKey("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch("/api/klaviyo/disconnect", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to disconnect");
      }

      setSuccess("Klaviyo disconnected.");
      setIsConnected(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          brand_name: brandName,
        });

      if (profileError) throw profileError;

      // Also update the team name if user has a team
      if (brandName) {
        let teamId: string | null = null;
        let canUpdate = false;

        // First check if user is a team owner directly
        const { data: ownedTeam } = await supabase
          .from("teams")
          .select("id")
          .eq("owner_id", user.id)
          .single();

        if (ownedTeam) {
          teamId = ownedTeam.id;
          canUpdate = true;
        } else {
          // Check team_members for admin role
          const { data: membership } = await supabase
            .from("team_members")
            .select("team_id, role")
            .eq("user_id", user.id)
            .single();

          if (membership && membership.role === "admin") {
            teamId = membership.team_id;
            canUpdate = true;
          }
        }

        if (teamId && canUpdate) {
          const { error: teamError } = await supabase
            .from("teams")
            .update({ name: brandName })
            .eq("id", teamId);

          if (teamError) {
            console.error("Team update error:", teamError);
            // Don't throw, just log - profile was already updated
          }
        }
      }

      setProfileSuccess("Profile updated successfully!");
      router.refresh();
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setPasswordSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto pt-16">
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 flex items-center justify-center card-shadow">
          <div className="w-5 h-5 border-2 border-[#e5e5e5] border-t-[#0f0f0f] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
        <p className="text-[#737373] text-sm">
          Manage your account and integrations.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#e5e5e5]">
          <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Profile</h2>
            <p className="text-xs text-[#737373]">Update your personal information</p>
          </div>
        </div>

        {profileError && (
          <div className="p-3 mb-5 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg">
            {profileError}
          </div>
        )}

        {profileSuccess && (
          <div className="p-3 mb-5 text-sm text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg flex items-center gap-2">
            <CheckIcon className="w-4 h-4" />
            {profileSuccess}
          </div>
        )}

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-10 text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="brandName" className="text-sm font-medium">Brand / Company name</Label>
            <Input
              id="brandName"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="h-10 text-sm"
            />
          </div>
          <Button type="submit" disabled={profileSaving} className="h-10 text-sm">
            {profileSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Password Card */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#e5e5e5]">
          <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
            <LockIcon className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Password</h2>
            <p className="text-xs text-[#737373]">Change your password</p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 mb-5 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 mb-5 text-sm text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg flex items-center gap-2">
            <CheckIcon className="w-4 h-4" />
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">New password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 text-sm"
              required
            />
          </div>
          <Button type="submit" disabled={passwordSaving} className="h-10 text-sm">
            {passwordSaving ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>

      {/* Klaviyo Connection Card */}
      <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#e5e5e5]">
          <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
            <SettingsIcon className="w-4 h-4 text-[#737373]" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">Klaviyo Connection</h2>
            <p className="text-xs text-[#737373]">
              {isConnected ? "Your account is connected" : "Connect to process templates"}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-5 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mb-5 text-sm text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg flex items-center gap-2">
            <CheckIcon className="w-4 h-4" />
            {success}
          </div>
        )}

        {isConnected ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 bg-[#f0fdf4] rounded-lg border border-[#bbf7d0]">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full" />
              <span className="font-medium text-sm text-[#15803d]">Connected to Klaviyo</span>
            </div>
            <p className="text-sm text-[#737373] leading-relaxed">
              Your Klaviyo API key is securely stored and encrypted. You can disconnect at any time to remove your credentials.
            </p>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={saving}
              className="w-full h-10 text-sm border-[#fecaca] text-[#dc2626] hover:bg-[#fef2f2] hover:text-[#dc2626]"
            >
              {saving ? "Disconnecting..." : "Disconnect Klaviyo"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="flex items-center gap-2 text-sm font-medium">
                <KeyIcon className="w-4 h-4 text-[#737373]" />
                Klaviyo Private API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="pk_..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="h-10 font-mono text-sm"
                required
              />
              <p className="text-xs text-[#a3a3a3]">
                Find your API key in Klaviyo under Account &rarr; Settings &rarr; API Keys
              </p>
            </div>
            <Button
              type="submit"
              disabled={saving || !apiKey}
              className="w-full h-10 text-sm"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                "Connect Klaviyo"
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Web Feed API Key Card */}
      {isConnected && (
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#e5e5e5]">
            <div className="w-9 h-9 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
              <RssIcon className="w-4 h-4 text-[#737373]" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">Web Feed</h2>
              <p className="text-xs text-[#737373]">
                Dynamic content feed for email templates
              </p>
            </div>
          </div>

          {/* Setup Instructions */}
          <div className="mb-5 p-4 bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] rounded-lg border border-[#e5e5e5]">
            <p className="text-xs font-medium text-[#525252] mb-3">Setup Instructions</p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#525252]">1. Connect Klaviyo</p>
                  <p className="text-[11px] text-[#737373]">Already done! Your account is connected.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feedKey ? "bg-[#22c55e]" : "bg-[#e5e5e5]"}`}>
                  {feedKey ? (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span className="text-[10px] font-bold text-[#737373]">2</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-[#525252]">2. Process your first template</p>
                  <p className="text-[11px] text-[#737373]">
                    {feedKey
                      ? "Done! Your web feed was created automatically."
                      : "Go to Process and select a template. We'll set up your feed automatically."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#e5e5e5] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#737373]">3</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#525252]">3. Use processed templates in campaigns</p>
                  <p className="text-[11px] text-[#737373]">Send emails using your &quot;- MailTail&quot; templates. The magic happens automatically!</p>
                </div>
              </div>
            </div>
          </div>

          {feedError && (
            <div className="p-3 mb-5 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg">
              {feedError}
            </div>
          )}

          {feedSuccess && (
            <div className="p-3 mb-5 text-sm text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              {feedSuccess}
            </div>
          )}

          {feedLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#e5e5e5] border-t-[#0f0f0f] rounded-full animate-spin" />
            </div>
          ) : feedKey ? (
            <div className="space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${feedKey.is_active ? "bg-[#22c55e]" : "bg-[#a3a3a3]"}`} />
                  <span className={`font-medium text-sm ${feedKey.is_active ? "text-[#15803d]" : "text-[#737373]"}`}>
                    {feedKey.is_active ? "Feed Active" : "Feed Inactive"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFeedKey}
                  disabled={feedSaving}
                  className="h-8 text-xs"
                >
                  {feedKey.is_active ? "Deactivate" : "Activate"}
                </Button>
              </div>

              {/* API Key */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">API Key</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 bg-[#f5f5f5] rounded-lg font-mono text-sm text-[#525252] overflow-hidden">
                    {showFullKey ? feedKey.api_key : feedKey.masked_key}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFullKey(!showFullKey)}
                    className="h-10 px-3"
                  >
                    {showFullKey ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(feedKey.api_key)}
                    className="h-10 px-3"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Feed URL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Feed URL</Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-2.5 bg-[#f5f5f5] rounded-lg font-mono text-xs text-[#525252] overflow-hidden truncate">
                    {feedKey.feed_url}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(feedKey.feed_url)}
                    className="h-10 px-3"
                  >
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-[#a3a3a3]">
                  This URL is automatically configured in your Klaviyo account when you process a template.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e5e5e5]">
                <div>
                  <p className="text-xs text-[#737373]">Total Requests</p>
                  <p className="text-lg font-semibold">{feedKey.request_count.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-[#737373]">Last Used</p>
                  <p className="text-sm font-medium">
                    {feedKey.last_used_at
                      ? new Date(feedKey.last_used_at).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {/* Regenerate */}
              <div className="pt-4 border-t border-[#e5e5e5]">
                <Button
                  variant="outline"
                  onClick={handleRegenerateFeedKey}
                  disabled={feedSaving}
                  className="h-10 text-sm gap-2"
                >
                  <RefreshIcon className="w-4 h-4" />
                  {feedSaving ? "Regenerating..." : "Regenerate API Key"}
                </Button>
                <p className="text-xs text-[#a3a3a3] mt-2">
                  Regenerating will invalidate the old key. You&apos;ll need to update the web feed in Klaviyo.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-[#737373]">
                Your web feed will be created automatically when you process your first template.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
