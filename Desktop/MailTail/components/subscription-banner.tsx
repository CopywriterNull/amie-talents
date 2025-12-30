"use client";

import { useEffect, useState } from "react";
import type { SubscriptionStatusResponse } from "@/app/api/subscription/status/route";

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function BanIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </svg>
  );
}

export function SubscriptionBanner() {
  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/subscription/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  if (loading || !status) return null;

  // No team or no subscription - don't show banner
  if (!status.hasTeam || status.status === "none") return null;

  // Active paid subscription - don't show banner
  if (status.status === "active") return null;

  // Suspended account
  if (status.status === "suspended") {
    return (
      <div className="bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] text-white px-4 py-3 rounded-xl mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <BanIcon className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold">Account Suspended</p>
            <p className="text-sm text-white/80 mt-0.5">
              Your account has been suspended. Please contact support at{" "}
              <a href="mailto:hello@mailtail.io" className="underline hover:text-white">
                hello@mailtail.io
              </a>{" "}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Expired trial
  if (status.status === "expired") {
    return (
      <div className="bg-gradient-to-r from-[#78350f] to-[#92400e] text-white px-4 py-3 rounded-xl mb-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangleIcon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Trial Expired</p>
            <p className="text-sm text-white/80 mt-0.5">
              {status.trialType === "usage"
                ? `You've used all ${status.trialTemplateLimit} trial templates.`
                : "Your trial period has ended."}{" "}
              Contact us to continue using MailTail.
            </p>
            <a
              href="mailto:hello@mailtail.io?subject=MailTail%20Subscription"
              className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-white text-[#92400e] text-sm font-medium rounded-lg hover:bg-white/90 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Active trial - show usage/time remaining
  if (status.status === "trial") {
    const isLow =
      (status.trialType === "usage" && status.remainingTemplates !== null && status.remainingTemplates <= 3) ||
      (status.trialType === "time" && status.daysRemaining !== null && status.daysRemaining <= 3);

    if (status.trialType === "usage" && status.remainingTemplates !== null) {
      return (
        <div
          className={`px-4 py-3 rounded-xl mb-6 ${
            isLow
              ? "bg-gradient-to-r from-[#fef3c7] to-[#fde68a] text-[#92400e]"
              : "bg-gradient-to-r from-[#dbeafe] to-[#bfdbfe] text-[#1e40af]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isLow ? "bg-[#92400e]/10" : "bg-[#1e40af]/10"
              }`}
            >
              <ZapIcon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Trial</p>
                <p className="text-sm font-medium">
                  {status.remainingTemplates} / {status.trialTemplateLimit} templates remaining
                </p>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-2 rounded-full bg-black/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLow ? "bg-[#d97706]" : "bg-[#3b82f6]"
                  }`}
                  style={{
                    width: `${Math.max(
                      5,
                      ((status.trialTemplatesUsed) / (status.trialTemplateLimit || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (status.trialType === "time" && status.daysRemaining !== null) {
      return (
        <div
          className={`px-4 py-3 rounded-xl mb-6 ${
            isLow
              ? "bg-gradient-to-r from-[#fef3c7] to-[#fde68a] text-[#92400e]"
              : "bg-gradient-to-r from-[#dbeafe] to-[#bfdbfe] text-[#1e40af]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isLow ? "bg-[#92400e]/10" : "bg-[#1e40af]/10"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Trial</p>
              <p className="text-sm opacity-80">
                {status.daysRemaining === 0
                  ? "Expires today"
                  : status.daysRemaining === 1
                  ? "1 day remaining"
                  : `${status.daysRemaining} days remaining`}
              </p>
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
}

// Hook for checking if user can process templates
export function useSubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/subscription/status");
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // Silently fail, allow processing by default
        setStatus({
          hasTeam: false,
          hasSubscription: false,
          status: "none",
          canProcess: true,
          trialType: null,
          trialEndsAt: null,
          trialTemplatesUsed: 0,
          trialTemplateLimit: null,
          remainingTemplates: null,
          daysRemaining: null,
          teamName: null,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchStatus();
  }, []);

  return { status, loading, canProcess: status?.canProcess ?? true };
}
