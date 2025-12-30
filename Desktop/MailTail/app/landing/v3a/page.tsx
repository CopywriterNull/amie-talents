'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Shield, Zap, Check, ChevronRight, Bell, BellOff, Smartphone } from "lucide-react";

export default function LandingV3A() {
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
              <Link href="#problem" className="text-sm text-gray-600 hover:text-black transition-colors">Why It Matters</Link>
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
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                Works with Klaviyo
              </Badge>

              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-900">
                Your emails deserve a
                <span className="text-green-600"> notification</span>
              </h1>

              <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                Emails in Gmail&apos;s Primary inbox trigger push notifications on your customer&apos;s phone.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                <span className="font-semibold text-gray-900">Promotions tab emails don&apos;t.</span>
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

            {/* Phone Notification Comparison */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {/* Primary - With Notification */}
                <div className="relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-green-500 text-white">Primary</Badge>
                  </div>
                  <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                    <div className="bg-gray-100 rounded-[2rem] overflow-hidden">
                      {/* Phone Screen */}
                      <div className="bg-gradient-to-b from-blue-500 to-blue-600 h-48 relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          {/* Notification */}
                          <div className="bg-white/95 backdrop-blur rounded-2xl p-3 shadow-lg">
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <span className="font-semibold text-xs">Your Brand</span>
                                  <span className="text-[10px] text-gray-400">now</span>
                                </div>
                                <p className="text-xs text-gray-600 truncate">Your order has shipped! Track...</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-12 bg-white" />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                      <Bell className="w-4 h-4" />
                      Instant notification
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Customer sees it immediately</p>
                  </div>
                </div>

                {/* Promotions - No Notification */}
                <div className="relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant="secondary" className="bg-gray-200 text-gray-600">Promotions</Badge>
                  </div>
                  <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl opacity-60">
                    <div className="bg-gray-100 rounded-[2rem] overflow-hidden">
                      {/* Phone Screen */}
                      <div className="bg-gradient-to-b from-blue-500 to-blue-600 h-48 relative">
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
                        {/* No notification */}
                      </div>
                      <div className="h-12 bg-white" />
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <div className="flex items-center justify-center gap-2 text-gray-400 font-medium">
                      <BellOff className="w-4 h-4" />
                      No notification
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Buried with other promos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section id="problem" className="py-24 px-6 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="border-gray-700 text-gray-400 mb-6">The Problem</Badge>
          <h2 className="text-4xl font-bold mb-6">
            Gmail decides if your customer sees your email
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            When your email lands in Promotions, it doesn&apos;t trigger a notification. Your customer won&apos;t know it arrived until they manually check that tab — which most people rarely do.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { stat: "68%", label: "of Promotions emails are never opened", icon: "📭" },
              { stat: "0", label: "push notifications for Promotions", icon: "🔕" },
              { stat: "4x", label: "higher open rates in Primary", icon: "📈" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-800 rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{item.stat}</div>
                <div className="text-sm text-gray-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "40%+", label: "Better placement" },
              { value: "3x", label: "More opens" },
              { value: "2min", label: "Setup time" },
              { value: "100%", label: "Invisible to recipients" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
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
            <h2 className="text-4xl font-bold text-gray-900">Get seen in 3 simple steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: <Shield className="w-6 h-6" />, title: "Connect Klaviyo", desc: "Paste your API key. We connect securely to your account in seconds." },
              { step: "2", icon: <Zap className="w-6 h-6" />, title: "Select a Template", desc: "Choose any email template. We add invisible content that signals authenticity to Gmail." },
              { step: "3", icon: <Smartphone className="w-6 h-6" />, title: "Get Notifications", desc: "Your emails land in Primary and trigger push notifications on your customers' phones." },
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

      {/* Benefits */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-4">Why Primary Matters</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The difference between seen and ignored
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Your transactional emails, order confirmations, and important updates deserve to be seen immediately — not buried in a tab your customers check once a week.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Push notifications", desc: "Primary emails ping your customer's phone instantly" },
                  { title: "Higher visibility", desc: "Appears alongside personal emails from friends & family" },
                  { title: "Better engagement", desc: "4x higher open rates than Promotions tab" },
                  { title: "Immediate action", desc: "Customers see time-sensitive offers when they matter" },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{feature.title}</span>
                      <span className="text-gray-600"> — {feature.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <Bell className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-green-600 mb-1">Primary</div>
                  <div className="text-sm text-green-700">Notifies customer</div>
                  <div className="mt-4 text-xs text-green-600 bg-green-100 rounded-full py-1 px-3 inline-block">
                    MailTail helps you get here
                  </div>
                </CardContent>
              </Card>
              <Card className="opacity-50">
                <CardContent className="p-6 text-center">
                  <BellOff className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-400 mb-1">Promotions</div>
                  <div className="text-sm text-gray-500">Silent delivery</div>
                  <div className="mt-4 text-xs text-gray-400 bg-gray-100 rounded-full py-1 px-3 inline-block">
                    Where most marketing lands
                  </div>
                </CardContent>
              </Card>
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
              { title: "DMARC Generator", desc: "Create DMARC records to protect your domain", href: "/tools/dmarc-generator" },
              { title: "Domain Health", desc: "Check your email authentication setup", href: "/tools/domain-health" },
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
              <Bell className="w-12 h-12 mx-auto mb-6 text-green-400" />
              <h2 className="text-3xl font-bold mb-4">Ready to get your emails seen?</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Stop losing customers to the Promotions tab. Start landing in Primary and get the notifications your emails deserve.
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
