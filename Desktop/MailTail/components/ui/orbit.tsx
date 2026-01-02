"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrbitProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  children?: React.ReactNode;
  dashed?: boolean;
}

export function Orbit({
  className,
  size = 200,
  duration = 20,
  delay = 0,
  reverse = false,
  children,
  dashed = false,
}: OrbitProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      {/* Orbit ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-full border border-[#e5e5e5]",
          dashed && "border-dashed"
        )}
      />
      {/* Orbiting element */}
      <motion.div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          marginLeft: -size / 2,
          marginTop: -12,
        }}
        animate={{
          rotate: reverse ? -360 : 360,
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          delay,
        }}
      >
        <div
          style={{
            width: size,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}

interface OrbitingIconProps {
  icon: React.ReactNode;
  className?: string;
  size?: number;
}

export function OrbitingIcon({ icon, className, size = 24 }: OrbitingIconProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-white border border-[#e5e5e5] shadow-sm",
        className
      )}
      style={{ width: size, height: size }}
    >
      {icon}
    </div>
  );
}

interface OrbitSystemProps {
  className?: string;
  centerIcon?: React.ReactNode;
  orbits?: {
    size: number;
    duration: number;
    delay?: number;
    reverse?: boolean;
    dashed?: boolean;
    icon: React.ReactNode;
    iconSize?: number;
  }[];
}

export function OrbitSystem({ className, centerIcon, orbits = [] }: OrbitSystemProps) {
  const maxSize = Math.max(...orbits.map((o) => o.size), 0);

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: maxSize, height: maxSize }}
    >
      {/* Center icon */}
      {centerIcon && (
        <div className="absolute z-10 flex items-center justify-center">
          {centerIcon}
        </div>
      )}

      {/* Orbits */}
      {orbits.map((orbit, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            width: orbit.size,
            height: orbit.size,
          }}
        >
          <Orbit
            size={orbit.size}
            duration={orbit.duration}
            delay={orbit.delay}
            reverse={orbit.reverse}
            dashed={orbit.dashed}
          >
            <OrbitingIcon icon={orbit.icon} size={orbit.iconSize || 32} />
          </Orbit>
        </div>
      ))}
    </div>
  );
}
