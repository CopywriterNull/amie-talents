"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Sparkle {
  id: string;
  x: string;
  y: string;
  size: number;
  delay: number;
}

const generateSparkle = (): Sparkle => ({
  id: Math.random().toString(36).substr(2, 9),
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: Math.random() * 10 + 5,
  delay: Math.random() * 0.5,
});

export const SparklesCore = ({
  className,
  particleCount = 20,
  particleColor = "#FFC700",
  minSize = 4,
  maxSize = 8,
}: {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  minSize?: number;
  maxSize?: number;
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const initialSparkles = Array.from({ length: particleCount }, generateSparkle);
    setSparkles(initialSparkles);

    const interval = setInterval(() => {
      setSparkles((prev) => {
        const newSparkles = [...prev];
        const indexToReplace = Math.floor(Math.random() * newSparkles.length);
        newSparkles[indexToReplace] = generateSparkle();
        return newSparkles;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [particleCount]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.span
            key={sparkle.id}
            className="absolute block rounded-full"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: Math.random() * (maxSize - minSize) + minSize,
              height: Math.random() * (maxSize - minSize) + minSize,
              backgroundColor: particleColor,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: sparkle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export const Sparkles = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span className={cn("relative inline-block", className)} {...props}>
      <SparklesCore
        particleCount={10}
        particleColor="#22c55e"
        minSize={3}
        maxSize={6}
      />
      {children}
    </span>
  );
};
