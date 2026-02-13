"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Play, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// HERO 1: Editorial (IMG Models Inspired)
// Large typography, full-bleed imagery, minimal UI
// ============================================
export function HeroEditorial() {
  return (
    <section className="h-screen relative overflow-hidden bg-white">
      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1920&h=1080&fit=crop&q=90"
          alt="Featured talent"
          fill
          className="object-cover grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-12">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] uppercase text-neutral-500"
          >
            Talent Management
          </motion.p>
        </div>

        {/* Main headline - editorial style */}
        <div className="container mx-auto px-6 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-light leading-[0.9] tracking-tight text-black max-w-4xl"
          >
            We represent
            <br />
            <span className="italic font-normal">exceptional</span>
            <br />
            creators
          </motion.h1>
        </div>

        {/* Bottom bar */}
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-12"
            >
              <Link
                href="/talent"
                className="group flex items-center gap-2 text-sm font-medium"
              >
                View Roster
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="group flex items-center gap-2 text-sm font-medium"
              >
                Work With Us
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="hidden md:flex items-center gap-2 text-xs text-neutral-400"
            >
              <span>Scroll</span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Vertical text accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 [writing-mode:vertical-rl] rotate-180">
          Los Angeles — New York — Miami
        </p>
      </motion.div>
    </section>
  );
}

// ============================================
// HERO 2: Grid Gallery (Kith/Revolve Inspired)
// Clean creator grid, modern e-commerce feel
// ============================================
export function HeroGrid() {
  const creators = [
    { name: "Sarah Chen", handle: "@sarahchen", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop" },
    { name: "Marcus Cole", handle: "@marcuscole", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop" },
    { name: "Ava Kim", handle: "@avakim", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop" },
    { name: "James Wright", handle: "@jameswright", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop" },
  ];

  return (
    <section className="min-h-screen bg-neutral-50 py-20 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs tracking-[0.2em] uppercase text-neutral-400 mb-6"
          >
            Amie Talents
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-8"
          >
            A curated roster of
            <br />
            <span className="text-neutral-400">today&apos;s most influential</span>
            <br />
            creators.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6"
          >
            <Button variant="default" size="lg" className="rounded-none bg-black text-white hover:bg-neutral-800" asChild>
              <Link href="/talent">
                Explore Talent
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-none border-black" asChild>
              <Link href="/contact">Partner With Us</Link>
            </Button>
          </motion.div>
        </div>

        {/* Creator Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {creators.map((creator, i) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-200 mb-4">
                <Image
                  src={creator.image}
                  alt={creator.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{creator.name}</p>
                  <p className="text-xs text-neutral-400">{creator.handle}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            href="/talent"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          >
            View All Talent
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HERO 3: Magazine Spread
// Asymmetric layout, editorial typography
// ============================================
export function HeroMagazine() {
  return (
    <section className="min-h-screen bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left column - Main image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[3/4] relative">
              <Image
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop"
                alt="Featured creator"
                fill
                className="object-cover grayscale"
              />
            </div>
            {/* Caption */}
            <div className="mt-4 flex justify-between text-xs text-neutral-400">
              <span>Sarah Chen</span>
              <span>Issue 01 / 2024</span>
            </div>
          </motion.div>

          {/* Right column - Content + smaller images */}
          <div className="lg:col-span-7 lg:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {/* Eyebrow */}
              <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-8">
                Talent Agency
              </p>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tight mb-8">
                Where
                <br />
                <em className="font-serif not-italic">influence</em>
                <br />
                meets artistry.
              </h1>

              {/* Body */}
              <p className="text-lg text-neutral-500 max-w-md mb-12 leading-relaxed">
                We partner with creators who shape culture. Strategic representation for the digital age.
              </p>

              {/* CTA */}
              <div className="flex items-center gap-8 mb-16">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 text-sm font-medium border-b border-black pb-1 hover:gap-4 transition-all"
                >
                  Inquire
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/talent"
                  className="text-sm text-neutral-400 hover:text-black transition-colors"
                >
                  View Roster
                </Link>
              </div>
            </motion.div>

            {/* Secondary images */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="aspect-[4/5] relative">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop"
                  alt="Creator"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="aspect-[4/5] relative mt-12">
                <Image
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=600&fit=crop"
                  alt="Creator"
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-20 pt-8 border-t border-neutral-200"
        >
          <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
            {[
              { value: "50+", label: "Creators" },
              { value: "500M+", label: "Combined Reach" },
              { value: "200+", label: "Brand Partners" },
              { value: "98%", label: "Retention Rate" },
              { value: "12", label: "Countries" },
              { value: "2019", label: "Founded" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-light">{stat.value}</p>
                <p className="text-xs text-neutral-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// HERO 4: Modern Agency
// Professional, sophisticated, trust-building
// ============================================
export function HeroAgency() {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="min-h-screen bg-black text-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 min-h-screen items-center py-20">
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8"
            >
              Est. 2019 — Los Angeles
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.1] tracking-tight mb-8"
            >
              Strategic talent
              <br />
              management for
              <br />
              <span className="text-neutral-500">the modern creator.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-400 text-lg max-w-md mb-12 leading-relaxed"
            >
              We build lasting careers through authentic partnerships, strategic positioning, and relentless advocacy for our talent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <Button
                size="lg"
                className="rounded-none bg-white text-black hover:bg-neutral-200"
                asChild
              >
                <Link href="/contact">
                  Start a Conversation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-none border-neutral-700 text-white hover:bg-neutral-900"
                asChild
              >
                <Link href="/talent">View Talent</Link>
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-8 border-t border-neutral-800"
            >
              <p className="text-xs text-neutral-600 mb-4">Trusted by</p>
              <div className="flex gap-8 text-sm text-neutral-500">
                {["Nike", "Apple", "Google", "Netflix", "Amazon"].map((brand) => (
                  <span key={brand} className="hover:text-white transition-colors cursor-default">
                    {brand}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right - Image carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeIndex]}
                    alt="Featured talent"
                    fill
                    className="object-cover grayscale"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Image indicators */}
            <div className="absolute bottom-6 left-6 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "h-0.5 transition-all duration-300",
                    activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/30"
                  )}
                />
              ))}
            </div>

            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-6 -left-6 md:left-auto md:-right-6 bg-neutral-900 border border-neutral-800 p-6"
            >
              <p className="text-3xl font-light">500M+</p>
              <p className="text-xs text-neutral-500 mt-1">Combined Reach</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// Export all hero variants
// ============================================
export const heroVariants = {
  editorial: HeroEditorial,
  grid: HeroGrid,
  magazine: HeroMagazine,
  agency: HeroAgency,
};
