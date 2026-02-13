"use client";

import { cn } from "@/lib/utils";
import { motion, useAnimationFrame } from "framer-motion";
import { useRef, useState } from "react";

interface SparklesProps {
  children: React.ReactNode;
  className?: string;
  sparkleColor?: string;
}

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

interface Sparkle {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
  };
}

const generateSparkle = (color: string): Sparkle => ({
  id: String(random(10000, 99999)),
  createdAt: Date.now(),
  color,
  size: random(10, 20),
  style: {
    top: random(0, 100) + "%",
    left: random(0, 100) + "%",
  },
});

export function Sparkles({
  children,
  className,
  sparkleColor = "hsl(var(--primary))",
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useAnimationFrame(() => {
    if (prefersReducedMotion) return;

    const now = Date.now();
    const sparkle = generateSparkle(sparkleColor);

    const nextSparkles = sparkles.filter((sp) => {
      const delta = now - sp.createdAt;
      return delta < 1000;
    });

    if (Math.random() > 0.9) {
      nextSparkles.push(sparkle);
    }

    setSparkles(nextSparkles);
  });

  return (
    <span className={cn("relative inline-block", className)}>
      {sparkles.map((sparkle) => (
        <SparkleInstance
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}

function SparkleInstance({
  color,
  size,
  style,
}: {
  color: string;
  size: number;
  style: { top: string; left: string };
}) {
  return (
    <motion.span
      className="absolute block pointer-events-none"
      style={style}
      initial={{ scale: 0, rotate: 0 }}
      animate={{
        scale: [0, 1, 0],
        rotate: [0, 180],
      }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
          fill={color}
        />
      </svg>
    </motion.span>
  );
}
