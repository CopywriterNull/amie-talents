import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
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

export default async function HistoryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: templates } = await supabase
    .from("processed_templates")
    .select("*")
    .eq("user_id", user?.id)
    .order("processed_at", { ascending: false });

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">History</h1>
          <p className="text-[#737373] text-sm">
            {templates?.length ?? 0} template{templates?.length !== 1 ? "s" : ""} processed
          </p>
        </div>
        <Link href="/dashboard/process">
          <Button size="sm" className="gap-1.5 h-9 text-sm">
            <ZapIcon className="w-3.5 h-3.5" />
            Process New
          </Button>
        </Link>
      </div>

      {!templates || templates.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e5e5] p-12 text-center card-shadow">
          {/* Empty state illustration */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f5] to-[#e5e5e5] rounded-2xl rotate-6" />
            <div className="absolute inset-0 bg-gradient-to-br from-white to-[#f5f5f5] rounded-2xl border border-[#e5e5e5] flex items-center justify-center">
              <div className="space-y-1.5">
                <div className="w-10 h-1.5 bg-[#e5e5e5] rounded mx-auto" />
                <div className="w-8 h-1.5 bg-[#e5e5e5] rounded mx-auto" />
                <div className="w-6 h-1.5 bg-[#e5e5e5] rounded mx-auto" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#f5f5f5] rounded-lg flex items-center justify-center border border-[#e5e5e5]">
              <ClockIcon className="w-4 h-4 text-[#a3a3a3]" />
            </div>
          </div>

          <h3 className="font-semibold mb-2">Your history is empty</h3>
          <p className="text-[#737373] text-sm mb-6 max-w-xs mx-auto">
            When you process templates, they&apos;ll show up here so you can track everything in one place.
          </p>
          <Link href="/dashboard/process">
            <Button size="sm" className="gap-1.5">
              <ZapIcon className="w-3.5 h-3.5" />
              Process Your First Template
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e5e5] divide-y divide-[#e5e5e5] card-shadow overflow-hidden">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 hover:bg-[#fafafa] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] flex items-center justify-center flex-shrink-0">
                  <ZapIcon className="w-3.5 h-3.5 text-[#22c55e]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {template.template_name?.replace(" - MailTail", "") || "Untitled"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#737373]">
                    <code className="font-mono bg-[#f5f5f5] px-1.5 py-0.5 rounded">
                      {template.new_template_id}
                    </code>
                    <span>•</span>
                    <span>{formatDate(template.processed_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
