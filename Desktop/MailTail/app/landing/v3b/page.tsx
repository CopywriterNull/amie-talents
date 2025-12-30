'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Mail, Shield, Zap, Check, ChevronRight, TrendingUp, DollarSign, MousePointerClick, Eye, Calculator, Sparkles } from "lucide-react";

export default function LandingV3B() {
  const [listSize, setListSize] = useState(10000);
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(4);
  const [revenuePerClick, setRevenuePerClick] = useState(3);
  const [clickThroughRate, setClickThroughRate] = useState(20);

  // Calculations
  const currentOpenRate = 0.22; // 22% in Promotions
  const improvedOpenRate = 0.58; // 58% in Primary
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
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">MailTail</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#roi" className="text-sm text-gray-600 hover:text-black transition-colors">Calculator</Link>
              <Link href="#how" className="text-sm text-gray-600 hover:text-black transition-colors">How it works</Link>
              <Link href="/tools/dmarc-generator" className="text-sm text-gray-600 hover:text-black transition-colors">Free Tools</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-black hover:bg-gray-800">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 mb-6">
                <DollarSign className="w-3 h-3 mr-1" />
                Revenue Impact
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-900">
                Every email in Promotions
                <span className="text-red-500"> costs you money</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Promotions tab emails see <span className="font-semibold text-gray-900">68% lower open rates</span> than Primary. That&apos;s revenue you&apos;re leaving on the table with every campaign.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/signup">
                  <Button size="lg" className="bg-black hover:bg-gray-800 h-12 px-6">
                    Recover Lost Revenue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#roi">
                  <Button size="lg" variant="outline" className="h-12 px-6">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Your ROI
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Works with Klaviyo
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  2 minute setup
                </div>
              </div>
            </div>

            {/* Revenue Impact Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-sm text-gray-400 mb-6">Monthly email performance</div>

                {/* Before/After Comparison */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Without MailTail</span>
                      <span className="text-gray-400">Promotions Tab</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div className="bg-red-500 h-full w-[22%] rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-red-400 font-semibold">22% open rate</span>
                      <span className="text-gray-500">Industry avg</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">With MailTail</span>
                      <span className="text-green-400">Primary Inbox</span>
                    </div>
                    <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div className="bg-green-500 h-full w-[58%] rounded-full" />
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-green-400 font-semibold">58% open rate</span>
                      <span className="text-green-400">+164%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">2.6x</div>
                      <div className="text-xs text-gray-400">More opens</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">3.1x</div>
                      <div className="text-xs text-gray-400">More clicks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">+40%</div>
                      <div className="text-xs text-gray-400">Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Calculator */}
      <section id="roi" className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Calculator className="w-3 h-3 mr-1" />
              Revenue Calculator
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Calculate your recovered revenue</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how much more you could earn by landing in Primary instead of Promotions
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-5">
                {/* Calculator Inputs */}
                <div className="lg:col-span-3 p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* List Size */}
                    <div className="space-y-3">
                      <Label htmlFor="listSize" className="text-sm font-medium text-gray-700">
                        Email list size
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="listSize"
                          type="number"
                          value={listSize}
                          onChange={(e) => setListSize(Math.max(1000, Math.min(500000, Number(e.target.value) || 1000)))}
                          className="pl-10 h-12 text-lg font-medium"
                        />
                      </div>
                      <Slider
                        value={[listSize]}
                        onValueChange={(value) => setListSize(value[0])}
                        min={1000}
                        max={100000}
                        step={1000}
                        className="w-full"
                      />
                    </div>

                    {/* Campaigns per month */}
                    <div className="space-y-3">
                      <Label htmlFor="campaigns" className="text-sm font-medium text-gray-700">
                        Campaigns per month
                      </Label>
                      <div className="relative">
                        <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="campaigns"
                          type="number"
                          value={campaignsPerMonth}
                          onChange={(e) => setCampaignsPerMonth(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
                          className="pl-10 h-12 text-lg font-medium"
                        />
                      </div>
                      <Slider
                        value={[campaignsPerMonth]}
                        onValueChange={(value) => setCampaignsPerMonth(value[0])}
                        min={1}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Click-through rate */}
                    <div className="space-y-3">
                      <Label htmlFor="ctr" className="text-sm font-medium text-gray-700">
                        Click-through rate (%)
                      </Label>
                      <div className="relative">
                        <MousePointerClick className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="ctr"
                          type="number"
                          value={clickThroughRate}
                          onChange={(e) => setClickThroughRate(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                          className="pl-10 h-12 text-lg font-medium"
                        />
                      </div>
                      <Slider
                        value={[clickThroughRate]}
                        onValueChange={(value) => setClickThroughRate(value[0])}
                        min={1}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Revenue per click */}
                    <div className="space-y-3">
                      <Label htmlFor="rpc" className="text-sm font-medium text-gray-700">
                        Revenue per click ($)
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="rpc"
                          type="number"
                          value={revenuePerClick}
                          onChange={(e) => setRevenuePerClick(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                          className="pl-10 h-12 text-lg font-medium"
                        />
                      </div>
                      <Slider
                        value={[revenuePerClick]}
                        onValueChange={(value) => setRevenuePerClick(value[0])}
                        min={1}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Per Campaign Stats */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Per Campaign Improvement</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-100 rounded-xl p-4 text-center">
                        <Eye className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900">+{formatNumber(additionalOpens)}</div>
                        <div className="text-xs text-gray-500">opens</div>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-4 text-center">
                        <MousePointerClick className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900">+{formatNumber(additionalClicks)}</div>
                        <div className="text-xs text-gray-500">clicks</div>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-4 text-center">
                        <DollarSign className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900">+{formatCurrency(additionalRevenuePerCampaign)}</div>
                        <div className="text-xs text-gray-500">revenue</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2 bg-black text-white p-8 flex flex-col justify-between rounded-r-xl lg:rounded-l-none rounded-b-xl lg:rounded-b-none lg:rounded-r-xl">
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-5 h-5 text-green-400" />
                      <span className="text-sm font-medium text-gray-400">Your Potential</span>
                    </div>

                    <div className="space-y-6">
                      {/* Monthly */}
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Monthly recovered revenue</p>
                        <div className="text-5xl font-bold text-green-400">
                          {formatCurrency(monthlyAdditionalRevenue)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {campaignsPerMonth} campaigns × {formatCurrency(additionalRevenuePerCampaign)}
                        </p>
                      </div>

                      <Separator className="bg-gray-800" />

                      {/* Yearly */}
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Yearly recovered revenue</p>
                        <div className="text-3xl font-bold text-white">
                          {formatCurrency(yearlyAdditionalRevenue)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">per year</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4">
                    <Link href="/signup" className="block">
                      <Button size="lg" className="w-full bg-white text-black hover:bg-gray-100 h-12">
                        Start Recovering Revenue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 text-center">
                      Based on 22% → 58% open rate improvement
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "40%+", label: "Revenue increase", icon: <TrendingUp className="w-5 h-5 text-green-500" /> },
              { value: "3x", label: "Higher click rates", icon: <MousePointerClick className="w-5 h-5 text-blue-500" /> },
              { value: "2min", label: "Setup time", icon: <Zap className="w-5 h-5 text-amber-500" /> },
              { value: "100%", label: "Invisible", icon: <Eye className="w-5 h-5 text-gray-400" /> },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">The Reality</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                You&apos;re paying for emails no one sees
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                You spend hours crafting the perfect email. You pay for your email platform. You pay for your list. But when Gmail sends it to Promotions, most of your subscribers never even know it arrived.
              </p>
              <div className="space-y-4">
                {[
                  { title: "No notification", desc: "Promotions emails don't ping your customer's phone" },
                  { title: "Buried in clutter", desc: "Mixed with dozens of other marketing emails" },
                  { title: "Checked rarely", desc: "Most people only look at Promotions once a week" },
                  { title: "Lower intent", desc: "When they do check, they're in 'delete mode'" },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-red-500 text-sm">✕</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{feature.title}</span>
                      <span className="text-gray-600"> — {feature.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">With MailTail</h3>
                  <div className="space-y-4">
                    {[
                      "Emails land in Primary inbox",
                      "Push notifications reach customers instantly",
                      "Higher visibility alongside personal emails",
                      "Better engagement and more conversions",
                      "Invisible to recipients — no disruption",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 text-green-700" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Start seeing results in minutes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <Shield className="w-6 h-6" />, title: "Connect", desc: "Link your Klaviyo account with a single API key. Secure, instant, no technical setup required." },
              { step: "2", icon: <Zap className="w-6 h-6" />, title: "Process", desc: "Select any email template. We inject optimized content that's completely invisible to recipients." },
              { step: "3", icon: <TrendingUp className="w-6 h-6" />, title: "Profit", desc: "Use your enhanced template and watch your open rates, clicks, and revenue climb." },
            ].map((item) => (
              <Card key={item.step} className="border-2 hover:border-black transition-colors bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      {item.icon}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Free Tools</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Improve Your Deliverability</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "DMARC Generator", desc: "Protect your domain from spoofing", href: "/tools/dmarc-generator" },
              { title: "Domain Health", desc: "Check SPF, DKIM & DMARC setup", href: "/tools/domain-health" },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href} className="group">
                <Card className="hover:shadow-lg transition-all hover:border-gray-300">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-green-600 transition-colors">{tool.title}</h3>
                      <p className="text-sm text-gray-500">{tool.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-black text-white border-0">
            <CardContent className="p-12 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-6 text-green-400" />
              <h2 className="text-3xl font-bold mb-4">Stop leaving money on the table</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Every campaign in Promotions is revenue lost. Start landing in Primary and see the difference in your next send.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-12 px-8">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">MailTail</span>
          </div>
          <span className="text-sm text-gray-400">© 2024 MailTail. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
