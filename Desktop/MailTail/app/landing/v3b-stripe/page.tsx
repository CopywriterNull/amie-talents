'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Shield, Zap, Check, TrendingUp, DollarSign, MousePointerClick, Eye, Sparkles, ChevronRight } from "lucide-react";

export default function LandingV3BStripe() {
  const [listSize, setListSize] = useState(10000);
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(4);
  const [revenuePerClick, setRevenuePerClick] = useState(3);
  const [clickThroughRate, setClickThroughRate] = useState(20);

  const currentOpenRate = 0.22;
  const improvedOpenRate = 0.58;
  const ctr = clickThroughRate / 100;

  const currentOpens = Math.round(listSize * currentOpenRate);
  const improvedOpens = Math.round(listSize * improvedOpenRate);
  const additionalOpens = improvedOpens - currentOpens;

  const currentClicks = Math.round(currentOpens * ctr);
  const improvedClicks = Math.round(improvedOpens * ctr);
  const additionalClicks = improvedClicks - currentClicks;

  const additionalRevenuePerCampaign = additionalClicks * revenuePerClick;
  const monthlyAdditionalRevenue = additionalRevenuePerCampaign * campaignsPerMonth;
  const yearlyAdditionalRevenue = monthlyAdditionalRevenue * 12;

  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (num: number) => `$${num.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c3aed] opacity-30 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#2563eb] opacity-25 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] rounded-full bg-[#0ea5e9] opacity-20 blur-[120px]" />
        <div className="absolute top-[60%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#ec4899] opacity-15 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">MailTail</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#calculator" className="text-sm text-white/60 hover:text-white transition-colors">Calculator</Link>
              <Link href="#features" className="text-sm text-white/60 hover:text-white transition-colors">Features</Link>
              <Link href="/tools/dmarc-generator" className="text-sm text-white/60 hover:text-white transition-colors">Tools</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 rounded-full px-5">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/70">Integrated with Klaviyo</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Stop losing revenue to the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                Promotions tab
              </span>
            </h1>

            <p className="text-xl text-white/50 mb-10 leading-relaxed max-w-2xl">
              Every email that lands in Promotions instead of Primary costs you opens, clicks, and revenue. MailTail fixes that with invisible optimization.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white border-0 h-12 px-8 rounded-full shadow-lg shadow-violet-500/25">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="#calculator">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 px-8 rounded-full">
                  Calculate Your ROI
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: "40%+", label: "Better placement" },
                { value: "3x", label: "More clicks" },
                { value: "2 min", label: "Setup time" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{stat.value}</div>
                    <div className="text-sm text-white/40">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-1 backdrop-blur-sm">
            <div className="rounded-[20px] bg-[#0f0f18] p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 mb-4">Without MailTail</Badge>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/60">Open Rate</span>
                      <span className="text-xl font-bold text-red-400">22%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/60">Inbox Placement</span>
                      <span className="text-sm text-red-400">Promotions Tab</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/60">Mobile Notification</span>
                      <span className="text-sm text-red-400">None</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 mb-4">With MailTail</Badge>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <span className="text-white/60">Open Rate</span>
                      <span className="text-xl font-bold text-green-400">58%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <span className="text-white/60">Inbox Placement</span>
                      <span className="text-sm text-green-400">Primary Inbox</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <span className="text-white/60">Mobile Notification</span>
                      <span className="text-sm text-green-400">Instant Push</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-white/5 text-white/70 border-white/10 mb-4">
              Revenue Calculator
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Calculate your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                recovered revenue
              </span>
            </h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              See exactly how much you&apos;re leaving on the table
            </p>
          </div>

          <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-1 backdrop-blur-sm">
            <div className="rounded-[20px] bg-[#0f0f18] overflow-hidden">
              <div className="grid lg:grid-cols-5">
                {/* Inputs */}
                <div className="lg:col-span-3 p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm text-white/60">Email list size</Label>
                      <Input
                        type="number"
                        value={listSize}
                        onChange={(e) => setListSize(Math.max(1000, Number(e.target.value) || 1000))}
                        className="h-12 bg-white/5 border-white/10 text-white text-lg font-medium rounded-xl"
                      />
                      <Slider
                        value={[listSize]}
                        onValueChange={(value) => setListSize(value[0])}
                        min={1000}
                        max={100000}
                        step={1000}
                        className="[&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-violet-500 [&_[data-slot=slider-range]]:to-fuchsia-500 [&_[data-slot=slider-thumb]]:border-violet-500 [&_[data-slot=slider-thumb]]:bg-white"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm text-white/60">Campaigns / month</Label>
                      <Input
                        type="number"
                        value={campaignsPerMonth}
                        onChange={(e) => setCampaignsPerMonth(Math.max(1, Number(e.target.value) || 1))}
                        className="h-12 bg-white/5 border-white/10 text-white text-lg font-medium rounded-xl"
                      />
                      <Slider
                        value={[campaignsPerMonth]}
                        onValueChange={(value) => setCampaignsPerMonth(value[0])}
                        min={1}
                        max={30}
                        step={1}
                        className="[&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-violet-500 [&_[data-slot=slider-range]]:to-fuchsia-500 [&_[data-slot=slider-thumb]]:border-violet-500 [&_[data-slot=slider-thumb]]:bg-white"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm text-white/60">Click-through rate (%)</Label>
                      <Input
                        type="number"
                        value={clickThroughRate}
                        onChange={(e) => setClickThroughRate(Math.max(1, Number(e.target.value) || 1))}
                        className="h-12 bg-white/5 border-white/10 text-white text-lg font-medium rounded-xl"
                      />
                      <Slider
                        value={[clickThroughRate]}
                        onValueChange={(value) => setClickThroughRate(value[0])}
                        min={1}
                        max={50}
                        step={1}
                        className="[&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-violet-500 [&_[data-slot=slider-range]]:to-fuchsia-500 [&_[data-slot=slider-thumb]]:border-violet-500 [&_[data-slot=slider-thumb]]:bg-white"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm text-white/60">Revenue per click ($)</Label>
                      <Input
                        type="number"
                        value={revenuePerClick}
                        onChange={(e) => setRevenuePerClick(Math.max(1, Number(e.target.value) || 1))}
                        className="h-12 bg-white/5 border-white/10 text-white text-lg font-medium rounded-xl"
                      />
                      <Slider
                        value={[revenuePerClick]}
                        onValueChange={(value) => setRevenuePerClick(value[0])}
                        min={1}
                        max={50}
                        step={1}
                        className="[&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-violet-500 [&_[data-slot=slider-range]]:to-fuchsia-500 [&_[data-slot=slider-thumb]]:border-violet-500 [&_[data-slot=slider-thumb]]:bg-white"
                      />
                    </div>
                  </div>

                  {/* Per Campaign Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <Eye className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                      <div className="text-xl font-bold">+{formatNumber(additionalOpens)}</div>
                      <div className="text-xs text-white/40">opens</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <MousePointerClick className="w-5 h-5 text-fuchsia-400 mx-auto mb-2" />
                      <div className="text-xl font-bold">+{formatNumber(additionalClicks)}</div>
                      <div className="text-xs text-white/40">clicks</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-white/5">
                      <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-2" />
                      <div className="text-xl font-bold">+{formatCurrency(additionalRevenuePerCampaign)}</div>
                      <div className="text-xs text-white/40">per campaign</div>
                    </div>
                  </div>
                </div>

                {/* Results */}
                <div className="lg:col-span-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-8">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-sm font-medium text-white/80">Your Potential</span>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <p className="text-sm text-white/60 mb-2">Monthly recovered revenue</p>
                        <div className="text-5xl font-bold">{formatCurrency(monthlyAdditionalRevenue)}</div>
                        <p className="text-sm text-white/60 mt-2">
                          {campaignsPerMonth} campaigns × {formatCurrency(additionalRevenuePerCampaign)}
                        </p>
                      </div>

                      <div className="h-px bg-white/20" />

                      <div>
                        <p className="text-sm text-white/60 mb-2">Yearly recovered revenue</p>
                        <div className="text-3xl font-bold">{formatCurrency(yearlyAdditionalRevenue)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link href="/signup">
                      <Button size="lg" className="w-full bg-white text-violet-600 hover:bg-white/90 h-12 rounded-xl font-semibold">
                        Start Recovering Revenue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <p className="text-xs text-white/50 text-center mt-3">
                      Based on 22% → 58% open rate improvement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-lg text-white/50">Three steps to better inbox placement</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: <Shield className="w-6 h-6" />, title: "Connect", desc: "Link your Klaviyo account with a single API key", gradient: "from-violet-500 to-purple-500" },
              { step: "02", icon: <Zap className="w-6 h-6" />, title: "Process", desc: "Select templates and we inject invisible optimization", gradient: "from-fuchsia-500 to-pink-500" },
              { step: "03", icon: <TrendingUp className="w-6 h-6" />, title: "Profit", desc: "Watch your open rates and revenue climb", gradient: "from-cyan-500 to-blue-500" },
            ].map((item) => (
              <div key={item.step} className="group relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-1 hover:border-white/20 transition-all">
                <div className="rounded-[14px] bg-[#0f0f18] p-8 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-sm text-white/30 mb-2">{item.step}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-1">
            <div className="rounded-[22px] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to recover lost revenue?</h2>
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
                Start landing in Primary and see the difference in your next campaign.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-violet-600 hover:bg-white/90 h-14 px-10 rounded-full text-lg font-semibold shadow-xl">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">MailTail</span>
          </div>
          <span className="text-sm text-white/40">© 2024 MailTail</span>
        </div>
      </footer>
    </div>
  );
}
