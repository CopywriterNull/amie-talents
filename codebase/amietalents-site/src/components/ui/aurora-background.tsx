"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col min-h-screen items-center justify-center bg-background text-foreground transition-bg overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grayscale aurora effect */}
        <div
          className={cn(
            `
            [--aurora:repeating-linear-gradient(100deg,#f5f5f5_10%,#e5e5e5_15%,#d4d4d4_20%,#e5e5e5_25%,#f5f5f5_30%)]
            dark:[--aurora:repeating-linear-gradient(100deg,#262626_10%,#404040_15%,#525252_20%,#404040_25%,#262626_30%)]
            [background-image:var(--aurora)]
            [background-size:300%_300%]
            [background-position:50%_50%]
            filter blur-[100px]
            after:content-[''] after:absolute after:inset-0
            after:[background-image:var(--aurora)]
            after:[background-size:200%_200%]
            after:animate-aurora after:[background-attachment:fixed]
            after:mix-blend-soft-light
            pointer-events-none
            absolute -inset-[10px] opacity-60
            will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
          )}
        />
        {/* Additional subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-background/50 to-background pointer-events-none" />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
