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

  useEffect(() => {
    checkConnectionStatus();
    fetchProfile();
  }, []);

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

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          brand_name: brandName,
        });

      if (error) throw error;

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
    </div>
  );
}
