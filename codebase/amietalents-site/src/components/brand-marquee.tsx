"use client";

import { motion } from "framer-motion";

const LOGO_TOKEN = "pk_B2gV_nbBRuSh3HU-PCn3zw";

const brands = [
  { name: "Nike", domain: "nike.com" },
  { name: "Anthropologie", domain: "anthropologie.com" },
  { name: "Lululemon", domain: "lululemon.com" },
  { name: "Samsung", domain: "samsung.com" },
  { name: "Reformation", domain: "thereformation.com" },
  { name: "Target", domain: "target.com" },
  { name: "Everlane", domain: "everlane.com" },
  { name: "Notion", domain: "notion.so" },
  { name: "Casper", domain: "casper.com" },
  { name: "Gymshark", domain: "gymshark.com" },
  { name: "Logitech", domain: "logitech.com" },
  { name: "Dell", domain: "dell.com" },
  { name: "Ganni", domain: "ganni.com" },
  { name: "Therabody", domain: "therabody.com" },
  { name: "Anker", domain: "anker.com" },
];

interface BrandMarqueeProps {
  className?: string;
}

export function BrandMarquee({ className }: BrandMarqueeProps) {
  // Double the brands for seamless loop
  const doubledBrands = [...brands, ...brands];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="text-center mb-8">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Trusted by Leading Brands
        </p>
      </div>
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-12 items-center"
          animate={{
            x: [0, -50 * brands.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {doubledBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 px-6 py-3 flex items-center gap-3"
            >
              <img
                src={`https://img.logo.dev/${brand.domain}?token=${LOGO_TOKEN}&size=64&format=png`}
                alt={brand.name}
                width={32}
                height={32}
                className="object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
              <span className="text-lg font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
