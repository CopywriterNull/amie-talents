"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
import { FloatingMailCard, SmartFooterCard, FloatingCard } from "@/components/ui/floating-elements";

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

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

export default function HomeV3() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f0f0f0]"
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between h-14 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-7 h-7 rounded-lg bg-[#171717] flex items-center justify-center"
              >
                <MailIcon className="w-3.5 h-3.5 text-white" />
              </motion.div>
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
                    <Link href="/tools/domain-health" className="flex items-start gap-3 cursor-pointer">
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
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs text-[#737373] h-8">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="sm" className="text-xs h-8 px-3">
                    Get Started
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero - Centered with floating elements around */}
      <section className="relative pt-28 pb-20 px-6 min-h-[90vh] flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#22c55e]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-3xl" />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `
                linear-gradient(#171717 1px, transparent 1px),
                linear-gradient(90deg, #171717 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="text-center relative">
            {/* Floating elements around the hero */}
            <div className="hidden lg:block">
              {/* Top left floating card */}
              <FloatingCard
                className="absolute -left-8 top-0"
                delay={0.2}
                duration={5}
                y={10}
                rotate={3}
              >
                <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-lg p-3 w-44">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#22c55e]/10 flex items-center justify-center">
                      <TrendingUpIcon className="w-3 h-3 text-[#22c55e]" />
                    </div>
                    <span className="text-[10px] font-medium">Delivery Rate</span>
                  </div>
                  <div className="text-xl font-bold text-[#22c55e]">98.7%</div>
                  <div className="text-[9px] text-[#a3a3a3]">+12% from last month</div>
                </div>
              </FloatingCard>

              {/* Top right floating card */}
              <FloatingCard
                className="absolute -right-4 top-8"
                delay={0.4}
                duration={4.5}
                y={8}
                rotate={2}
              >
                <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-lg p-3 w-40">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md bg-[#3b82f6]/10 flex items-center justify-center">
                      <UsersIcon className="w-3 h-3 text-[#3b82f6]" />
                    </div>
                    <span className="text-[10px] font-medium">Reach</span>
                  </div>
                  <div className="text-xl font-bold">2.4M</div>
                  <div className="text-[9px] text-[#a3a3a3]">emails optimized</div>
                </div>
              </FloatingCard>

              {/* Bottom left - Smart Footer Card */}
              <div className="absolute -left-12 bottom-12">
                <SmartFooterCard />
              </div>

              {/* Bottom right - Floating Mail Card */}
              <div className="absolute -right-16 bottom-4">
                <FloatingMailCard />
              </div>
            </div>

            {/* Main content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="max-w-2xl mx-auto"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f5f5f5] text-xs font-medium text-[#525252] mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                Trusted by 500+ brands
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5"
              >
                Your emails deserve
                <br />
                <span className="bg-gradient-to-r from-[#22c55e] to-[#16a34a] bg-clip-text text-transparent">
                  the Primary inbox
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg text-[#737373] max-w-lg mx-auto mb-8"
              >
                Stop losing opens to the Promotions tab. MailTail adds invisible optimization to your Klaviyo emails.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row justify-center gap-3 mb-8"
              >
                <Link href="/signup">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full sm:w-auto h-11 px-6 text-sm gap-2 shadow-lg shadow-[#22c55e]/20">
                      Start Free Trial
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full sm:w-auto h-11 px-6 text-sm">
                      Log in
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap justify-center gap-6 text-xs text-[#a3a3a3]"
              >
                {[
                  { label: "No credit card", icon: "💳" },
                  { label: "2 min setup", icon: "⚡" },
                  { label: "Cancel anytime", icon: "✨" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="py-20 px-6 bg-[#fafafa] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex justify-center relative"
            >
              <Globe size={380} dark={false} className="opacity-90" />

              {/* Floating connection lines */}
              <motion.div
                className="absolute top-1/4 left-0 w-20 h-px bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent"
                animate={{ opacity: [0.3, 1, 0.3], x: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/3 right-0 w-24 h-px bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent"
                animate={{ opacity: [0.3, 1, 0.3], x: [10, -10, 10] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              />
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Global Reach
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Deliver emails worldwide
              </h2>
              <p className="text-[#737373] mb-6">
                MailTail optimizes your emails for Gmail's algorithms globally. Whether your subscribers are in New York, London, or Tokyo, your emails land in Primary.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "40%", label: "Better inbox placement" },
                  { value: "2.4M", label: "Emails optimized" },
                  { value: "500+", label: "Brands trust us" },
                  { value: "99.9%", label: "Uptime guaranteed" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg border border-[#e5e5e5] p-4"
                  >
                    <div className="text-2xl font-bold text-[#22c55e]">{stat.value}</div>
                    <div className="text-xs text-[#737373]">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-12"
          >
            How it works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", title: "Connect", desc: "Link your Klaviyo account", icon: "🔗" },
              { step: "2", title: "Process", desc: "Select template to optimize", icon: "⚡" },
              { step: "3", title: "Done", desc: "Use your enhanced template", icon: "✅" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-xl border border-[#e5e5e5] p-5 text-center transition-shadow"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                  className="text-2xl mb-3"
                >
                  {item.icon}
                </motion.div>
                <div className="text-xs font-medium text-[#a3a3a3] mb-1">Step {item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-[#737373]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
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
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#f0fdf4] flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-[#22c55e]" />
                    </div>
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl border border-[#e5e5e5] p-6 shadow-sm">
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
                  <div className="h-3 bg-[#f5f5f5] rounded-full w-full" />
                  <div className="h-3 bg-[#f5f5f5] rounded-full w-4/5" />
                  <div className="h-12 bg-[#f5f5f5] rounded-lg w-full" />
                </div>
                <div className="mt-4 pt-4 border-t border-dashed border-[#e5e5e5]">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ZapIcon className="w-3.5 h-3.5 text-[#22c55e]" />
                    </motion.div>
                    <span className="text-xs text-[#22c55e] font-medium">Footer injected</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free Tools */}
      <section id="tools" className="py-20 px-6 scroll-mt-16">
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
            <h2 className="text-2xl font-bold mb-2">Email Deliverability Tools</h2>
            <p className="text-[#737373] max-w-md mx-auto">
              Free tools to improve your email authentication and deliverability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                href: "/tools/dmarc-generator",
                icon: ShieldIcon,
                title: "DMARC Generator",
                desc: "Create a DMARC policy to protect against spoofing.",
                cta: "Generate record",
              },
              {
                href: "/tools/domain-health",
                icon: SearchIcon,
                title: "Domain Health Check",
                desc: "Analyze DMARC, SPF, and DKIM configuration.",
                cta: "Check domain",
              },
            ].map((tool, i) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={tool.href} className="group block">
                  <Card className="h-full transition-all group-hover:shadow-md group-hover:border-[#22c55e]">
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
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-[#171717] rounded-2xl px-8 py-12 relative overflow-hidden"
        >
          {/* Decorative */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#22c55e] rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-[#22c55e] rounded-full blur-2xl" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-3 relative z-10">
            Ready to land in Primary?
          </h2>
          <p className="text-[#a3a3a3] mb-6 relative z-10">
            Join brands using MailTail to improve their inbox placement.
          </p>
          <Link href="/signup">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block relative z-10"
            >
              <Button className="bg-white text-[#171717] hover:bg-[#f5f5f5] h-10 px-6 text-sm gap-2">
                Get Started Free
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
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
