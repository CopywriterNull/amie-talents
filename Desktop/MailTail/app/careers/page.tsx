"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  );
}

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

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function CoffeeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const jobs = [
  {
    id: "bdr",
    title: "Business Development Representative",
    department: "Sales",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$55K - $75K + Commission",
    description: "Drive outbound prospecting and qualify leads for our growing sales team. You'll be the first point of contact for potential customers.",
    responsibilities: [
      "Conduct outbound prospecting via email, phone, and LinkedIn",
      "Qualify inbound leads and schedule demos for Account Executives",
      "Research target accounts and identify key decision makers",
      "Maintain accurate records in our CRM",
      "Collaborate with marketing on campaign feedback",
    ],
    requirements: [
      "1+ years in a sales or customer-facing role",
      "Excellent written and verbal communication skills",
      "Experience with CRM tools (Salesforce, HubSpot, etc.)",
      "Self-motivated with a hunter mentality",
      "Interest in email marketing and SaaS",
    ],
  },
  {
    id: "ae",
    title: "Account Executive",
    department: "Sales",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$80K - $120K + Commission",
    description: "Own the full sales cycle from demo to close. Help e-commerce brands improve their email deliverability with MailTail.",
    responsibilities: [
      "Manage full sales cycle from qualified lead to close",
      "Conduct product demos and discovery calls",
      "Build relationships with marketing teams at e-commerce brands",
      "Negotiate contracts and close deals",
      "Exceed monthly and quarterly revenue targets",
    ],
    requirements: [
      "2+ years of SaaS sales experience",
      "Track record of meeting or exceeding quota",
      "Experience selling to marketing or e-commerce teams",
      "Strong presentation and negotiation skills",
      "Familiarity with email marketing platforms like Klaviyo",
    ],
  },
];

const perks = [
  {
    icon: DollarSignIcon,
    title: "Competitive Compensation",
    description: "Base salary + uncapped commission. Top performers earn significantly more.",
  },
  {
    icon: HeartIcon,
    title: "Health & Wellness",
    description: "Full medical, dental, and vision coverage for you and your dependents.",
  },
  {
    icon: CoffeeIcon,
    title: "Remote-First",
    description: "Work from anywhere in the US. We trust you to do your best work.",
  },
  {
    icon: RocketIcon,
    title: "Growth Opportunity",
    description: "Join early and grow with us. Clear path to leadership roles.",
  },
];

export default function CareersPage() {
  const [showBanner, setShowBanner] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#f5f2ed] overflow-hidden">
      {/* Top Utility Bar */}
      <div className="bg-[#f5f2ed] border-b border-[#e5e0d5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-9">
            {/* Left utility links */}
            <div className="flex items-center gap-0">
              <Link href="/" className="text-xs text-[#525252] hover:text-[#171717] px-3 py-2">
                Home
              </Link>
              <Link href="/help" className="text-xs text-[#525252] hover:text-[#171717] px-3 py-2">
                Help center
              </Link>
              <Link href="/enterprise" className="text-xs text-[#525252] hover:text-[#171717] px-3 py-2">
                Enterprise
              </Link>
              <Link href="/partners" className="text-xs text-[#525252] hover:text-[#171717] px-3 py-2">
                Partners
              </Link>
              <Link href="/careers" className="text-xs text-[#171717] hover:text-[#171717] px-3 py-2 border-b-2 border-[#dc2626]">
                Careers
              </Link>
            </div>

            {/* Right utility links */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 text-xs text-[#525252] hover:text-[#171717] px-2 py-1">
                    <GlobeIcon className="w-4 h-4" />
                    <span>United States - EN</span>
                    <ChevronDownIcon className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>United States - EN</DropdownMenuItem>
                  <DropdownMenuItem>United Kingdom - EN</DropdownMenuItem>
                  <DropdownMenuItem>Canada - EN</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button className="p-1.5 text-[#525252] hover:text-[#171717]">
                <SearchIcon className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-[#e5e0d5]" />
              <Link href="/login" className="text-xs text-[#525252] hover:text-[#171717] px-2 py-1">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-[#f5f2ed] border-b border-[#e5e0d5]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and nav links */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center"
                >
                  <MailIcon className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-lg font-bold tracking-tight">mailtail</span>
              </Link>

              {/* Nav links with dropdowns */}
              <div className="hidden lg:flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#171717] px-3 py-2 transition-colors">
                      Platform
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem asChild>
                      <Link href="/platform/email" className="flex items-start gap-3 cursor-pointer py-3">
                        <div className="w-8 h-8 rounded-md bg-[#f0fdf4] flex items-center justify-center shrink-0">
                          <MailIcon className="w-4 h-4 text-[#22c55e]" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Email Optimization</div>
                          <div className="text-xs text-[#737373]">Improve inbox placement</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/platform/analytics" className="flex items-start gap-3 cursor-pointer py-3">
                        <div className="w-8 h-8 rounded-md bg-[#eff6ff] flex items-center justify-center shrink-0">
                          <ZapIcon className="w-4 h-4 text-[#3b82f6]" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Analytics</div>
                          <div className="text-xs text-[#737373]">Track deliverability metrics</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#171717] px-3 py-2 transition-colors">
                      Apps & Integrations
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem asChild>
                      <Link href="/integrations/klaviyo" className="flex items-start gap-3 cursor-pointer py-3">
                        <div className="w-8 h-8 rounded-md bg-[#171717] flex items-center justify-center shrink-0">
                          <SendIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Klaviyo</div>
                          <div className="text-xs text-[#737373]">Connect your Klaviyo account</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 text-sm text-[#525252] hover:text-[#171717] px-3 py-2 transition-colors">
                      Resources
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64">
                    <DropdownMenuItem asChild>
                      <Link href="/tools/dmarc-generator" className="flex items-start gap-3 cursor-pointer py-3">
                        <div className="w-8 h-8 rounded-md bg-[#171717] flex items-center justify-center shrink-0">
                          <ShieldIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">DMARC Generator</div>
                          <div className="text-xs text-[#737373]">Create DMARC records</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/tools/domain-health" className="flex items-start gap-3 cursor-pointer py-3">
                        <div className="w-8 h-8 rounded-md bg-[#171717] flex items-center justify-center shrink-0">
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

                <Link href="/how-it-works" className="text-sm text-[#525252] hover:text-[#171717] px-3 py-2 transition-colors">
                  How it works
                </Link>

                <Link href="/pricing" className="text-sm text-[#525252] hover:text-[#171717] px-3 py-2 transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">
              <Link href="/signup">
                <Button className="bg-[#171717] hover:bg-[#262626] text-white h-10 px-5 text-sm rounded-full">
                  Sign up
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" className="h-10 px-5 text-sm rounded-full border-[#171717] text-[#171717] hover:bg-[#ebe7e0]">
                  Get a demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Promotional Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#3e7ae3] text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-center relative">
              <Link href="/blog/deliverability-report" className="flex items-center gap-2 text-sm hover:underline">
                Dive into the data that defined Black Friday and Cyber Monday
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-6 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f2ed] via-[#f5f2ed] to-[#ebe7e0]" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ebe7e0] text-xs font-medium text-[#525252] mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              We're Hiring
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.15] mb-4"
            >
              Join Our Team
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[#737373] max-w-2xl mx-auto mb-8"
            >
              Help us revolutionize email deliverability. We're building the future of inbox placement for e-commerce brands worldwide.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-6 text-sm text-[#525252]"
            >
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4" />
                <span>Small, focused team</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                <span>Remote-first</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4" />
                <span>High growth</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6 bg-[#ebe7e0]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-3">
              <BriefcaseIcon className="w-3 h-3 mr-1" />
              Open Positions
            </Badge>
            <h2 className="text-2xl font-bold mb-3">Sales Team</h2>
            <p className="text-[#737373] max-w-md mx-auto">
              Join our growing sales team and help e-commerce brands improve their email performance.
            </p>
          </motion.div>

          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedJob === job.id ? 'border-[#22c55e] shadow-md' : 'hover:border-[#171717]'
                  }`}
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#171717] flex items-center justify-center shrink-0">
                          {job.id === 'bdr' ? (
                            <UsersIcon className="w-6 h-6 text-white" />
                          ) : (
                            <TrendingUpIcon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-[#737373]">
                            <span>{job.department}</span>
                            <span className="w-1 h-1 rounded-full bg-[#737373]" />
                            <span>{job.location}</span>
                            <span className="w-1 h-1 rounded-full bg-[#737373]" />
                            <span>{job.type}</span>
                          </div>
                          <div className="mt-2 text-sm font-medium text-[#22c55e]">{job.salary}</div>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: selectedJob === job.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRightIcon className="w-5 h-5 text-[#737373]" />
                      </motion.div>
                    </div>

                    <AnimatePresence>
                      {selectedJob === job.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 mt-6 border-t border-[#e5e0d5]">
                            <p className="text-[#525252] mb-6">{job.description}</p>

                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Responsibilities</h4>
                                <ul className="space-y-2">
                                  {job.responsibilities.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-[#737373]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-1.5 shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-3">Requirements</h4>
                                <ul className="space-y-2">
                                  {job.requirements.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-[#737373]">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] mt-1.5 shrink-0" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-6">
                              <Link href={`mailto:careers@mailtail.com?subject=Application: ${job.title}`}>
                                <Button className="bg-[#171717] hover:bg-[#262626] text-white h-10 px-6 text-sm gap-2">
                                  Apply Now
                                  <ArrowRightIcon className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold mb-3">Why Join MailTail?</h2>
            <p className="text-[#737373] max-w-md mx-auto">
              We offer competitive compensation and benefits to help you do your best work.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ebe7e0] border border-[#e5e0d5] flex items-center justify-center shrink-0">
                  <perk.icon className="w-5 h-5 text-[#171717]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{perk.title}</h3>
                  <p className="text-sm text-[#737373]">{perk.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-gradient-to-br from-[#171717] to-[#262626] rounded-2xl px-8 py-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#22c55e] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#3b82f6] rounded-full blur-3xl" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white mb-3 relative z-10"
          >
            Don't see a role that fits?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#a3a3a3] mb-6 relative z-10"
          >
            We're always looking for talented people. Send us your resume and we'll keep you in mind.
          </motion.p>
          <Link href="mailto:careers@mailtail.com">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block relative z-10"
            >
              <Button className="bg-[#f5f2ed] text-[#171717] hover:bg-[#ebe7e0] h-10 px-6 text-sm gap-2">
                Get in Touch
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e0d5] py-6 px-6">
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
