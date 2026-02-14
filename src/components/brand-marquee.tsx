"use client";

import { motion } from "framer-motion";

const LOGO_TOKEN = "pk_B2gV_nbBRuSh3HU-PCn3zw";

const brandsRow1 = [
  { name: "Nike", domain: "nike.com" },
  { name: "Samsung", domain: "samsung.com" },
  { name: "Lululemon", domain: "lululemon.com" },
  { name: "Target", domain: "target.com" },
  { name: "Notion", domain: "notion.so" },
  { name: "Logitech", domain: "logitech.com" },
  { name: "Dell", domain: "dell.com" },
  { name: "Anker", domain: "anker.com" },
];

const brandsRow2 = [
  { name: "Anthropologie", domain: "anthropologie.com" },
  { name: "Reformation", domain: "thereformation.com" },
  { name: "Everlane", domain: "everlane.com" },
  { name: "Casper", domain: "casper.com" },
  { name: "Gymshark", domain: "gymshark.com" },
  { name: "Ganni", domain: "ganni.com" },
  { name: "Therabody", domain: "therabody.com" },
];

interface BrandMarqueeProps {
  className?: string;
}

function BrandPill({ name, domain }: { name: string; domain: string }) {
  return (
    <span className="whitespace-nowrap bg-white border border-border/60 rounded-full pl-3 pr-5 py-2.5 flex items-center gap-2.5 text-sm font-semibold text-foreground/80 shadow-sm flex-shrink-0">
      <img
        src={`https://img.logo.dev/${domain}?token=${LOGO_TOKEN}&size=64&format=png`}
        alt={name}
        width={28}
        height={28}
        className="w-7 h-7 rounded-full object-contain"
      />
      {name}
    </span>
  );
}

export function BrandMarquee({ className }: BrandMarqueeProps) {
  const doubled1 = [...brandsRow1, ...brandsRow1];
  const doubled2 = [...brandsRow2, ...brandsRow2];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="text-center mb-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Trusted by Leading Brands
        </p>
      </div>
      <div className="relative space-y-3">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Row 1: scrolls left */}
        <motion.div
          className="flex gap-3 items-center"
          animate={{
            x: [0, -56 * brandsRow1.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {doubled1.map((brand, index) => (
            <BrandPill key={`r1-${brand.name}-${index}`} name={brand.name} domain={brand.domain} />
          ))}
        </motion.div>

        {/* Row 2: scrolls right (reverse) */}
        <motion.div
          className="flex gap-3 items-center"
          animate={{
            x: [-56 * brandsRow2.length, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 28,
              ease: "linear",
            },
          }}
        >
          {doubled2.map((brand, index) => (
            <BrandPill key={`r2-${brand.name}-${index}`} name={brand.name} domain={brand.domain} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
