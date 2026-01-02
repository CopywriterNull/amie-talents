"use client";

import { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSubscriptionStatus } from "@/components/subscription-banner";
import { SparklesCore } from "@/components/ui/sparkles";

// SWR fetcher
const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
});

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

  // SWR for template fetching - instant cache, background revalidation
  const { data, error, isLoading, isValidating, mutate } = useSWR<{
    templates: Template[];
    nextCursor: string | null;
  }>("/api/klaviyo/templates", fetcher, {
    revalidateOnFocus: true,        // Refresh when tab gets focus
    revalidateOnReconnect: true,    // Refresh when network reconnects
    dedupingInterval: 30000,        // Dedupe requests within 30s
    keepPreviousData: true,         // Show stale data while revalidating
  });

  const templates = data?.templates || [];
  const nextCursor = data?.nextCursor || null;
  const loading = isLoading;
  const refreshing = isValidating && !isLoading;

  // Additional templates from "load more"
  const [additionalTemplates, setAdditionalTemplates] = useState<Template[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);

  // Combine SWR templates with additional loaded templates
  const allTemplates = [...templates, ...additionalTemplates];

  // Reset additional templates when SWR data changes
  useEffect(() => {
    setAdditionalTemplates([]);
    setCurrentCursor(nextCursor);
  }, [data, nextCursor]);

  const [search, setSearch] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualTemplateId, setManualTemplateId] = useState("");
  const [showProcessed, setShowProcessed] = useState(false);

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    newTemplateId: string;
    templateName: string;
    isPending?: boolean; // Optimistic UI flag
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Optimistic UI - track templates being processed
  const [optimisticallyProcessed, setOptimisticallyProcessed] = useState<Set<string>>(new Set());

  // Bulk processing state
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{
    current: number;
    total: number;
    completed: string[];
    failed: string[];
  } | null>(null);

  // Refresh templates
  async function refreshTemplates() {
    await mutate();
    toast.success("Templates refreshed");
  }

  async function fetchMoreTemplates(cursor: string) {
    setLoadingMore(true);

    try {
      const res = await fetch(`/api/klaviyo/templates?cursor=${cursor}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch templates");
      }

      setAdditionalTemplates((prev) => [...prev, ...data.templates]);
      setCurrentCursor(data.nextCursor);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoadingMore(false);
    }
  }

  // Invalidate cache after processing
  function invalidateCache() {
    mutate();
  }

  async function handleProcess(templateId: string) {
    // Find the template for optimistic update
    const template = allTemplates.find((t) => t.id === templateId);
    const templateName = template?.name || "Template";

    // OPTIMISTIC: Immediately show success
    setOptimisticallyProcessed((prev) => new Set(prev).add(templateId));
    setSelectedTemplate(null);
    setManualTemplateId("");
    setProcessError(null);
    setResult({
      newTemplateId: "pending...",
      templateName: `${templateName} - MailTail`,
      isPending: true,
    });
    toast.success("Processing template...", { duration: 2000 });

    // BACKGROUND: Actually process
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

      // SUCCESS: Update with real data
      setResult({
        newTemplateId: data.newTemplateId,
        templateName: data.templateName,
        isPending: false,
      });
      toast.success("Template processed successfully!");
      invalidateCache();
    } catch (err) {
      // FAILURE: Revert optimistic update
      setOptimisticallyProcessed((prev) => {
        const next = new Set(prev);
        next.delete(templateId);
        return next;
      });
      setResult(null);
      toast.error(err instanceof Error ? err.message : "Failed to process template");
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Bulk selection helpers
  function toggleTemplateSelection(templateId: string) {
    setSelectedTemplates((prev) => {
      const next = new Set(prev);
      if (next.has(templateId)) {
        next.delete(templateId);
      } else {
        next.add(templateId);
      }
      return next;
    });
  }

  function selectAllUnprocessed() {
    const unprocessed = filteredTemplates.filter((t) => !isMailTailTemplate(t));
    setSelectedTemplates(new Set(unprocessed.map((t) => t.id)));
  }

  function clearSelection() {
    setSelectedTemplates(new Set());
    setBulkMode(false);
  }

  // Bulk processing
  async function handleBulkProcess() {
    const templateIds = Array.from(selectedTemplates);
    if (templateIds.length === 0) return;

    setBulkProcessing(true);
    setBulkProgress({
      current: 0,
      total: templateIds.length,
      completed: [],
      failed: [],
    });

    const completed: string[] = [];
    const failed: string[] = [];

    for (let i = 0; i < templateIds.length; i++) {
      const templateId = templateIds[i];
      const template = allTemplates.find((t) => t.id === templateId);

      setBulkProgress({
        current: i + 1,
        total: templateIds.length,
        completed,
        failed,
      });

      try {
        const res = await fetch("/api/templates/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed");
        }

        completed.push(template?.name || templateId);
      } catch {
        failed.push(template?.name || templateId);
      }
    }

    setBulkProgress({
      current: templateIds.length,
      total: templateIds.length,
      completed,
      failed,
    });

    setBulkProcessing(false);
    setSelectedTemplates(new Set());
    setBulkMode(false);
    invalidateCache();

    // Show toast with results
    if (failed.length === 0) {
      toast.success(`Successfully processed ${completed.length} templates!`);
    } else if (completed.length === 0) {
      toast.error(`Failed to process all ${failed.length} templates`);
    } else {
      toast.success(`Processed ${completed.length} templates, ${failed.length} failed`);
    }
  }

  const filteredTemplates = allTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const isProcessed = isMailTailTemplate(t);
    if (!showProcessed && isProcessed) return false;
    return matchesSearch;
  });

  const unprocessedCount = allTemplates.filter(t => !isMailTailTemplate(t)).length;
  const processedCount = allTemplates.filter(t => isMailTailTemplate(t)).length;

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
            {refreshing && (
              <span className="text-[#a3a3a3]"> · Refreshing...</span>
            )}
          </p>
        </div>
        <div className="flex gap-2 self-start">
          {!showManualInput && !result && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshTemplates}
                disabled={refreshing}
                className="gap-1.5"
              >
                <RefreshIcon className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant={bulkMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setBulkMode(!bulkMode);
                  if (bulkMode) setSelectedTemplates(new Set());
                }}
                className="gap-1.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                {bulkMode ? "Cancel Select" : "Select Multiple"}
              </Button>
            </>
          )}
          {!result && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowManualInput(!showManualInput)}
            >
              <KeyboardIcon className="w-4 h-4 mr-2" />
              {showManualInput ? "Browse Templates" : "Enter ID Manually"}
            </Button>
          )}
        </div>
      </div>

      {/* What happens explainer - show when no result */}
      {!result && (
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#fafafa] to-white border border-[#e5e5e5] rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[#737373]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[#525252]">What happens when you process?</p>
            <p className="text-xs text-[#737373] mt-0.5">
              We create a copy of your template with our inbox-boosting magic. Your original template stays untouched,
              and you can use the new one in your campaigns right away.
            </p>
          </div>
        </div>
      )}

      {/* Success Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring" }}
            className={`p-5 rounded-xl space-y-4 relative overflow-hidden ${
              result.isPending
                ? "bg-gradient-to-br from-[#fefce8] to-[#fef9c3] border border-[#fde047]"
                : "bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#bbf7d0]"
            }`}
          >
            {/* Sparkles on success */}
            {!result.isPending && (
              <SparklesCore
                particleCount={30}
                particleColor="#22c55e"
                minSize={3}
                maxSize={6}
              />
            )}

            <div className="flex items-center gap-3 relative z-10">
              {result.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full bg-[#eab308] flex items-center justify-center shadow-sm"
                  >
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  </motion.div>
                  <span className="font-semibold text-[#854d0e]">Processing your template...</span>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-8 h-8 rounded-full bg-[#22c55e] flex items-center justify-center shadow-sm"
                  >
                    <CheckIcon className="w-4 h-4 text-white" />
                  </motion.div>
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-semibold text-[#166534]"
                  >
                    You&apos;re all set!
                  </motion.span>
                </>
              )}
            </div>
          <div className="space-y-3 pl-11 relative z-10">
            <p className={`text-sm ${result.isPending ? "text-[#a16207]" : "text-[#15803d]"}`}>
              {result.isPending
                ? "Hang tight! We're adding inbox-boosting magic to your template..."
                : "Your template is ready to send. When Klaviyo delivers emails using this template, our smart footer will automatically help them land in Primary."
              }
            </p>
            <div>
              <span className={`text-xs font-medium ${result.isPending ? "text-[#a16207]" : "text-[#15803d]"}`}>New template:</span>
              <p className={`font-semibold ${result.isPending ? "text-[#854d0e]" : "text-[#166534]"}`}>{result.templateName}</p>
            </div>
            {!result.isPending && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-[#15803d] font-medium">Template ID:</span>
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
            )}
          </div>
          {!result.isPending && (
            <div className="pl-11 pt-2 flex items-center gap-3 relative z-10">
              <a
                href={`https://www.klaviyo.com/email-editor/${result.newTemplateId}/edit`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#22c55e] text-white text-sm font-medium rounded-lg hover:bg-[#16a34a] transition-colors"
              >
              Open in Klaviyo
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResult(null)}
              className="text-[#15803d] border-[#bbf7d0] hover:bg-white/50"
            >
              Process Another
            </Button>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>

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
          {!loading && allTemplates.length > 0 && (
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
              <span>{error.message || "Failed to load templates"}</span>
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
          {!loading && !error && allTemplates.length === 0 && (
            <div className="bg-white rounded-xl border border-[#e5e5e5] p-12 text-center card-shadow">
              {/* Empty state illustration */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                {/* Stacked template cards */}
                <div className="absolute top-4 left-2 w-20 h-24 bg-[#f5f5f5] rounded-lg border border-[#e5e5e5] rotate-[-8deg]" />
                <div className="absolute top-2 left-4 w-20 h-24 bg-[#fafafa] rounded-lg border border-[#e5e5e5] rotate-[-4deg]" />
                <div className="absolute top-0 left-6 w-20 h-24 bg-white rounded-lg border border-[#e5e5e5] flex flex-col items-center justify-center gap-1.5 p-3">
                  <div className="w-full h-8 bg-[#f5f5f5] rounded" />
                  <div className="w-full h-2 bg-[#e5e5e5] rounded" />
                  <div className="w-3/4 h-2 bg-[#e5e5e5] rounded" />
                </div>
                {/* Plus icon */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#0f0f0f] rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </div>
              </div>

              <h3 className="font-semibold mb-2">No templates in Klaviyo yet</h3>
              <p className="text-[#737373] text-sm mb-6 max-w-sm mx-auto">
                Create your first email template in Klaviyo, then come back here to add MailTail&apos;s inbox magic.
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://www.klaviyo.com/email-templates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f0f0f] text-white text-sm font-medium rounded-lg hover:bg-[#262626] transition-colors"
                >
                  Open Klaviyo
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManualInput(true)}
                >
                  Enter ID Manually
                </Button>
              </div>
            </div>
          )}

          {/* No Search Results */}
          {!loading && !error && allTemplates.length > 0 && filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#737373]">No templates match &quot;{search}&quot;</p>
            </div>
          )}

          {/* Bulk mode header */}
          {bulkMode && (
            <div className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg">
              <span className="text-sm text-[#525252]">
                {selectedTemplates.size === 0
                  ? "Click templates to select them"
                  : `${selectedTemplates.size} template${selectedTemplates.size === 1 ? "" : "s"} selected`}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllUnprocessed}
                  className="h-7 text-xs"
                >
                  Select All Unprocessed
                </Button>
                {selectedTemplates.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="h-7 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Template Grid */}
          {!loading && filteredTemplates.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplates.has(template.id);
                  const isProcessed = isMailTailTemplate(template);
                  const isOptimisticallyProcessed = optimisticallyProcessed.has(template.id);

                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        if (bulkMode) {
                          toggleTemplateSelection(template.id);
                        } else {
                          setSelectedTemplate(template);
                        }
                      }}
                      className={`group bg-white rounded-xl border overflow-hidden text-left transition-all card-shadow ${
                        isSelected
                          ? "border-[#0f0f0f] ring-2 ring-[#0f0f0f]"
                          : "border-[#e5e5e5] hover:border-[#0f0f0f] hover:shadow-md"
                      }`}
                    >
                      {/* Preview */}
                      <div className="aspect-[4/3] bg-[#fafafa] border-b border-[#e5e5e5] overflow-hidden relative">
                        <TemplatePreview
                          html={template.html}
                          className="w-[500%] h-[500%] scale-[0.20] origin-top-left pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Checkbox in bulk mode */}
                        {bulkMode && (
                          <div className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-[#0f0f0f] border-[#0f0f0f]"
                              : "bg-white border-[#d4d4d4]"
                          }`}>
                            {isSelected && (
                              <CheckIcon className="w-3 h-3 text-white" />
                            )}
                          </div>
                        )}

                        {isOptimisticallyProcessed && !isProcessed && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#eab308] text-white text-[10px] font-medium rounded flex items-center gap-1">
                            <div className="w-2 h-2 border border-white/30 border-t-white rounded-full animate-spin" />
                            Processing
                          </div>
                        )}
                        {isProcessed && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#22c55e] text-white text-[10px] font-medium rounded">
                            Processed
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-2.5">
                        <h3 className={`font-medium text-xs truncate ${isProcessed || isOptimisticallyProcessed ? "text-[#a3a3a3]" : "group-hover:text-[#0f0f0f]"}`}>
                          {template.name.replace(" - MailTail", "")}
                        </h3>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Load More */}
              {currentCursor && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => fetchMoreTemplates(currentCursor)}
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

      {/* Bulk Processing Floating Action Bar */}
      {bulkMode && selectedTemplates.size > 0 && !bulkProcessing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="flex items-center gap-4 px-5 py-3 bg-[#0f0f0f] text-white rounded-xl shadow-2xl">
            <span className="text-sm font-medium">
              {selectedTemplates.size} template{selectedTemplates.size === 1 ? "" : "s"} selected
            </span>
            <div className="w-px h-5 bg-white/20" />
            <Button
              size="sm"
              onClick={handleBulkProcess}
              className="bg-white text-[#0f0f0f] hover:bg-[#f5f5f5] gap-1.5"
            >
              <ZapIcon className="w-3.5 h-3.5" />
              Process All
            </Button>
            <button
              onClick={clearSelection}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Processing Progress Modal */}
      {bulkProcessing && bulkProgress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#171717] to-[#404040] flex items-center justify-center">
                <ZapIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">Processing Templates</h2>
                <p className="text-sm text-[#737373]">
                  {bulkProgress.current} of {bulkProgress.total} complete
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-[#22c55e] transition-all duration-300"
                style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
              />
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-sm">
              <span className="text-[#22c55e]">
                {bulkProgress.completed.length} completed
              </span>
              {bulkProgress.failed.length > 0 && (
                <span className="text-[#dc2626]">
                  {bulkProgress.failed.length} failed
                </span>
              )}
            </div>

            <p className="text-xs text-[#a3a3a3] mt-4">
              Please wait while we process your templates...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
