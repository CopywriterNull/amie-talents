"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HoverCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white transition-all duration-300",
        isHovered ? "border-[#171717]/20 shadow-lg" : "border-[#e5e5e5]",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient follow cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(23, 23, 23, 0.06), transparent 40%)`,
        }}
      />

      {/* Shine effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.8) 45%, transparent 50%)`,
          backgroundSize: "200% 100%",
        }}
        animate={isHovered ? { backgroundPosition: ["200% 0", "-200% 0"] } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {children}
    </motion.div>
  );
};

export const HoverCardGrid = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("grid gap-4", className)}>
      {children}
    </div>
  );
};
