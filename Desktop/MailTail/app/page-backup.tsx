import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f0f0f0]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between h-14 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#171717] flex items-center justify-center">
                <MailIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">MailTail</span>
            </Link>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-xs text-[#737373] hover:text-[#171717] transition-colors px-2 py-1 rounded-md hover:bg-[#f5f5f5]">
                    Tools
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/tools/dmarc-generator" className="flex items-start gap-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] flex items-center justify-center shrink-0">
                        <ShieldIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">DMARC Generator</div>
                        <div className="text-xs text-[#737373]">Create DMARC records</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/tools/domain-health" className="flex items-start gap-3 cursor-pointer">
                      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center shrink-0">
                        <SearchIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Domain Health</div>
                        <div className="text-xs text-[#737373]">Check email authentication</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs text-[#737373] h-8">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="text-xs h-8 px-3">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f5] text-xs font-medium text-[#525252] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            Works with Klaviyo
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15] mb-4">
            Land in Primary,
            <br />
            <span className="text-[#22c55e]">Not Promotions</span>
          </h1>

          <p className="text-base text-[#737373] max-w-md mx-auto mb-8">
            Add optimized footer content to your Klaviyo templates to improve Gmail inbox placement.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            <Link href="/signup">
              <Button className="w-full sm:w-auto h-10 px-5 text-sm gap-2">
                Start Free
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto h-10 px-5 text-sm">
                Log in
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-[#a3a3a3]">
            {["No credit card", "2 min setup", "Cancel anytime"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckIcon className="w-3 h-3 text-[#22c55e]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email Preview */}
        <div className="max-w-lg mx-auto mt-16">
          <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e5e5e5] bg-[#fafafa]">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-white border border-[#e5e5e5] text-[10px] text-[#737373]">
                  <InboxIcon className="w-3 h-3" />
                  Primary
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xs font-semibold">
                  YB
                </div>
                <div>
                  <div className="text-sm font-medium">Your Brand</div>
                  <div className="text-[10px] text-[#a3a3a3]">to me</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#f5f5f5] rounded-full w-3/4" />
                <div className="h-3 bg-[#f5f5f5] rounded-full w-full" />
                <div className="h-3 bg-[#f5f5f5] rounded-full w-5/6" />
                <div className="h-16 bg-[#f5f5f5] rounded-lg w-full mt-3" />
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dashed border-[#e5e5e5]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span className="text-[10px] text-[#22c55e] font-medium">MailTail active</span>
                <span className="text-[10px] text-[#a3a3a3]">— invisible to recipients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">How it works</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Connect", desc: "Link your Klaviyo account", icon: "🔗" },
              { step: "2", title: "Process", desc: "Select template to optimize", icon: "⚡" },
              { step: "3", title: "Done", desc: "Use your enhanced template", icon: "✅" },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl border border-[#e5e5e5] p-5 text-center">
                <div className="text-2xl mb-3">{item.icon}</div>
                <div className="text-xs font-medium text-[#a3a3a3] mb-1">Step {item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-[#737373]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Why emails land in Promotions
              </h2>
              <p className="text-[#737373] mb-6">
                Gmail uses machine learning to categorize emails. Marketing emails lack personal, conversational signals.
              </p>
              <p className="text-[#737373] mb-6">
                MailTail adds invisible footer content that signals your email is a legitimate personal communication.
              </p>
              <div className="space-y-3">
                {[
                  "Hidden from recipients",
                  "Mimics personal email patterns",
                  "Improves placement 40%+",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-[#22c55e]" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#fafafa] rounded-xl border border-[#e5e5e5] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#171717] flex items-center justify-center">
                  <MailIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-sm">Your Email</div>
                  <div className="text-xs text-[#737373]">+ MailTail footer</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#e5e5e5] rounded-full w-full" />
                <div className="h-3 bg-[#e5e5e5] rounded-full w-4/5" />
                <div className="h-12 bg-[#e5e5e5] rounded-lg w-full" />
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-[#d4d4d4]">
                <div className="flex items-center gap-2">
                  <ZapIcon className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span className="text-xs text-[#22c55e] font-medium">Footer injected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section id="tools" className="py-20 px-6 bg-[#fafafa] scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              <WrenchIcon className="w-3 h-3 mr-1" />
              Free Tools
            </Badge>
            <h2 className="text-2xl font-bold mb-2">Email Deliverability Tools</h2>
            <p className="text-[#737373] max-w-md mx-auto">
              Free tools to improve your email authentication and deliverability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/tools/dmarc-generator" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-[#22c55e]">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] flex items-center justify-center shrink-0">
                      <ShieldIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 group-hover:text-[#22c55e] transition-colors">DMARC Generator</h3>
                      <p className="text-sm text-[#737373] mb-3">
                        Create a DMARC policy to protect against spoofing.
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#22c55e]">
                        Generate record
                        <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tools/domain-health" className="group">
              <Card className="h-full transition-all hover:shadow-md hover:border-[#22c55e]">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#ec4899] flex items-center justify-center shrink-0">
                      <SearchIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 group-hover:text-[#22c55e] transition-colors">Domain Health Check</h3>
                      <p className="text-sm text-[#737373] mb-3">
                        Analyze DMARC, SPF, and DKIM configuration.
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#22c55e]">
                        Check domain
                        <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-[#171717] rounded-2xl px-8 py-12">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to land in Primary?
          </h2>
          <p className="text-[#a3a3a3] mb-6">
            Join brands using MailTail to improve their inbox placement.
          </p>
          <Link href="/signup">
            <Button className="bg-white text-[#171717] hover:bg-[#f5f5f5] h-10 px-6 text-sm gap-2">
              Get Started Free
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e5e5] py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#171717] flex items-center justify-center">
              <MailIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold">MailTail</span>
          </div>
          <p className="text-xs text-[#a3a3a3]">
            © {new Date().getFullYear()} MailTail. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
