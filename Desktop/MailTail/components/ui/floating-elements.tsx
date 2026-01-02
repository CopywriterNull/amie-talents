"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCardProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  rotate?: number;
}

export function FloatingCard({
  className,
  children,
  delay = 0,
  duration = 4,
  y = 10,
  rotate = 2,
}: FloatingCardProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -y, 0],
        rotate: [-rotate, rotate, -rotate],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: duration * 1.5, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      {children}
    </motion.div>
  );
}

interface FloatingMailCardProps {
  className?: string;
}

export function FloatingMailCard({ className }: FloatingMailCardProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Main email card */}
      <FloatingCard
        className="relative z-10"
        delay={0}
        duration={5}
        y={8}
        rotate={1}
      >
        <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-xl p-4 w-64">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white text-xs font-semibold">
              YB
            </div>
            <div>
              <div className="text-sm font-medium">Your Brand</div>
              <div className="text-[10px] text-[#a3a3a3]">newsletter@brand.com</div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-[#f5f5f5] rounded-full w-full" />
            <div className="h-2 bg-[#f5f5f5] rounded-full w-3/4" />
            <div className="h-2 bg-[#f5f5f5] rounded-full w-5/6" />
          </div>
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-dashed border-[#e5e5e5]">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"
            />
            <span className="text-[9px] text-[#22c55e] font-medium">MailTail footer active</span>
          </div>
        </div>
      </FloatingCard>

      {/* Floating badge - Primary */}
      <FloatingCard
        className="absolute -top-4 -right-4 z-20"
        delay={0.2}
        duration={4}
        y={6}
        rotate={3}
      >
        <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-lg px-3 py-1.5 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
          <span className="text-[10px] font-semibold text-[#171717]">Primary</span>
        </div>
      </FloatingCard>

      {/* Floating badge - Check mark */}
      <FloatingCard
        className="absolute -bottom-2 -left-6 z-20"
        delay={0.4}
        duration={4.5}
        y={5}
        rotate={4}
      >
        <div className="bg-[#22c55e] rounded-full p-1.5 shadow-lg">
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </FloatingCard>

      {/* Floating badge - Open rate */}
      <FloatingCard
        className="absolute top-1/2 -left-16 z-20"
        delay={0.6}
        duration={5}
        y={7}
        rotate={2}
      >
        <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-lg px-2.5 py-1.5">
          <div className="text-[8px] text-[#737373] uppercase tracking-wider">Open Rate</div>
          <div className="text-sm font-bold text-[#22c55e]">+42%</div>
        </div>
      </FloatingCard>

      {/* Floating badge - Delivered */}
      <FloatingCard
        className="absolute bottom-8 -right-12 z-20"
        delay={0.8}
        duration={4.2}
        y={6}
        rotate={3}
      >
        <div className="bg-white rounded-lg border border-[#e5e5e5] shadow-lg px-2.5 py-1.5 flex items-center gap-1.5">
          <svg className="w-3 h-3 text-[#22c55e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span className="text-[10px] font-medium">Delivered</span>
        </div>
      </FloatingCard>

      {/* Floating sparkle */}
      <motion.div
        className="absolute -top-8 left-4 z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg className="w-4 h-4 text-[#22c55e]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>

      {/* Another sparkle */}
      <motion.div
        className="absolute bottom-0 right-0 z-0"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <svg className="w-3 h-3 text-[#22c55e]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </motion.div>
    </div>
  );
}

interface SmartFooterCardProps {
  className?: string;
}

export function SmartFooterCard({ className }: SmartFooterCardProps) {
  return (
    <FloatingCard
      className={cn(className)}
      delay={0.3}
      duration={4.5}
      y={6}
      rotate={2}
    >
      <div className="bg-white rounded-xl border border-[#e5e5e5] shadow-lg p-4 w-56">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-[#171717] flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span className="text-xs font-semibold">Smart Footer Tech</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#737373]">Signal strength</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-[#22c55e] rounded-full"
                  initial={{ height: 4 }}
                  animate={{ height: [4, 4 + i * 2, 4] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#737373]">Inbox score</span>
            <span className="text-[10px] font-semibold text-[#22c55e]">98/100</span>
          </div>
        </div>
      </div>
    </FloatingCard>
  );
}
