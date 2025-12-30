'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Shield, Zap, Check, ChevronRight, Star } from "lucide-react";

export default function LandingV3() {
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
              <Link href="#features" className="text-sm text-gray-600 hover:text-black transition-colors">Features</Link>
              <Link href="#how" className="text-sm text-gray-600 hover:text-black transition-colors">How it works</Link>
              <Link href="/tools/dmarc-generator" className="text-sm text-gray-600 hover:text-black transition-colors">Tools</Link>
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
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Works with Klaviyo
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-900">
                Get your emails into the Primary inbox
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                MailTail adds optimized footer content to your Klaviyo templates that helps bypass Gmail&apos;s Promotions filter.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/signup">
                  <Button size="lg" className="bg-black hover:bg-gray-800 h-12 px-6">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#how">
                  <Button size="lg" variant="outline" className="h-12 px-6">
                    See How It Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  2 minute setup
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl blur-2xl opacity-60" />
              <Card className="relative shadow-2xl border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">
                        YB
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Your Brand</div>
                        <div className="text-xs text-gray-400">to me</div>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Primary
                      </Badge>
                    </div>
                    <div className="border-t pt-4 space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-full" />
                      <div className="h-3 bg-gray-100 rounded w-5/6" />
                      <div className="h-16 bg-gray-50 rounded-lg mt-3" />
                    </div>
                    <div className="flex items-center gap-2 pt-2 text-xs text-green-600">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      MailTail footer active — invisible to recipients
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "40%", label: "Better placement" },
              { value: "10k+", label: "Emails processed" },
              { value: "2min", label: "Avg setup time" },
              { value: "4.9", label: "Customer rating", icon: <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-gray-900 mb-1 flex items-center justify-center gap-1">
                  {stat.value}
                  {stat.icon}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Simple, effective, invisible</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <Shield className="w-6 h-6" />, title: "Connect", desc: "Link your Klaviyo account securely with your API key. Takes less than a minute." },
              { step: "2", icon: <Zap className="w-6 h-6" />, title: "Process", desc: "Select any email template from your library. We'll inject optimized footer content." },
              { step: "3", icon: <Check className="w-6 h-6" />, title: "Done", desc: "Use your enhanced template. Watch your emails land in Primary, not Promotions." },
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

      {/* Features */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Why MailTail</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Gmail uses AI to filter emails. We help you speak its language.
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Marketing emails lack personal, conversational signals. Our footer content adds those signals invisibly, helping your emails bypass the Promotions filter.
              </p>
              <div className="space-y-4">
                {[
                  "Hidden from recipients — completely invisible",
                  "Mimics personal email patterns",
                  "Works with all Klaviyo templates",
                  "Improves placement by 40%+",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Promotions", bad: true },
                { label: "Primary", bad: false },
              ].map((item) => (
                <Card key={item.label} className={`${item.bad ? 'opacity-50' : 'border-green-200 bg-green-50'}`}>
                  <CardContent className="p-6 text-center">
                    <div className={`text-4xl mb-2 ${item.bad ? 'text-red-500' : 'text-green-500'}`}>
                      {item.bad ? '✗' : '✓'}
                    </div>
                    <div className="font-medium">{item.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Free Tools</Badge>
            <h2 className="text-3xl font-bold text-gray-900">Email Deliverability Tools</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: "DMARC Generator", desc: "Create DMARC records", href: "/tools/dmarc-generator" },
              { title: "Domain Health", desc: "Check email authentication", href: "/tools/domain-health" },
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
              <h2 className="text-3xl font-bold mb-4">Ready to land in Primary?</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join brands using MailTail to improve their inbox placement.
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
