"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSubscriptionStatus } from "@/components/subscription-banner";

const CACHE_KEY = "mailtail_templates_cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface TemplateCache {
  templates: Template[];
  nextCursor: string | null;
  timestamp: number;
}

function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
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

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
      <path d="M6 8h.001" />
      <path d="M10 8h.001" />
      <path d="M14 8h.001" />
      <path d="M18 8h.001" />
      <path d="M8 12h.001" />
      <path d="M12 12h.001" />
      <path d="M16 12h.001" />
      <path d="M7 16h10" />
    </svg>
  );
}

interface Template {
  id: string;
  name: string;
  editor_type: string;
  html: string;
  updated: string;
  created: string;
}

// Check if template has been processed by MailTail
function isMailTailTemplate(template: Template): boolean {
  // Check if name contains MailTail suffix or if HTML contains the footer signature
  return (
    template.name.includes(" - MailTail") ||
    template.html.includes("This footer was designed to ensure transparency")
  );
}

function TemplatePreview({ html, className }: { html: string; className?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                transform-origin: top left;
                overflow: hidden;
              }
            </style>
          </head>
          <body>${html}</body>
          </html>
        `);
        doc.close();
      }
    }
  }, [html]);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      sandbox="allow-same-origin"
      title="Template preview"
    />
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

export default function ProcessPage() {
  const { status: subscriptionStatus, loading: subscriptionLoading, canProcess } = useSubscriptionStatus();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualTemplateId, setManualTemplateId] = useState("");
  const [showProcessed, setShowProcessed] = useState(false);
  const [cacheAge, setCacheAge] = useState<string | null>(null);

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    newTemplateId: string;
    templateName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Load from cache or fetch
  const loadTemplates = useCallback(async (forceRefresh = false) => {
    // Try loading from cache first (unless forcing refresh)
    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cache: TemplateCache = JSON.parse(cached);
          const age = Date.now() - cache.timestamp;

          if (age < CACHE_DURATION) {
            setTemplates(cache.templates);
            setNextCursor(cache.nextCursor);
            setLoading(false);
            setCacheAge(formatCacheAge(age));
            return;
          }
        }
      } catch {
        // Ignore cache errors
      }
    }

    // Fetch from API
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/klaviyo/templates");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch templates");
      }

      setTemplates(data.templates);
      setNextCursor(data.nextCursor);
      setCacheAge(null);

      // Save to cache
      const cacheData: TemplateCache = {
        templates: data.templates,
        nextCursor: data.nextCursor,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      if (forceRefresh) {
        toast.success("Templates refreshed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  function formatCacheAge(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  }

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Update cache age periodically
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cache: TemplateCache = JSON.parse(cached);
          const age = Date.now() - cache.timestamp;
          setCacheAge(formatCacheAge(age));
        }
      } catch {
        // Ignore
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  async function fetchMoreTemplates(cursor: string) {
    setLoadingMore(true);
    setError(null);

    try {
      const res = await fetch(`/api/klaviyo/templates?cursor=${cursor}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch templates");
      }

      const newTemplates = [...templates, ...data.templates];
      setTemplates(newTemplates);
      setNextCursor(data.nextCursor);

      // Update cache with new templates
      const cacheData: TemplateCache = {
        templates: newTemplates,
        nextCursor: data.nextCursor,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingMore(false);
    }
  }

  function invalidateCache() {
    localStorage.removeItem(CACHE_KEY);
    setCacheAge(null);
  }

  async function handleProcess(templateId: string) {
    setProcessError(null);
    setResult(null);
    setProcessing(true);

    try {
      const res = await fetch("/api/templates/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process template");
      }

      setResult({
        newTemplateId: data.newTemplateId,
        templateName: data.templateName,
      });
      setSelectedTemplate(null);
      setManualTemplateId("");
      invalidateCache(); // Clear cache so new template shows on next refresh
    } catch (err) {
      setProcessError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setProcessing(false);
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const isProcessed = isMailTailTemplate(t);
    if (!showProcessed && isProcessed) return false;
    return matchesSearch;
  });

  const unprocessedCount = templates.filter(t => !isMailTailTemplate(t)).length;
  const processedCount = templates.filter(t => isMailTailTemplate(t)).length;

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Show disabled state if can't process
  if (!subscriptionLoading && !canProcess) {
    return (
      <div className="space-y-6 animate-slide-up">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Process Template</h1>
          <p className="text-[#737373] mt-1">
            Select a template to add the MailTail footer
          </p>
        </div>

        {/* Disabled State */}
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-8 text-center card-shadow">
          <div className="w-16 h-16 rounded-2xl bg-[#f5f5f5] flex items-center justify-center mx-auto mb-5">
            <LockIcon className="w-7 h-7 text-[#a3a3a3]" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Template Processing Disabled</h2>
          <p className="text-[#737373] max-w-md mx-auto mb-6">
            {subscriptionStatus?.status === "suspended"
              ? "Your account has been suspended. Please contact support to resolve this issue."
              : subscriptionStatus?.status === "expired"
              ? subscriptionStatus?.trialType === "usage"
                ? `You've used all ${subscriptionStatus?.trialTemplateLimit} templates in your trial. Contact us to continue.`
                : "Your trial period has ended. Contact us to continue using MailTail."
              : "You need an active subscription to process templates."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="mailto:hello@mailtail.io?subject=MailTail%20Subscription"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] text-white text-sm font-medium rounded-lg hover:bg-[#404040] transition-colors"
            >
              Contact Sales
            </a>
            <a
              href="/dashboard/history"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#171717] text-sm font-medium rounded-lg border border-[#e5e5e5] hover:border-[#171717] transition-colors"
            >
              View History
            </a>
          </div>
        </div>

        {/* Usage Stats for Expired Trial */}
        {subscriptionStatus?.hasSubscription && (
          <div className="bg-white rounded-xl border border-[#e5e5e5] p-5 card-shadow">
            <h3 className="text-sm font-semibold mb-4">Trial Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              {subscriptionStatus?.trialType === "usage" && (
                <>
                  <div>
                    <p className="text-xs text-[#737373]">Templates Used</p>
                    <p className="text-xl font-bold">
                      {subscriptionStatus?.trialTemplatesUsed || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#737373]">Template Limit</p>
                    <p className="text-xl font-bold">
                      {subscriptionStatus?.trialTemplateLimit || 0}
                    </p>
                  </div>
                </>
              )}
              {subscriptionStatus?.trialType === "time" && (
                <div className="col-span-2">
                  <p className="text-xs text-[#737373]">Trial Ended</p>
                  <p className="text-sm font-medium">
                    {subscriptionStatus?.trialEndsAt
                      ? new Date(subscriptionStatus.trialEndsAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Process Template</h1>
          <p className="text-[#737373] mt-1">
            Select a template to add the MailTail footer
            {cacheAge && !loading && (
              <span className="text-[#a3a3a3]"> · Cached {cacheAge}</span>
            )}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          {!showManualInput && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadTemplates(true)}
              disabled={refreshing}
              className="gap-1.5"
            >
              <RefreshIcon className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowManualInput(!showManualInput)}
          >
            <KeyboardIcon className="w-4 h-4 mr-2" />
            {showManualInput ? "Browse Templates" : "Enter ID Manually"}
          </Button>
        </div>
      </div>

      {/* Success Result */}
      {result && (
        <div className="p-5 bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#bbf7d0] rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center shadow-sm">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#166534]">Template processed successfully!</span>
          </div>
          <div className="space-y-3 pl-11">
            <div>
              <span className="text-sm text-[#15803d]">New template:</span>
              <p className="font-semibold text-[#166534]">{result.templateName}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-[#15803d]">Template ID:</span>
              <div className="flex items-center gap-2">
                <code className="bg-white px-3 py-1.5 rounded-lg text-sm font-mono border border-[#bbf7d0] text-[#166534]">
                  {result.newTemplateId}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(result.newTemplateId)}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  {copied ? (
                    <CheckIcon className="w-4 h-4 text-[#22c55e]" />
                  ) : (
                    <CopyIcon className="w-4 h-4 text-[#15803d]" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="pl-11">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResult(null)}
              className="text-[#15803d] border-[#bbf7d0] hover:bg-white/50"
            >
              Process Another Template
            </Button>
          </div>
        </div>
      )}

      {/* Manual Input Mode */}
      {showManualInput && !result && (
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#f5f5f5] flex items-center justify-center">
              <KeyboardIcon className="w-5 h-5 text-[#737373]" />
            </div>
            <div>
              <h2 className="font-semibold">Manual Template ID</h2>
              <p className="text-sm text-[#737373]">Enter your Klaviyo template ID directly</p>
            </div>
          </div>

          {processError && (
            <div className="flex items-start gap-3 p-4 mb-4 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-xl">
              <div className="w-5 h-5 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span>{processError}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (manualTemplateId) handleProcess(manualTemplateId);
            }}
            className="flex gap-3"
          >
            <Input
              type="text"
              placeholder="e.g., AbC123"
              value={manualTemplateId}
              onChange={(e) => setManualTemplateId(e.target.value)}
              className="flex-1 h-11 font-mono"
            />
            <Button
              type="submit"
              disabled={processing || !manualTemplateId}
              className="h-11 px-6"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ZapIcon className="w-4 h-4" />
                  Process
                </span>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Template Browser */}
      {!showManualInput && !result && (
        <>
          {/* Search and Filter */}
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a3a3a3]" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
            <button
              onClick={() => setShowProcessed(!showProcessed)}
              className={`flex items-center gap-2 px-3 h-10 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
                showProcessed
                  ? "bg-[#0f0f0f] text-white border-[#0f0f0f]"
                  : "bg-white text-[#737373] border-[#e5e5e5] hover:border-[#0f0f0f]"
              }`}
            >
              {showProcessed ? "Showing All" : "Show Processed"}
              {processedCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  showProcessed ? "bg-white/20" : "bg-[#f5f5f5]"
                }`}>
                  {processedCount}
                </span>
              )}
            </button>
          </div>

          {/* Template counts */}
          {!loading && templates.length > 0 && (
            <div className="flex gap-4 text-xs text-[#737373]">
              <span>{unprocessedCount} unprocessed</span>
              <span>{processedCount} processed</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 text-sm text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-xl">
              <div className="w-5 h-5 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#e5e5e5] border-t-[#0f0f0f] rounded-full animate-spin mb-4" />
              <p className="text-[#737373]">Loading your templates...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && templates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4">
                <GridIcon className="w-6 h-6 text-[#737373]" />
              </div>
              <h3 className="font-semibold mb-1">No templates found</h3>
              <p className="text-[#737373] text-sm">
                Create templates in Klaviyo first, or use the manual ID input.
              </p>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && templates.length > 0 && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#737373]">No templates match &quot;{search}&quot;</p>
            </div>
          )}

          {/* Template Grid */}
          {!loading && filteredTemplates.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className="group bg-white rounded-xl border border-[#e5e5e5] overflow-hidden text-left hover:border-[#0f0f0f] hover:shadow-md transition-all card-shadow"
                  >
                    {/* Preview */}
                    <div className="aspect-[4/3] bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden relative">
                      <TemplatePreview
                        html={template.html}
                        className="w-[500%] h-[500%] scale-[0.20] origin-top-left pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {isMailTailTemplate(template) && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#22c55e] text-white text-[10px] font-medium rounded">
                          Processed
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <h3 className={`font-medium text-xs truncate ${isMailTailTemplate(template) ? "text-[#a3a3a3]" : "group-hover:text-[#0f0f0f]"}`}>
                        {template.name.replace(" - MailTail", "")}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>

              {/* Load More */}
              {nextCursor && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchMoreTemplates(nextCursor)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-[#e5e5e5] border-t-[#0f0f0f] rounded-full animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Load More Templates"
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Selected Template Modal */}
      {selectedTemplate && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setSelectedTemplate(null)}
        >
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3 border-b border-[#e5e5e5]">
              <div className="flex-1 min-w-0 pr-3">
                <h2 className="font-semibold text-sm truncate">{selectedTemplate.name}</h2>
                <p className="text-xs text-[#737373]">
                  ID: <code className="font-mono bg-[#f5f5f5] px-1 py-0.5 rounded text-[11px]">{selectedTemplate.id}</code>
                </p>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body - Preview */}
            <div className="flex-1 overflow-auto bg-[#fafafa] p-3">
              <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden shadow-sm">
                <TemplatePreview
                  html={selectedTemplate.html}
                  className="w-full h-[280px]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-[#e5e5e5] bg-white">
              {processError && (
                <div className="p-2 mb-3 text-xs text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg">
                  {processError}
                </div>
              )}
              {isMailTailTemplate(selectedTemplate) && (
                <div className="p-2 mb-3 text-xs text-[#b45309] bg-[#fffbeb] border border-[#fde68a] rounded-lg flex items-center gap-2">
                  <span className="font-medium">Already processed.</span>
                  <span className="text-[#92400e]">Processing again will create a duplicate.</span>
                </div>
              )}
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleProcess(selectedTemplate.id)}
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <ZapIcon className="w-3.5 h-3.5" />
                      {isMailTailTemplate(selectedTemplate) ? "Process Again" : "Process"}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
