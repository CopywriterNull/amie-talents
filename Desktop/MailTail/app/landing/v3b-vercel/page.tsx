'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, ChevronRight, Triangle } from "lucide-react";

export default function LandingV3BVercel() {
  const [listSize, setListSize] = useState(10000);
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(4);
  const [revenuePerClick, setRevenuePerClick] = useState(3);
  const [clickThroughRate, setClickThroughRate] = useState(20);

  const currentOpenRate = 0.22;
  const improvedOpenRate = 0.58;
  const ctr = clickThroughRate / 100;

  const additionalOpens = Math.round(listSize * improvedOpenRate) - Math.round(listSize * currentOpenRate);
  const additionalClicks = Math.round(Math.round(listSize * improvedOpenRate) * ctr) - Math.round(Math.round(listSize * currentOpenRate) * ctr);
  const additionalRevenuePerCampaign = additionalClicks * revenuePerClick;
  const monthlyAdditionalRevenue = additionalRevenuePerCampaign * campaignsPerMonth;
  const yearlyAdditionalRevenue = monthlyAdditionalRevenue * 12;

  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (num: number) => `$${num.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Subtle gradient accent */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Triangle className="w-6 h-6 fill-white" />
              <span className="font-semibold tracking-tight">MailTail</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {["Calculator", "Features", "Tools"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/[0.05]">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-md h-9 px-4 font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] mb-8">
              <span className="text-xs text-white/50 font-mono">WORKS_WITH</span>
              <span className="text-xs text-white font-medium">Klaviyo</span>
            </div>

            <h1 className="text-5xl md:text-[72px] font-bold tracking-tight leading-[1.05] mb-6">
              Land in Primary.
              <br />
              <span className="text-white/40">Not Promotions.</span>
            </h1>

            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
              Invisible optimization that helps your Klaviyo emails bypass Gmail&apos;s Promotions filter.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mb-16">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 h-12 px-8 font-medium">
                  Deploy Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#calculator">
                <Button size="lg" variant="outline" className="border-white/[0.15] text-white hover:bg-white/[0.05] h-12 px-8">
                  Calculate ROI
                </Button>
              </Link>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-px bg-white/[0.08] rounded-lg overflow-hidden">
              {[
                { value: "40%", label: "Better Placement" },
                { value: "164%", label: "More Opens" },
                { value: "2m", label: "Setup Time" },
              ].map((stat) => (
                <div key={stat.label} className="bg-black p-6 text-center">
                  <div className="text-3xl font-bold font-mono mb-1">{stat.value}</div>
                  <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-24 px-6 border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-2 gap-px bg-white/[0.08]">
            <div className="bg-black p-12">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Promotions</span>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-baseline border-b border-white/[0.08] pb-4">
                  <span className="text-white/50">Open Rate</span>
                  <span className="text-2xl font-mono">22%</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/[0.08] pb-4">
                  <span className="text-white/50">Push Notification</span>
                  <span className="text-sm text-white/30">None</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/50">Visibility</span>
                  <span className="text-sm text-white/30">Buried</span>
                </div>
              </div>
            </div>
            <div className="bg-black p-12">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Primary</span>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-baseline border-b border-white/[0.08] pb-4">
                  <span className="text-white/50">Open Rate</span>
                  <span className="text-2xl font-mono text-green-400">58%</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/[0.08] pb-4">
                  <span className="text-white/50">Push Notification</span>
                  <span className="text-sm text-green-400">Instant</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-white/50">Visibility</span>
                  <span className="text-sm text-green-400">Top of inbox</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-24 px-6 border-t border-white/[0.08]">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Revenue Calculator</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Calculate recovered revenue</h2>
            <p className="text-white/50">Input your metrics to see potential gains</p>
          </div>

          <div className="border border-white/[0.08] rounded-lg overflow-hidden">
            {/* Inputs */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08]">
              {[
                { label: "List Size", value: listSize, setValue: setListSize, max: 100000, step: 1000, prefix: "" },
                { label: "Campaigns/mo", value: campaignsPerMonth, setValue: setCampaignsPerMonth, max: 30, step: 1, prefix: "" },
                { label: "CTR %", value: clickThroughRate, setValue: setClickThroughRate, max: 50, step: 1, prefix: "" },
                { label: "Rev/Click", value: revenuePerClick, setValue: setRevenuePerClick, max: 50, step: 1, prefix: "$" },
              ].map((input) => (
                <div key={input.label} className="bg-black p-6">
                  <Label className="text-xs font-mono text-white/40 uppercase tracking-wider">{input.label}</Label>
                  <div className="mt-3">
                    <Input
                      type="number"
                      value={input.value}
                      onChange={(e) => input.setValue(Math.max(1, Number(e.target.value) || 1))}
                      className="h-12 bg-transparent border-white/[0.08] text-white text-xl font-mono focus:border-white/20 rounded-none"
                    />
                  </div>
                  <Slider
                    value={[input.value]}
                    onValueChange={(value) => input.setValue(value[0])}
                    min={1}
                    max={input.max}
                    step={input.step}
                    className="mt-4 [&_[data-slot=slider-track]]:bg-white/[0.08] [&_[data-slot=slider-track]]:h-[2px] [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:w-3 [&_[data-slot=slider-thumb]]:h-3 [&_[data-slot=slider-thumb]]:border-0 [&_[data-slot=slider-thumb]]:bg-white"
                  />
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="grid sm:grid-cols-3 gap-px bg-white/[0.08] border-t border-white/[0.08]">
              <div className="bg-black p-6">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Per Campaign</span>
                <div className="text-2xl font-mono mt-2">+{formatNumber(additionalOpens)}</div>
                <div className="text-sm text-white/40">opens</div>
              </div>
              <div className="bg-black p-6">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Per Campaign</span>
                <div className="text-2xl font-mono mt-2">+{formatNumber(additionalClicks)}</div>
                <div className="text-sm text-white/40">clicks</div>
              </div>
              <div className="bg-black p-6">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Per Campaign</span>
                <div className="text-2xl font-mono mt-2 text-green-400">+{formatCurrency(additionalRevenuePerCampaign)}</div>
                <div className="text-sm text-white/40">revenue</div>
              </div>
            </div>

            {/* Total */}
            <div className="grid sm:grid-cols-2 gap-px bg-white/[0.08] border-t border-white/[0.08]">
              <div className="bg-white/[0.02] p-8">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Monthly Revenue</span>
                <div className="text-4xl font-bold font-mono mt-2 text-green-400">{formatCurrency(monthlyAdditionalRevenue)}</div>
                <div className="text-sm text-white/40 mt-1">{campaignsPerMonth} campaigns × {formatCurrency(additionalRevenuePerCampaign)}</div>
              </div>
              <div className="bg-white/[0.02] p-8">
                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Yearly Revenue</span>
                <div className="text-4xl font-bold font-mono mt-2">{formatCurrency(yearlyAdditionalRevenue)}</div>
                <div className="text-sm text-white/40 mt-1">projected annually</div>
              </div>
            </div>

            {/* CTA */}
            <div className="p-6 bg-white/[0.02] border-t border-white/[0.08]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-white/40">Based on 22% → 58% open rate improvement</p>
                <Link href="/signup">
                  <Button className="bg-white text-black hover:bg-white/90 h-10 px-6 font-medium">
                    Start Recovering Revenue
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Process</span>
            <h2 className="text-4xl font-bold mt-4">How it works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/[0.08] rounded-lg overflow-hidden">
            {[
              { num: "01", title: "Connect", desc: "Link your Klaviyo account with an API key" },
              { num: "02", title: "Process", desc: "Select templates for invisible optimization" },
              { num: "03", title: "Deploy", desc: "Use enhanced templates, land in Primary" },
            ].map((step) => (
              <div key={step.num} className="bg-black p-10">
                <span className="text-xs font-mono text-white/20">{step.num}</span>
                <h3 className="text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                <p className="text-white/50">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/[0.08]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Start recovering revenue</h2>
          <p className="text-white/50 mb-8">Deploy in 2 minutes. No credit card required.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 h-12 px-8 font-medium">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Triangle className="w-5 h-5 fill-white" />
            <span className="font-medium">MailTail</span>
          </div>
          <span className="text-sm text-white/40 font-mono">© 2024</span>
        </div>
      </footer>
    </div>
  );
}
