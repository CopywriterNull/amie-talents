"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CheckboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none">
      <rect x="1" y="1" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 19" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.32L10 13.27l-4.77 2.5.91-5.31L2.27 6.62l5.34-.78L10 1z" />
    </svg>
  );
}

function ImportantIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 7l6 6 8-6-8-6-6 6z" />
    </svg>
  );
}

function InboxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5v-3h3.56c.69 1.19 1.97 2 3.45 2s2.75-.81 3.45-2H19v3zm0-5h-4.99c0 1.1-.9 2-2 2s-2-.9-2-2H5V5h14v9z"/>
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42z"/>
    </svg>
  );
}

interface EmailRow {
  sender: string;
  subject: string;
  preview: string;
  unread: boolean;
}

const primaryEmails: EmailRow[] = [
  {
    sender: "Your Brand",
    subject: "We're launching a new summer sale!",
    preview: "Hey! We wanted to let you know about our exclusive summer collection...",
    unread: true,
  },
  {
    sender: "Your Brand",
    subject: "Your order has shipped!",
    preview: "Great news! Your package is on its way and will arrive by...",
    unread: true,
  },
  {
    sender: "Your Brand",
    subject: "Welcome to the family!",
    preview: "Thanks for joining us. Here's what you can expect from...",
    unread: false,
  },
  {
    sender: "Your Brand",
    subject: "We just launched our new FW collection!",
    preview: "Be the first to shop our newest arrivals before they sell out...",
    unread: true,
  },
  {
    sender: "Your Brand",
    subject: "A special thank you gift inside",
    preview: "As one of our best customers, we wanted to give you...",
    unread: false,
  },
];

const promotionsEmails: EmailRow[] = [
  {
    sender: "Your Brand",
    subject: "🔥 SALE: 40% off everything!",
    preview: "Don't miss out on our biggest sale of the year...",
    unread: false,
  },
  {
    sender: "Your Brand",
    subject: "New arrivals just dropped",
    preview: "Check out what's new in our store this week...",
    unread: false,
  },
  {
    sender: "Your Brand",
    subject: "Last chance: Sale ends tonight",
    preview: "Only a few hours left to save big on your favorites...",
    unread: false,
  },
  {
    sender: "Your Brand",
    subject: "You left something behind...",
    preview: "Your cart is waiting! Complete your purchase and...",
    unread: false,
  },
  {
    sender: "Your Brand",
    subject: "Weekly deals inside →",
    preview: "This week's best offers curated just for you...",
    unread: false,
  },
];

export function GmailInbox({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<"primary" | "promotions">("primary");

  const emails = activeTab === "primary" ? primaryEmails : promotionsEmails;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow: `
            0 1px 3px rgba(0,0,0,0.04),
            0 4px 12px rgba(0,0,0,0.04),
            0 16px 48px rgba(0,0,0,0.06)
          `,
        }}
      >
        {/* Tab Header */}
        <div className="flex border-b border-[#edeff1]">
          {/* Primary Tab */}
          <button
            onClick={() => setActiveTab("primary")}
            className="flex-1 relative transition-colors"
          >
            <div className={`px-4 py-3 ${activeTab === "primary" ? "bg-white" : "bg-[#fafafa] hover:bg-[#f5f5f5]"}`}>
              <div className="flex items-center gap-3">
                <InboxIcon className={`w-5 h-5 transition-colors ${activeTab === "primary" ? "text-[#22c55e]" : "text-[#0000008a]"}`} />
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium transition-colors ${activeTab === "primary" ? "text-[#22c55e]" : "text-[#0000008a]"}`}>
                      Primary
                    </span>
                    <span className={`px-1.5 py-0.5 text-white text-[10px] font-medium rounded transition-colors ${activeTab === "primary" ? "bg-[#22c55e]" : "bg-[#a3a3a3]"}`}>
                      After
                    </span>
                  </div>
                  <span className="text-[11px] text-[#0000005e] text-left">Your Emails After MailTail</span>
                </div>
              </div>
            </div>
            {/* Active indicator */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#22c55e] rounded-t-full"
              initial={false}
              animate={{ opacity: activeTab === "primary" ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>

          {/* Promotions Tab */}
          <button
            onClick={() => setActiveTab("promotions")}
            className="flex-1 relative transition-colors"
          >
            <div className={`px-4 py-3 ${activeTab === "promotions" ? "bg-white" : "bg-[#fafafa] hover:bg-[#f5f5f5]"}`}>
              <div className="flex items-center gap-3">
                <TagIcon className={`w-5 h-5 transition-colors ${activeTab === "promotions" ? "text-[#ef4444]" : "text-[#0000008a]"}`} />
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium transition-colors ${activeTab === "promotions" ? "text-[#ef4444]" : "text-[#0000008a]"}`}>
                      Promotions
                    </span>
                    <span className={`px-1.5 py-0.5 text-white text-[10px] font-medium rounded transition-colors ${activeTab === "promotions" ? "bg-[#ef4444]" : "bg-[#171717]"}`}>
                      Before
                    </span>
                  </div>
                  <span className="text-[11px] text-[#0000005e] text-left">Where Emails End Up Without MailTail</span>
                </div>
              </div>
            </div>
            {/* Active indicator */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#ef4444] rounded-t-full"
              initial={false}
              animate={{ opacity: activeTab === "promotions" ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>

        {/* Email List */}
        <div className="divide-y divide-[#edeff1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "primary" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "primary" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              {emails.map((email, index) => (
                <motion.div
                  key={`${activeTab}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`flex items-center px-3 py-2.5 hover:shadow-[inset_1px_0_0_#dadce0,inset_-1px_0_0_#dadce0,0_1px_2px_0_rgba(60,64,67,.3),0_1px_3px_1px_rgba(60,64,67,.15)] cursor-pointer transition-shadow ${
                    email.unread ? 'bg-white' : 'bg-[#fafafa]'
                  }`}
                >
                  {/* Left controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <CheckboxIcon className="w-[18px] h-[18px] text-[#5f6368]" />
                    <StarIcon className="w-5 h-5 text-[#dadce0]" />
                    <ImportantIcon className="w-4 h-4 text-[#dadce0]" />
                  </div>

                  {/* Sender */}
                  <div className={`w-28 shrink-0 ml-3 text-sm truncate ${
                    email.unread ? 'font-semibold text-[#202124]' : 'text-[#202124]'
                  }`}>
                    {email.sender}
                  </div>

                  {/* Subject & Preview */}
                  <div className="flex-1 flex items-center gap-1 min-w-0 ml-4 relative">
                    <span className={`text-sm shrink-0 ${
                      email.unread ? 'font-semibold text-[#202124]' : 'text-[#202124]'
                    }`}>
                      {email.subject}
                    </span>
                    <span className="text-sm text-[#0000008a] shrink-0 mx-1">-</span>
                    <span className="text-sm text-[#0000008a] truncate">
                      {email.preview}
                    </span>
                    {/* Gradient fade */}
                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none"
                      style={{ background: email.unread ? 'linear-gradient(to left, white, transparent)' : 'linear-gradient(to left, #fafafa, transparent)' }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom hint */}
        <div className={`px-4 py-3 text-center text-xs border-t border-[#edeff1] transition-colors ${
          activeTab === "primary" ? "bg-[#f0fdf4] text-[#22c55e]" : "bg-[#fef2f2] text-[#ef4444]"
        }`}>
          {activeTab === "primary" ? (
            <span>✨ With MailTail, your emails land where they get opened</span>
          ) : (
            <span>😔 Without MailTail, your emails get buried in Promotions</span>
          )}
        </div>
      </div>

      {/* Click hint */}
      <p className="text-center text-xs text-[#a3a3a3] mt-4">
        Click the tabs to see the difference →
      </p>
    </motion.div>
  );
}
