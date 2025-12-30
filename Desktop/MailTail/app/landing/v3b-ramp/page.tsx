'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Mail, Shield, Zap, Check, TrendingUp, DollarSign, MousePointerClick, Eye, ArrowUpRight, Bell, BellOff } from "lucide-react";

export default function LandingV3BRamp() {
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

  const openRateImprovement = Math.round(((improvedOpenRate - currentOpenRate) / currentOpenRate) * 100);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg text-[#1a1a1a]">MailTail</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#calculator" className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors">Calculator</Link>
              <Link href="#how" className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors">How it works</Link>
              <Link href="/tools/dmarc-generator" className="text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors">Tools</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-gray-600">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-[#1a1a1a] hover:bg-black text-white rounded-lg h-9 px-4">
                  Get started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Klaviyo Integration
              </div>

              <h1 className="text-[52px] font-semibold tracking-tight leading-[1.1] text-[#1a1a1a] mb-6">
                Stop losing revenue to the Promotions tab
              </h1>

              <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                Emails in Gmail&apos;s Promotions tab see 68% lower engagement. MailTail helps you land in Primary—where customers actually see you.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link href="/signup">
                  <Button size="lg" className="bg-[#1a1a1a] hover:bg-black text-white h-12 px-6 rounded-lg">
                    Start free trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#calculator">
                  <Button size="lg" variant="outline" className="h-12 px-6 rounded-lg border-gray-300">
                    Calculate savings
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  2-minute setup
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Open Rate</span>
                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                      <TrendingUp className="w-4 h-4" />
                      +{openRateImprovement}%
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-semibold text-[#1a1a1a]">58%</span>
                    <span className="text-lg text-gray-400 line-through">22%</span>
                  </div>
                  <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[58%] bg-emerald-500 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Inbox Placement</span>
                    <Bell className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-semibold text-[#1a1a1a] mb-1">Primary</div>
                  <div className="text-sm text-gray-500">With push notifications</div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 h-2 bg-emerald-500 rounded-full" />
                    <div className="w-8 h-2 bg-gray-200 rounded-full" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Setup Time</span>
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-4xl font-semibold text-[#1a1a1a]">2</div>
                  <div className="text-sm text-gray-500">minutes to deploy</div>
                </CardContent>
              </Card>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Visibility</span>
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-semibold text-[#1a1a1a] mb-1">100%</div>
                  <div className="text-sm text-gray-500">Invisible to recipients</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-8 px-6 border-y border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-12">
            <span className="text-sm text-gray-400">Trusted by e-commerce brands</span>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-[#1a1a1a]">10,000+</span>
              <span className="text-sm text-gray-500">emails optimized</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-[#1a1a1a]">40%+</span>
              <span className="text-sm text-gray-500">avg. improvement</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              Revenue Calculator
            </div>
            <h2 className="text-4xl font-semibold text-[#1a1a1a] mb-4">
              Calculate your recovered revenue
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              See how much you could save by landing in Primary instead of Promotions
            </p>
          </div>

          <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-3">
              {/* Inputs */}
              <div className="lg:col-span-2 p-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Email list size</Label>
                      <span className="text-sm font-semibold text-[#1a1a1a]">{formatNumber(listSize)}</span>
                    </div>
                    <Slider
                      value={[listSize]}
                      onValueChange={(value) => setListSize(value[0])}
                      min={1000}
                      max={100000}
                      step={1000}
                      className="[&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-[#1a1a1a] [&_[data-slot=slider-thumb]]:border-[#1a1a1a]"
                    />
                    <Input
                      type="number"
                      value={listSize}
                      onChange={(e) => setListSize(Math.max(1000, Number(e.target.value) || 1000))}
                      className="h-10 border-gray-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Campaigns / month</Label>
                      <span className="text-sm font-semibold text-[#1a1a1a]">{campaignsPerMonth}</span>
                    </div>
                    <Slider
                      value={[campaignsPerMonth]}
                      onValueChange={(value) => setCampaignsPerMonth(value[0])}
                      min={1}
                      max={30}
                      step={1}
                      className="[&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-[#1a1a1a] [&_[data-slot=slider-thumb]]:border-[#1a1a1a]"
                    />
                    <Input
                      type="number"
                      value={campaignsPerMonth}
                      onChange={(e) => setCampaignsPerMonth(Math.max(1, Number(e.target.value) || 1))}
                      className="h-10 border-gray-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Click-through rate</Label>
                      <span className="text-sm font-semibold text-[#1a1a1a]">{clickThroughRate}%</span>
                    </div>
                    <Slider
                      value={[clickThroughRate]}
                      onValueChange={(value) => setClickThroughRate(value[0])}
                      min={1}
                      max={50}
                      step={1}
                      className="[&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-[#1a1a1a] [&_[data-slot=slider-thumb]]:border-[#1a1a1a]"
                    />
                    <Input
                      type="number"
                      value={clickThroughRate}
                      onChange={(e) => setClickThroughRate(Math.max(1, Number(e.target.value) || 1))}
                      className="h-10 border-gray-200"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700">Revenue per click</Label>
                      <span className="text-sm font-semibold text-[#1a1a1a]">${revenuePerClick}</span>
                    </div>
                    <Slider
                      value={[revenuePerClick]}
                      onValueChange={(value) => setRevenuePerClick(value[0])}
                      min={1}
                      max={50}
                      step={1}
                      className="[&_[data-slot=slider-track]]:bg-gray-200 [&_[data-slot=slider-range]]:bg-[#1a1a1a] [&_[data-slot=slider-thumb]]:border-[#1a1a1a]"
                    />
                    <Input
                      type="number"
                      value={revenuePerClick}
                      onChange={(e) => setRevenuePerClick(Math.max(1, Number(e.target.value) || 1))}
                      className="h-10 border-gray-200"
                    />
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Per Campaign Results */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Opens</span>
                    </div>
                    <div className="text-2xl font-semibold text-[#1a1a1a]">+{formatNumber(additionalOpens)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointerClick className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Clicks</span>
                    </div>
                    <div className="text-2xl font-semibold text-[#1a1a1a]">+{formatNumber(additionalClicks)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Revenue</span>
                    </div>
                    <div className="text-2xl font-semibold text-emerald-600">+{formatCurrency(additionalRevenuePerCampaign)}</div>
                  </div>
                </div>
              </div>

              {/* Results Panel */}
              <div className="bg-[#1a1a1a] text-white p-8 flex flex-col justify-between">
                <div>
                  <div className="text-sm text-gray-400 mb-6">Potential savings</div>

                  <div className="space-y-6">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Monthly</div>
                      <div className="text-4xl font-semibold text-emerald-400">{formatCurrency(monthlyAdditionalRevenue)}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {campaignsPerMonth} campaigns × {formatCurrency(additionalRevenuePerCampaign)}
                      </div>
                    </div>

                    <Separator className="bg-gray-800" />

                    <div>
                      <div className="text-sm text-gray-400 mb-1">Yearly</div>
                      <div className="text-3xl font-semibold">{formatCurrency(yearlyAdditionalRevenue)}</div>
                      <div className="text-xs text-gray-500 mt-1">projected annually</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Link href="/signup">
                    <Button className="w-full bg-white text-[#1a1a1a] hover:bg-gray-100 h-12 rounded-lg font-medium">
                      Start saving
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Based on 22% → 58% open rate
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 px-6 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-[#1a1a1a] mb-4">How MailTail works</h2>
            <p className="text-lg text-gray-500">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", icon: <Shield className="w-6 h-6" />, title: "Connect Klaviyo", desc: "Securely link your account with a single API key. No technical setup required." },
              { num: "2", icon: <Zap className="w-6 h-6" />, title: "Process templates", desc: "Select email templates and we inject invisible content that signals authenticity to Gmail." },
              { num: "3", icon: <TrendingUp className="w-6 h-6" />, title: "See results", desc: "Use your enhanced templates and watch open rates, clicks, and revenue improve." },
            ].map((step) => (
              <Card key={step.num} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-medium">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">{step.title}</h3>
                  <p className="text-gray-500">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-[#1a1a1a] border-0 overflow-hidden">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-semibold text-white mb-4">
                Ready to recover lost revenue?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Start landing in Primary and see the difference in your next campaign. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-[#1a1a1a] hover:bg-gray-100 h-12 px-8 rounded-lg">
                    Start free trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#calculator">
                  <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-white/10 h-12 px-8 rounded-lg">
                    Calculate savings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1a1a1a] flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[#1a1a1a]">MailTail</span>
          </div>
          <span className="text-sm text-gray-400">© 2024 MailTail. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
