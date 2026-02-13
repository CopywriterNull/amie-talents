"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

interface GlassCardProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  rotationIntensity?: number;
}

export function GlassCard({
  children,
  className,
  containerClassName,
  rotationIntensity = 10,
}: GlassCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${rotationIntensity}deg`, `-${rotationIntensity}deg`]
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${rotationIntensity}deg`, `${rotationIntensity}deg`]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className={cn("perspective-1000", containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl",
          "dark:bg-black/10 dark:border-white/10",
          "transition-shadow duration-300 hover:shadow-2xl",
          className
        )}
      >
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"
          style={{ transform: "translateZ(0)" }}
        />
        {children}
      </motion.div>
    </div>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl",
        "dark:bg-black/20 dark:border-white/10",
        "shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
