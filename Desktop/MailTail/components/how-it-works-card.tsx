"use client";

import { useState, useEffect } from "react";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
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

const STORAGE_KEY = "mailtail_how_it_works_dismissed";

interface HowItWorksCardProps {
  defaultExpanded?: boolean;
  hasProcessedTemplates?: boolean;
}

export function HowItWorksCard({ defaultExpanded = true, hasProcessedTemplates = false }: HowItWorksCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // If user has processed templates, check if they dismissed the card before
    if (hasProcessedTemplates) {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed === "true") {
        setIsExpanded(false);
      }
    }
  }, [hasProcessedTemplates]);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    // Remember if they collapsed it (only matters for returning users)
    if (!newExpanded && hasProcessedTemplates) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  // Avoid hydration mismatch
  if (!hasMounted) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-[#e5e5e5] card-shadow overflow-hidden">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#fafafa] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <SparklesIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold">How MailTail Works</span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-[#737373] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-[#e5e5e5]">
          {/* Steps */}
          <div className="space-y-3 py-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#f5f5f5] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#737373]">
                1
              </div>
              <div>
                <p className="text-sm font-medium">Pick a Klaviyo template</p>
                <p className="text-xs text-[#737373]">Select any email template from your account</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#f5f5f5] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#737373]">
                2
              </div>
              <div>
                <p className="text-sm font-medium">We add some magic</p>
                <p className="text-xs text-[#737373]">A smart, invisible footer that Gmail loves</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Emails land in Primary</p>
                <p className="text-xs text-[#737373]">Skip the Promotions tab, reach real inboxes</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#e5e5e5] my-3" />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center mb-1.5">
                <EyeOffIcon className="w-4 h-4 text-[#22c55e]" />
              </div>
              <p className="text-[11px] font-medium text-[#525252]">Invisible to readers</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center mb-1.5">
                <ShieldCheckIcon className="w-4 h-4 text-[#22c55e]" />
              </div>
              <p className="text-[11px] font-medium text-[#525252]">No links or tracking</p>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center mb-1.5">
                <ZapIcon className="w-4 h-4 text-[#22c55e]" />
              </div>
              <p className="text-[11px] font-medium text-[#525252]">Works automatically</p>
            </div>
          </div>

          {/* FAQ teaser */}
          <div className="mt-3 p-3 bg-[#fafafa] rounded-lg">
            <p className="text-xs text-[#737373]">
              <span className="font-medium text-[#525252]">Will my subscribers see anything?</span>
              {" "}Nope! The footer is completely hidden - it only helps Gmail understand your email is legitimate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
