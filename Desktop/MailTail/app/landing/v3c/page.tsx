'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Shield, Zap, Check, ChevronRight, AlertTriangle, X, Inbox, Bell } from "lucide-react";

export default function LandingV3C() {
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
              <Link href="#problem" className="text-sm text-gray-600 hover:text-black transition-colors">The Problem</Link>
              <Link href="#solution" className="text-sm text-gray-600 hover:text-black transition-colors">Solution</Link>
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

      {/* Hero - The Problem */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mb-6">
            <AlertTriangle className="w-3 h-3 mr-1" />
            The Hidden Problem
          </Badge>

          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-900">
            Gmail is hiding
            <br />
            <span className="text-red-500">your emails</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            You write the perfect email. You hit send. And Gmail quietly buries it in the Promotions tab where your customer may never see it.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="bg-black hover:bg-gray-800 h-12 px-6">
                Fix It Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#problem">
              <Button size="lg" variant="outline" className="h-12 px-6">
                See the Problem
              </Button>
            </Link>
          </div>

          {/* Email Tab Visualization */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              {/* Gmail-like tabs */}
              <div className="flex border-b border-gray-200">
                <div className="flex-1 py-3 px-4 bg-white border-b-2 border-blue-500">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
                    <Inbox className="w-4 h-4" />
                    Primary
                  </div>
                </div>
                <div className="flex-1 py-3 px-4 bg-gray-50 relative">
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500">
                    <Mail className="w-4 h-4" />
                    Promotions
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">47</span>
                  </div>
                </div>
              </div>

              {/* Email list */}
              <div className="divide-y divide-gray-100">
                <div className="p-4 flex items-center gap-3 bg-blue-50">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">M</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">Mom</div>
                    <div className="text-xs text-gray-500">Don't forget dinner on Sunday!</div>
                  </div>
                  <span className="text-xs text-gray-400">2:34 PM</span>
                </div>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">J</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">John from Work</div>
                    <div className="text-xs text-gray-500">Re: Meeting notes from today</div>
                  </div>
                  <span className="text-xs text-gray-400">1:15 PM</span>
                </div>
                <div className="p-4 flex items-center gap-3 opacity-40 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-red-50 pointer-events-none" />
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">YB</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm line-through">Your Brand</div>
                    <div className="text-xs text-gray-500 line-through">50% OFF - Your exclusive offer expires...</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded font-medium">Moved to Promotions</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Your carefully crafted email — filtered away from your customer&apos;s attention.</p>
          </div>
        </div>
      </section>

      {/* The Problem Explained */}
      <section id="problem" className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why this happens to your emails</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Gmail uses AI to detect &quot;marketing patterns&quot; in emails. If it finds them, your email goes to Promotions — regardless of how important it is to your customer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* What Gmail looks for */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  What triggers Promotions
                </h3>
                <div className="space-y-4">
                  {[
                    "Marketing-style HTML templates",
                    "Promotional language and CTAs",
                    "Bulk sending patterns",
                    "Tracking pixels and links",
                    "Missing personal conversation signals",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <X className="w-5 h-5 text-red-400 shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* The consequences */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-400" />
                  The consequences
                </h3>
                <div className="space-y-4">
                  {[
                    { stat: "0", desc: "push notifications sent" },
                    { stat: "68%", desc: "of emails never opened" },
                    { stat: "1x", desc: "per week tab is checked" },
                    { stat: "-40%", desc: "in potential revenue" },
                  ].map((item) => (
                    <div key={item.desc} className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-red-400 w-16">{item.stat}</div>
                      <span className="text-gray-300">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-lg">
              The worst part? <span className="text-white font-semibold">Your customer never knows they missed your email.</span>
            </p>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section id="solution" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-4">
              <Check className="w-3 h-3 mr-1" />
              The Solution
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">MailTail speaks Gmail&apos;s language</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We add invisible content to your emails that contains the personal, conversational signals Gmail looks for — without changing anything your customers see.
            </p>
          </div>

          {/* Before/After */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Before */}
            <div>
              <div className="text-center mb-4">
                <Badge variant="outline" className="text-red-600 border-red-200">Before MailTail</Badge>
              </div>
              <Card className="border-red-200 bg-red-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold">YB</div>
                    <div>
                      <div className="font-semibold">Your Brand</div>
                      <div className="text-xs text-gray-500">to customer@gmail.com</div>
                    </div>
                    <Badge variant="secondary" className="ml-auto bg-red-100 text-red-600">Promotions</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <X className="w-4 h-4" />
                    No notification sent
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* After */}
            <div>
              <div className="text-center mb-4">
                <Badge className="bg-green-100 text-green-700">After MailTail</Badge>
              </div>
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">YB</div>
                    <div>
                      <div className="font-semibold">Your Brand</div>
                      <div className="text-xs text-gray-500">to customer@gmail.com</div>
                    </div>
                    <Badge className="ml-auto bg-green-100 text-green-700">Primary</Badge>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="border-t border-dashed border-green-300 pt-3 mt-3">
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      MailTail footer active — invisible to recipient
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600 mt-3">
                    <Bell className="w-4 h-4" />
                    Push notification sent to phone
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How it works */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <Shield className="w-6 h-6" />, title: "Connect Klaviyo", desc: "Securely link your account with a single API key. No technical setup required." },
              { step: "2", icon: <Zap className="w-6 h-6" />, title: "Process Templates", desc: "Select any email template. We inject invisible content that signals authenticity to Gmail." },
              { step: "3", icon: <Inbox className="w-6 h-6" />, title: "Land in Primary", desc: "Your emails reach the Primary inbox and trigger notifications on your customers' phones." },
            ].map((item) => (
              <Card key={item.step} className="border-2 hover:border-black transition-colors">
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

      {/* Results */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Results</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-12">What happens when you land in Primary</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "40%+", label: "Better inbox placement", emoji: "📬" },
              { value: "3x", label: "Higher open rates", emoji: "👀" },
              { value: "100%", label: "Invisible to recipients", emoji: "👻" },
              { value: "Instant", label: "Phone notifications", emoji: "📱" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Free Tools</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Check Your Email Health</h2>
            <p className="text-gray-600 mt-2">Make sure your domain is set up for maximum deliverability</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "DMARC Generator", desc: "Create DMARC records to protect your domain from spoofing", href: "/tools/dmarc-generator" },
              { title: "Domain Health Check", desc: "Analyze your SPF, DKIM, and DMARC configuration", href: "/tools/domain-health" },
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
          <Card className="bg-black text-white border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
            <CardContent className="p-12 text-center relative">
              <h2 className="text-3xl font-bold mb-4">Stop letting Gmail hide your emails</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Your customers want to hear from you. Make sure Gmail lets them.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-12 px-8">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-6">No credit card required • 2 minute setup • Works with Klaviyo</p>
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
