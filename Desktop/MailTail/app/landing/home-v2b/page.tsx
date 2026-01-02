"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "@/components/ui/globe";
import { OrbitSystem } from "@/components/ui/orbit";
import { FloatingMailCard, SmartFooterCard } from "@/components/ui/floating-elements";
import { GmailInbox } from "@/components/ui/gmail-inbox";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Marquee } from "@/components/ui/marquee";
import { Card3D, Card3DGlow } from "@/components/ui/card-3d";
import { TextGenerateEffect } from "@/components/ui/text-generate";

// Icons
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

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
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

// Data
const stats = [
  { value: "100M+", label: "Emails Sent with MailTail" },
  { value: "200+", label: "Brands Trust Us" },
  { value: "2 min", label: "Setup Time" },
];

const brands = [
  { name: "Urban Threads", category: "Fashion" },
  { name: "Glow Labs", category: "Beauty" },
  { name: "Bloom Supplements", category: "Health" },
  { name: "Peak Fitness", category: "Fitness" },
  { name: "Fresh Pet Co", category: "Pet" },
  { name: "NomNom", category: "Food" },
  { name: "STEEZY", category: "Fashion" },
  { name: "VitalFit", category: "Health" },
  { name: "Bark Box", category: "Pet" },
  { name: "Glow Skin", category: "Beauty" },
];

const testimonials = [
  {
    quote: "Our open rates jumped 35% in the first week. MailTail is now essential to our email strategy.",
    author: "Sarah Chen",
    role: "Head of Marketing",
    company: "Bloom Supplements",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "We were skeptical at first, but the results speak for themselves. More emails in Primary = more revenue.",
    author: "Marcus Johnson",
    role: "E-commerce Director",
    company: "Urban Threads",
    avatar: "MJ",
    rating: 5,
  },
  {
    quote: "Simple setup, immediate results. Our abandoned cart emails finally get opened.",
    author: "Emily Rodriguez",
    role: "Email Marketing Manager",
    company: "Fresh Pet Co",
    avatar: "ER",
    rating: 5,
  },
];

const faqs = [
  {
    question: "How does MailTail improve inbox placement?",
    answer: "MailTail injects invisible, optimized footer content into your email templates. This content mimics patterns that Gmail's algorithm associates with personal, legitimate emails rather than promotional content, helping your emails land in Primary instead of Promotions.",
  },
  {
    question: "Is this against Gmail's Terms of Service?",
    answer: "No. MailTail uses legitimate email content optimization techniques. We don't manipulate headers, spoof senders, or do anything deceptive. We simply add authentic-looking footer content that signals your email is a genuine communication.",
  },
  {
    question: "Will recipients see the footer content?",
    answer: "No. The footer content is completely hidden from recipients using standard HTML/CSS techniques. It's invisible in all email clients while still being read by Gmail's categorization algorithm.",
  },
  {
    question: "How long does it take to see results?",
    answer: "Most customers see improvement within their first email campaign after implementing MailTail. The full effect typically stabilizes after 2-3 email sends as Gmail's algorithm learns your new sending patterns.",
  },
  {
    question: "Does MailTail work with other email platforms besides Klaviyo?",
    answer: "Currently, we're focused on Klaviyo integration. Support for other platforms like Mailchimp, Sendgrid, and others is on our roadmap. Join our waitlist to be notified when your platform is supported.",
  },
];

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Integrations", href: "/integrations" },
    { label: "Changelog", href: "/changelog" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "DMARC Generator", href: "/tools/dmarc-generator" },
    { label: "Domain Health", href: "/tools/domain-health" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Partners", href: "/partners" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export default function HomeV2B() {
  const [showBanner, setShowBanner] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  // Revenue Calculator state
  const [listSize, setListSize] = useState(50000);
  const [currentOpenRate, setCurrentOpenRate] = useState(15);
  const [avgOrderValue, setAvgOrderValue] = useState(75);

  // Calculate potential revenue increase
  const improvedOpenRate = Math.min(currentOpenRate * 1.4, 60);
  const additionalOpens = listSize * ((improvedOpenRate - currentOpenRate) / 100);
  const clickRate = 0.025;
  const conversionRate = 0.02;
  const potentialRevenue = Math.round(additionalOpens * clickRate * conversionRate * avgOrderValue);

  // Inbox Health Check state
  const [checkDomain, setCheckDomain] = useState("");

  // Scroll tracking for floating CTA
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setShowFloatingCTA(latest > 600);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-[#f5f2ed] overflow-hidden">
      {/* Floating CTA */}
      <AnimatePresence>
        {showFloatingCTA && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <Link href="/signup">
              <Button className="h-12 px-6 text-sm gap-2 shadow-lg shadow-black/20 rounded-full bg-[#171717] hover:bg-[#262626]">
                <span className="hidden sm:inline">Start Free Trial</span>
                <span className="sm:hidden">Try Free</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#f5f2ed] shadow-xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold">Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-[#ebe7e0] rounded-lg transition-colors"
                  >
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-4">
                  <Link href="/platform" className="block py-2 text-[#525252] hover:text-[#171717]" onClick={() => setMobileMenuOpen(false)}>
                    Platform
                  </Link>
                  <Link href="/integrations" className="block py-2 text-[#525252] hover:text-[#171717]" onClick={() => setMobileMenuOpen(false)}>
                    Integrations
                  </Link>
                  <Link href="/pricing" className="block py-2 text-[#525252] hover:text-[#171717]" onClick={() => setMobileMenuOpen(false)}>
                    Pricing
                  </Link>
                  <Link href="/tools/dmarc-generator" className="block py-2 text-[#525252] hover:text-[#171717]" onClick={() => setMobileMenuOpen(false)}>
                    DMARC Generator
                  </Link>
                  <Link href="/tools/domain-health" className="block py-2 text-[#525252] hover:text-[#171717]" onClick={() => setMobileMenuOpen(false)}>
                    Domain Health
                  </Link>
                  <div className="pt-4 border-t border-[#e5e0d5] space-y-3">
                    <Link href="/login" className="block py-2 text-[#525252] hover:text-[#171717]" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-[#171717] hover:bg-[#262626] text-white">
                        Start Free Trial
                      </Button>
                    </Link>
                  </div>
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-[#f5f2ed]/80 backdrop-blur-lg border-b border-[#e5e0d5]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center"
                >
                  <MailIcon className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-lg font-bold tracking-tight">mailtail</span>
              </Link>

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

                <Link href="/pricing" className="text-sm text-[#525252] hover:text-[#171717] px-3 py-2 transition-colors">
                  Pricing
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block text-sm text-[#525252] hover:text-[#171717] px-3 py-2">
                Log in
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button className="bg-[#171717] hover:bg-[#262626] text-white h-10 px-5 text-sm rounded-full">
                  Start Free Trial
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 hover:bg-[#ebe7e0] rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
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
            className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-center relative">
              <Link href="/blog/deliverability-report" className="flex items-center gap-2 text-sm hover:underline text-center">
                <span className="hidden sm:inline">New: See how brands improved open rates by 40% in our case study</span>
                <span className="sm:hidden">40% open rate improvement</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-4 sm:right-6 p-1 hover:bg-white/10 rounded transition-colors"
                aria-label="Dismiss banner"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Background Beams */}
      <section className="relative pt-12 sm:pt-16 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5f2ed] via-[#f5f2ed] to-[#ebe7e0]" />
        <BackgroundBeams className="opacity-30" />

        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#22c55e]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ebe7e0] text-xs font-medium text-[#525252] mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                Works with Klaviyo
              </motion.div>

              {/* Animated headline */}
              <motion.div variants={fadeInUp} className="mb-4">
                <TextGenerateEffect
                  words="Get 40% More Opens by Landing in Primary"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]"
                />
              </motion.div>

              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-[#737373] max-w-md mb-8"
              >
                Join 200+ e-commerce brands who've boosted open rates by moving emails from Promotions to Primary. 2-minute setup.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-3 mb-8"
              >
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full sm:w-auto h-12 px-8 text-sm gap-2 rounded-full shadow-lg shadow-[#171717]/20">
                      Start Free Trial
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/demo">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-sm rounded-full">
                      Watch Demo
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4 text-xs text-[#737373]"
              >
                {["No credit card required", "2 min setup", "Cancel anytime"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckIcon className="w-3 h-3 text-[#22c55e]" />
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-3 mt-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#e5e0d5] text-xs shadow-sm">
                  <ShieldIcon className="w-4 h-4 text-[#22c55e]" />
                  <span className="font-medium text-[#525252]">100% TOS Compliant</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#e5e0d5] text-xs shadow-sm">
                  <svg className="w-4 h-4 text-[#3b82f6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span className="font-medium text-[#525252]">One-click revert</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-[#e5e0d5] text-xs shadow-sm">
                  <InboxIcon className="w-4 h-4 text-[#f59e0b]" />
                  <span className="font-medium text-[#525252]">ISP Friendly</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Globe + Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative">
                <Globe size={400} dark={false} className="opacity-90" />
                <div className="absolute top-8 -right-8 hidden sm:block">
                  <FloatingMailCard />
                </div>
                <div className="absolute -bottom-4 -left-8 hidden sm:block">
                  <SmartFooterCard />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof - Stats + Marquee */}
      <section className="py-12 px-4 sm:px-6 border-y border-[#e5e0d5] bg-[#ebe7e0]">
        <div className="max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:gap-8 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-bold text-[#171717] mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-[#737373]">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Logo Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-center text-xs text-[#a3a3a3] uppercase tracking-wider mb-6">
              Trusted by 200+ e-commerce brands
            </p>
            <Marquee speed="slow" pauseOnHover className="py-2">
              {brands.map((brand) => (
                <div
                  key={brand.name}
                  className="flex items-center gap-2 mx-6 px-4 py-2 bg-white rounded-full border border-[#e5e0d5] shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-[#171717] flex items-center justify-center text-[8px] font-bold text-white">
                    {brand.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-[#525252] whitespace-nowrap">{brand.name}</span>
                  <span className="text-[10px] text-[#a3a3a3] uppercase">{brand.category}</span>
                </div>
              ))}
            </Marquee>
          </motion.div>
        </div>
      </section>

      {/* Gmail Inbox Demo Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <Badge variant="secondary" className="mb-3">
              <InboxIcon className="w-3 h-3 mr-1" />
              See The Difference
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">From Promotions to Primary</h2>
            <p className="text-[#737373] max-w-lg mx-auto">
              Your marketing emails deserve to be seen. MailTail helps move your emails where they actually get opened.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <GmailInbox className="w-full max-w-3xl" />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#ebe7e0]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">How MailTail Works</h2>
            <p className="text-[#737373] max-w-md mx-auto">
              Three simple steps to land in Primary
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12">
            {/* Orbit visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center order-2 lg:order-1"
            >
              <OrbitSystem
                centerIcon={
                  <div className="w-16 h-16 rounded-2xl bg-[#171717] flex items-center justify-center shadow-lg">
                    <MailIcon className="w-8 h-8 text-white" />
                  </div>
                }
                orbits={[
                  { size: 160, duration: 12, icon: <InboxIcon className="w-4 h-4 text-[#22c55e]" />, iconSize: 36 },
                  { size: 240, duration: 18, reverse: true, dashed: true, icon: <ZapIcon className="w-4 h-4 text-[#f59e0b]" />, iconSize: 36 },
                  { size: 320, duration: 25, icon: <GlobeIcon className="w-4 h-4 text-[#3b82f6]" />, iconSize: 36 },
                ]}
              />
            </motion.div>

            {/* Steps */}
            <div className="space-y-4 order-1 lg:order-2">
              {[
                {
                  step: "1",
                  title: "Connect Klaviyo",
                  desc: "Link your Klaviyo account with a simple API key. Takes less than 2 minutes.",
                  icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
                  color: "#22c55e"
                },
                {
                  step: "2",
                  title: "Select Templates",
                  desc: "Browse and choose which email templates you want to optimize for Primary inbox.",
                  icon: <ZapIcon className="w-5 h-5" />,
                  color: "#f59e0b"
                },
                {
                  step: "3",
                  title: "Auto-Optimize",
                  desc: "We inject invisible footer content that signals authenticity to Gmail's algorithm.",
                  icon: <InboxIcon className="w-5 h-5" />,
                  color: "#3b82f6"
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <Card3DGlow className="rounded-xl">
                    <div className="flex gap-4 p-4 rounded-xl bg-white shadow-sm transition-all">
                      <div className="relative shrink-0">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.icon}
                        </div>
                        <div
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center text-[10px] font-bold"
                          style={{ borderColor: item.color, color: item.color }}
                        >
                          {item.step}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-[#737373] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </Card3DGlow>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Guarantee banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#22c55e]/5 via-white to-[#22c55e]/5 border border-[#22c55e]/20 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#22c55e] flex items-center justify-center shrink-0 shadow-lg shadow-[#22c55e]/20">
              <ShieldIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-1">Zero Risk Guarantee</h4>
              <p className="text-sm text-[#737373]">
                One-click uninstall. Your email templates return to their original state instantly. No strings attached.
              </p>
            </div>
            <div className="sm:ml-auto shrink-0">
              <div className="flex items-center gap-2 text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 px-3 py-2 rounded-full">
                <CheckIcon className="w-4 h-4" />
                100% Safe
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3D Testimonials */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Loved by E-commerce Teams</h2>
            <p className="text-[#737373] max-w-md mx-auto">
              See what marketing teams are saying about MailTail
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card3D containerClassName="h-full">
                  <Card className="h-full bg-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 text-[#f59e0b]" />
                        ))}
                      </div>
                      <QuoteIcon className="w-8 h-8 text-[#22c55e]/20 mb-4" />
                      <p className="text-sm text-[#525252] mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#171717] to-[#525252] flex items-center justify-center text-white text-xs font-medium">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{testimonial.author}</div>
                          <div className="text-xs text-[#737373]">{testimonial.role}, {testimonial.company}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Card3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Calculator with Custom Sliders */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#ebe7e0]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <Badge variant="secondary" className="mb-3">
              <ZapIcon className="w-3 h-3 mr-1" />
              Revenue Calculator
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Calculate Your Potential Revenue</h2>
            <p className="text-[#737373] max-w-lg mx-auto">
              See how much more revenue you could generate by landing in Primary
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  {/* Sliders */}
                  <div className="p-6 sm:p-8 space-y-8">
                    {/* List Size */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-medium text-[#525252]">Email List Size</label>
                        <span className="text-sm font-bold text-[#171717] bg-[#f5f2ed] px-2 py-1 rounded">{listSize.toLocaleString()}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="1000"
                          max="500000"
                          step="1000"
                          value={listSize}
                          onChange={(e) => setListSize(Number(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer slider-custom"
                          style={{
                            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${((listSize - 1000) / (500000 - 1000)) * 100}%, #e5e0d5 ${((listSize - 1000) / (500000 - 1000)) * 100}%, #e5e0d5 100%)`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#a3a3a3] mt-2">
                        <span>1K</span>
                        <span>500K</span>
                      </div>
                    </div>

                    {/* Open Rate */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-medium text-[#525252]">Current Open Rate</label>
                        <span className="text-sm font-bold text-[#171717] bg-[#f5f2ed] px-2 py-1 rounded">{currentOpenRate}%</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="5"
                          max="40"
                          step="1"
                          value={currentOpenRate}
                          onChange={(e) => setCurrentOpenRate(Number(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((currentOpenRate - 5) / (40 - 5)) * 100}%, #e5e0d5 ${((currentOpenRate - 5) / (40 - 5)) * 100}%, #e5e0d5 100%)`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#a3a3a3] mt-2">
                        <span>5%</span>
                        <span>40%</span>
                      </div>
                    </div>

                    {/* AOV */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-sm font-medium text-[#525252]">Average Order Value</label>
                        <span className="text-sm font-bold text-[#171717] bg-[#f5f2ed] px-2 py-1 rounded">${avgOrderValue}</span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="20"
                          max="500"
                          step="5"
                          value={avgOrderValue}
                          onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((avgOrderValue - 20) / (500 - 20)) * 100}%, #e5e0d5 ${((avgOrderValue - 20) / (500 - 20)) * 100}%, #e5e0d5 100%)`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[#a3a3a3] mt-2">
                        <span>$20</span>
                        <span>$500</span>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="bg-gradient-to-br from-[#22c55e] to-[#16a34a] p-6 sm:p-8 flex flex-col justify-center text-white">
                    <p className="text-sm opacity-90 mb-2 text-center">Potential Monthly Revenue Increase</p>
                    <motion.p
                      key={potentialRevenue}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl sm:text-6xl font-bold mb-6 text-center"
                    >
                      ${potentialRevenue.toLocaleString()}
                    </motion.p>
                    <div className="flex items-center justify-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{currentOpenRate}%</div>
                        <div className="text-xs opacity-75">Current</div>
                      </div>
                      <ArrowRightIcon className="w-5 h-5 opacity-75" />
                      <div className="text-center">
                        <div className="text-2xl font-bold">{improvedOpenRate.toFixed(1)}%</div>
                        <div className="text-xs opacity-75">With MailTail</div>
                      </div>
                    </div>
                    <p className="text-xs opacity-75 text-center mt-6">
                      *Estimate based on industry averages
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-[#737373]">
              Everything you need to know about MailTail
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card3DGlow className="rounded-xl">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full bg-white rounded-xl p-4 sm:p-5 text-left transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-medium text-sm sm:text-base pr-4">{faq.question}</h3>
                      <div className="shrink-0 w-6 h-6 rounded-full bg-[#f5f2ed] flex items-center justify-center">
                        {openFaq === i ? (
                          <MinusIcon className="w-3 h-3 text-[#525252]" />
                        ) : (
                          <PlusIcon className="w-3 h-3 text-[#525252]" />
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-[#737373] mt-3 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </Card3DGlow>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section id="tools" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#ebe7e0] scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="secondary" className="mb-3">
              <WrenchIcon className="w-3 h-3 mr-1" />
              Free Tools
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Email Deliverability Tools</h2>
            <p className="text-[#737373] max-w-md mx-auto">
              Free tools to improve your email authentication and deliverability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { href: "/tools/dmarc-generator", icon: ShieldIcon, title: "DMARC Generator", desc: "Create a DMARC policy to protect against spoofing.", cta: "Generate record" },
              { href: "/tools/domain-health", icon: SearchIcon, title: "Domain Health Check", desc: "Analyze DMARC, SPF, and DKIM configuration.", cta: "Check domain" },
            ].map((tool, i) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={tool.href} className="group block">
                  <Card3DGlow className="rounded-xl h-full">
                    <Card className="h-full transition-all group-hover:shadow-lg border-transparent group-hover:border-[#22c55e]">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-[#171717] flex items-center justify-center shrink-0">
                            <tool.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold mb-1 group-hover:text-[#22c55e] transition-colors">{tool.title}</h3>
                            <p className="text-sm text-[#737373] mb-3">{tool.desc}</p>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#22c55e]">
                              {tool.cta}
                              <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Card3DGlow>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Inbox Health Check */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 sm:p-8">
                    <Badge variant="secondary" className="mb-3">
                      <SearchIcon className="w-3 h-3 mr-1" />
                      Free Check
                    </Badge>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3">
                      Are your emails landing in Promotions?
                    </h3>
                    <p className="text-sm text-[#737373] mb-4">
                      Not ready to commit? Enter your domain to get a free inbox placement analysis.
                    </p>
                    <ul className="space-y-2 text-sm text-[#525252]">
                      {["Check inbox placement status", "Get actionable recommendations", "No signup required"].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <CheckIcon className="w-4 h-4 text-[#22c55e]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-[#f5f2ed] to-[#ebe7e0] p-6 sm:p-8 flex flex-col justify-center">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (checkDomain) {
                          window.location.href = `/tools/domain-health?domain=${encodeURIComponent(checkDomain)}`;
                        }
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label htmlFor="check-domain" className="block text-sm font-medium text-[#525252] mb-2">
                          Your domain
                        </label>
                        <input
                          id="check-domain"
                          type="text"
                          placeholder="example.com"
                          value={checkDomain}
                          onChange={(e) => setCheckDomain(e.target.value)}
                          className="w-full h-12 px-4 rounded-xl border border-[#e5e0d5] bg-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent text-sm"
                        />
                      </div>
                      <Button type="submit" className="w-full h-12 gap-2 rounded-xl">
                        Check My Domain
                        <ArrowRightIcon className="w-4 h-4" />
                      </Button>
                      <p className="text-xs text-[#a3a3a3] text-center">
                        Results delivered instantly. No email required.
                      </p>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#ebe7e0]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-gradient-to-br from-[#171717] to-[#262626] rounded-3xl px-6 sm:px-8 py-12 sm:py-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#22c55e] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#22c55e] rounded-full blur-3xl" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-white mb-3 relative z-10"
          >
            Ready to land in Primary?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#a3a3a3] mb-8 relative z-10"
          >
            Join 200+ brands using MailTail to improve their inbox placement.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center relative z-10"
          >
            <Link href="/signup">
              <Button className="w-full sm:w-auto bg-[#22c55e] hover:bg-[#16a34a] text-white h-12 px-8 text-sm gap-2 rounded-full">
                Start Free Trial
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-sm border-white/20 text-white hover:bg-white/10 rounded-full">
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e0d5] py-12 sm:py-16 px-4 sm:px-6 bg-[#f5f2ed]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#171717] flex items-center justify-center">
                  <MailIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">mailtail</span>
              </Link>
              <p className="text-sm text-[#737373] mb-4">
                Improve your email deliverability and land in Primary.
              </p>
              <div className="flex gap-3">
                <a href="https://twitter.com/mailtail" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#ebe7e0] flex items-center justify-center hover:bg-[#171717] hover:text-white transition-colors text-[#525252]">
                  <TwitterIcon className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com/company/mailtail" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#ebe7e0] flex items-center justify-center hover:bg-[#171717] hover:text-white transition-colors text-[#525252]">
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#737373] hover:text-[#171717] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#737373] hover:text-[#171717] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#737373] hover:text-[#171717] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#737373] hover:text-[#171717] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#e5e0d5] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[#a3a3a3]">
              © {new Date().getFullYear()} MailTail. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-[#a3a3a3]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Slider Styles */}
      <style jsx global>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #171717;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.15s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 2px solid #171717;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}
