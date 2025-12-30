'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Shield, Zap, Check, Inbox, Sparkles } from "lucide-react";

export default function LandingV4() {
  return (
    <div className="min-h-screen bg-[#fffbf5]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffbf5]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-[#ff6b35] flex items-center justify-center rotate-3 hover:rotate-0 transition-transform">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">MailTail</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/tools/dmarc-generator" className="text-sm font-medium text-gray-600 hover:text-[#ff6b35] transition-colors">
                Tools
              </Link>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-[#ff6b35] transition-colors">
                Login
              </Link>
              <Link href="/signup">
                <Button className="bg-[#ff6b35] hover:bg-[#e55a2b] rounded-full px-6 shadow-lg shadow-[#ff6b35]/25">
                  Get Started
                  <Sparkles className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 text-[#ff6b35] font-medium text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
            Works with Klaviyo
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 text-gray-900">
            Stop landing in
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Promotions</span>
              <span className="absolute inset-0 bg-[#ff6b35]/20 -rotate-1 rounded-lg transform scale-105" />
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            MailTail adds invisible magic to your Klaviyo emails that helps them reach the Primary inbox. Like a secret handshake with Gmail.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button size="lg" className="bg-[#ff6b35] hover:bg-[#e55a2b] rounded-full h-14 px-8 text-lg shadow-xl shadow-[#ff6b35]/25 hover:shadow-2xl hover:shadow-[#ff6b35]/30 transition-all hover:-translate-y-0.5">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#how">
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-2 hover:bg-gray-50">
                How it works
              </Button>
            </Link>
          </div>

          {/* Animated inbox */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/20 to-transparent rounded-3xl blur-3xl" />
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Inbox className="w-6 h-6 text-gray-400" />
                  <span className="font-semibold text-gray-900">Inbox</span>
                </div>
                <Badge className="bg-green-100 text-green-700 font-semibold rounded-full">
                  Primary
                </Badge>
              </div>

              <div className="space-y-3">
                {[
                  { from: "Your Brand", subject: "Your order is on the way! 📦", active: true },
                  { from: "Sarah", subject: "Re: Meeting tomorrow", active: false },
                  { from: "Mom", subject: "Call me when you can", active: false },
                ].map((email, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl ${email.active ? 'bg-[#ff6b35]/5 border-2 border-[#ff6b35]/20' : 'bg-gray-50'} transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${email.active ? 'bg-[#ff6b35]' : 'bg-gray-300'} flex items-center justify-center text-white font-bold text-sm`}>
                        {email.from[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{email.from}</div>
                        <div className="text-sm text-gray-500 truncate">{email.subject}</div>
                      </div>
                      {email.active && (
                        <div className="flex items-center gap-1 text-xs text-[#ff6b35] font-medium">
                          <Sparkles className="w-3 h-3" />
                          MailTail
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {[
              { value: "40%+", label: "Better inbox placement", emoji: "📈" },
              { value: "2min", label: "Setup time", emoji: "⚡" },
              { value: "100%", label: "Invisible to recipients", emoji: "👻" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl mb-2">{stat.emoji}</div>
                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-[#ff6b35]/10 text-[#ff6b35] hover:bg-[#ff6b35]/10 mb-4 rounded-full px-4">
              How it works
            </Badge>
            <h2 className="text-4xl font-black text-gray-900">Three easy steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "1", icon: <Shield className="w-6 h-6" />, title: "Connect", desc: "Link your Klaviyo account with your API key", color: "bg-blue-500" },
              { num: "2", icon: <Zap className="w-6 h-6" />, title: "Process", desc: "Select a template and we inject the magic footer", color: "bg-purple-500" },
              { num: "3", icon: <Check className="w-6 h-6" />, title: "Done!", desc: "Use your enhanced template and watch the magic happen", color: "bg-green-500" },
            ].map((step) => (
              <div key={step.num} className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-[#ff6b35]/20 to-orange-200/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-[#ff6b35]/30 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center text-white mb-6 rotate-3 group-hover:rotate-0 transition-transform`}>
                    {step.icon}
                  </div>
                  <div className="text-6xl font-black text-gray-100 absolute top-6 right-6">{step.num}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 mb-4 rounded-full px-4">
              Free Tools
            </Badge>
            <h2 className="text-3xl font-black text-gray-900">Email Deliverability Tools</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "DMARC Generator", desc: "Create DMARC records for your domain", href: "/tools/dmarc-generator", emoji: "🛡️" },
              { title: "Domain Health Check", desc: "Analyze your email authentication", href: "/tools/domain-health", emoji: "🔍" },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href} className="group">
                <div className="bg-[#fffbf5] rounded-3xl p-8 border-2 border-gray-100 hover:border-[#ff6b35]/30 transition-all hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-2xl">
                      {tool.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-[#ff6b35] transition-colors">{tool.title}</h3>
                      <p className="text-gray-600 mb-3">{tool.desc}</p>
                      <div className="flex items-center gap-1 text-[#ff6b35] font-medium text-sm">
                        Try it free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-[#ff6b35] rounded-[2rem] rotate-1" />
            <div className="relative bg-[#ff6b35] rounded-[2rem] p-12 text-center text-white -rotate-1 hover:rotate-0 transition-transform">
              <h2 className="text-4xl font-black mb-4">Ready to reach the Primary inbox?</h2>
              <p className="text-white/80 mb-8 text-lg max-w-lg mx-auto">
                Join thousands of brands already using MailTail.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-[#ff6b35] hover:bg-gray-100 rounded-full h-14 px-10 text-lg font-bold shadow-xl">
                  Start Free Today
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#ff6b35] flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">MailTail</span>
          </div>
          <span className="text-sm text-gray-400">© 2024 MailTail</span>
        </div>
      </footer>
    </div>
  );
}
