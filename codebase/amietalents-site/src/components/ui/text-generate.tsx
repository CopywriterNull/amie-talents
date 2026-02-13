"use client";

import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface TextGenerateProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

export function TextGenerate({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const wordsArray = words.split(" ");

  return (
    <div ref={ref} className={cn("font-bold", className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="inline-block"
          initial={{
            filter: filter ? "blur(10px)" : "none",
            opacity: 0,
            y: 5,
          }}
          animate={
            isInView
              ? {
                  filter: filter ? "blur(0px)" : "none",
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: duration,
            ease: "easeOut",
            delay: idx * 0.05,
          }}
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </div>
  );
}

interface TypewriterProps {
  words: string[];
  className?: string;
  cursorClassName?: string;
}

export function Typewriter({
  words,
  className,
  cursorClassName,
}: TypewriterProps) {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <motion.div
        className="overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "auto" }}
        transition={{
          duration: 1,
          ease: "easeOut",
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 2,
        }}
      >
        <span className="whitespace-nowrap">{words[0]}</span>
      </motion.div>
      <motion.span
        className={cn(
          "ml-1 h-full w-[2px] bg-primary",
          cursorClassName
        )}
        animate={{ opacity: [1, 0] }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GradientText({ children, className }: GradientTextProps) {
  return (
    <span
      className={cn(
        "bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient",
        className
      )}
    >
      {children}
    </span>
  );
}
