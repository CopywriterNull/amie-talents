"use client";

import { motion, type Variants, type TargetAndTransition } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";
import { getFeaturedTalents } from "@/lib/talents";

const featuredTalent = getFeaturedTalents().slice(0, 6);

const brands = [
  { name: "Nike", domain: "nike.com" },
  { name: "Lululemon", domain: "lululemon.com" },
  { name: "Samsung", domain: "samsung.com" },
  { name: "Anthropologie", domain: "anthropologie.com" },
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

const stats = [
  { value: "8+", label: "Creators" },
  { value: "15+", label: "Brand Partners" },
  { value: "2024", label: "Founded" },
  { value: "100%", label: "Women-Led" },
];

const values = [
  {
    icon: Heart,
    title: "Relationship-First",
    description:
      "We build genuine connections with our talent and brands. No hard sells, no treating creators like inventory.",
  },
  {
    icon: Sparkles,
    title: "Authentic Matches",
    description:
      "Every partnership starts with a conversation. We match creators with brands that genuinely align with who they are.",
  },
  {
    icon: Star,
    title: "Thoughtful Growth",
    description:
      "We take the long view. Sustainable careers built on trust, creativity, and strategic collaboration.",
  },
];

// Blob SVG component
function BlobShape({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fill={color}
        d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.5,90,-16.3,88.5,-0.9C87,14.5,81.4,29,72.4,40.8C63.4,52.6,51,61.7,37.5,69.1C24,76.5,9.3,82.2,-4.8,89.1C-18.9,96,-37.8,104.1,-51.7,97.8C-65.6,91.5,-74.5,70.8,-80.2,51.7C-85.9,32.6,-88.4,15.1,-86.8,0.9C-85.2,-13.3,-79.5,-26.6,-71.2,-37.8C-62.9,-49,-52,-58.1,-39.7,-66.2C-27.4,-74.3,-13.7,-81.4,1.2,-83.5C16.1,-85.6,32.2,-82.7,44.7,-76.4Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

// Dot pattern decorative element
function DotPattern({ className }: { className?: string }) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className={className}
    >
      {Array.from({ length: 36 }).map((_, i) => (
        <circle
          key={i}
          cx={15 + (i % 6) * 20}
          cy={15 + Math.floor(i / 6) * 20}
          r="4"
          fill="currentColor"
          opacity="0.3"
        />
      ))}
    </svg>
  );
}

// Wave divider component
function WaveDivider({
  fillColor,
  className,
  variant = "smooth",
}: {
  fillColor: string;
  className?: string;
  variant?: "smooth" | "gentle" | "subtle";
}) {
  const paths = {
    smooth:
      "M0,32 C120,56 240,8 360,32 C480,56 600,8 720,32 C840,56 960,8 1080,32 C1200,56 1320,8 1440,32 L1440,80 L0,80 Z",
    gentle:
      "M0,40 C360,70 720,10 1080,40 C1260,55 1380,48 1440,40 L1440,80 L0,80 Z",
    subtle:
      "M0,45 Q360,65 720,45 T1440,45 L1440,80 L0,80 Z",
  };

  return (
    <svg
      className={`absolute bottom-0 left-0 w-full ${className ?? ""}`}
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
    >
      <path d={paths[variant]} fill={fillColor} />
    </svg>
  );
}

// Bounce animation variant
const bounceHover: TargetAndTransition = {
  scale: 1.05,
  y: -8,
  transition: { type: "spring" as const, stiffness: 300, damping: 15 },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function getBrandLogoUrl(domain: string) {
  return `https://img.logo.dev/${domain}?token=pk_B2gV_nbBRuSh3HU-PCn3zw&size=64&format=png`;
}

export default function V1Page() {
  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-[#FAF0E6] py-24 md:py-36 lg:py-44 overflow-hidden">
        {/* Background blobs */}
        <BlobShape
          className="absolute -top-20 -left-20 w-[500px] h-[500px] opacity-20 pointer-events-none"
          color="#EC008C"
        />
        <BlobShape
          className="absolute -bottom-32 -right-20 w-[600px] h-[600px] opacity-15 pointer-events-none"
          color="#E8673C"
        />
        <DotPattern className="absolute top-12 right-12 text-[#EC008C] opacity-40 hidden lg:block" />
        <DotPattern className="absolute bottom-16 left-16 text-[#E8673C] opacity-30 hidden lg:block" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Pill badges */}
              <div className="flex justify-center gap-3 mb-8">
                <motion.span
                  className="inline-block bg-gradient-to-r from-[#EC008C] to-[#E8673C] text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg"
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Women-Led
                </motion.span>
                <motion.span
                  className="inline-block bg-white text-[#E8673C] text-sm font-semibold px-5 py-2 rounded-full shadow-lg border-2 border-[#E8673C]/20"
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  LA Based
                </motion.span>
              </div>

              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] mb-6">
                <span className="block bg-gradient-to-r from-[#EC008C] via-[#E8673C] to-[#EC008C] bg-clip-text text-transparent">
                  Amie
                </span>
                <span className="block text-[#2D2D2D]">
                  Talents
                </span>
              </h1>
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-[#2D2D2D]/70 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              A talent management agency built on connection, trust, and
              thoughtful growth. We match incredible creators with brands that
              genuinely align.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div whileHover={bounceHover}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#EC008C] to-[#E8673C] text-white font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Work With Us
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={bounceHover}>
                <Link
                  href="/talent"
                  className="inline-flex items-center gap-2 bg-white text-[#E8673C] font-bold text-lg px-10 py-4 rounded-full shadow-lg border-[3px] border-[#E8673C]/30 hover:border-[#E8673C]/60 transition-colors"
                >
                  Meet the Talent
                  <Sparkles className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave */}
        <WaveDivider fillColor="#FFF0F5" variant="gentle" />
      </section>

      {/* ===== BRAND LOGOS SECTION ===== */}
      <section className="bg-[#FFF0F5] py-16 md:py-20 relative overflow-hidden">
        <DotPattern className="absolute top-4 left-4 text-[#EC008C] opacity-20" />
        <div className="container mx-auto px-4 md:px-6">
          <motion.p
            className="text-center text-sm font-semibold tracking-widest uppercase text-[#EC008C] mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Trusted by amazing brands
          </motion.p>

          {/* Scrolling marquee with fade edges */}
          <div className="relative overflow-hidden">
            {/* Left fade mask */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#FFF0F5] to-transparent z-10 pointer-events-none" />
            {/* Right fade mask */}
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#FFF0F5] to-transparent z-10 pointer-events-none" />

            <div
              className="flex gap-12 md:gap-16 items-center w-max"
              style={{ animation: "marquee 30s linear infinite" }}
            >
              {[...brands, ...brands].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="flex flex-col items-center gap-2 shrink-0"
                >
                  <img
                    src={getBrandLogoUrl(brand.domain)}
                    alt={brand.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                  />
                  <span
                    className="text-sm font-medium whitespace-nowrap text-[#2D2D2D]/40"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <WaveDivider fillColor="#EC008C" variant="smooth" />
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="bg-[#EC008C] py-16 md:py-24 relative overflow-hidden">
        <BlobShape
          className="absolute -top-20 -right-20 w-[400px] h-[400px] opacity-10 pointer-events-none"
          color="#ffffff"
        />
        <BlobShape
          className="absolute -bottom-20 -left-20 w-[300px] h-[300px] opacity-10 pointer-events-none"
          color="#E8673C"
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="text-center"
                variants={staggerItem}
              >
                <motion.span
                  className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white block leading-none"
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 12,
                    delay: 0.1,
                  }}
                >
                  {stat.value}
                </motion.span>
                <span className="text-white/80 text-sm md:text-base font-semibold uppercase tracking-wider mt-2 block">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom wave */}
        <WaveDivider fillColor="#FAF0E6" variant="gentle" />
      </section>

      {/* ===== TALENT SHOWCASE ===== */}
      <section className="bg-[#FAF0E6] py-20 md:py-28 relative">
        <BlobShape
          className="absolute top-0 right-0 w-[400px] h-[400px] opacity-10 pointer-events-none"
          color="#EC008C"
        />

        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block bg-[#EC008C]/10 text-[#EC008C] text-sm font-bold px-4 py-1.5 rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Creators
            </motion.span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D] mb-4">
              Meet the{" "}
              <span className="bg-gradient-to-r from-[#EC008C] to-[#E8673C] bg-clip-text text-transparent">
                talent
              </span>
            </h2>
            <p
              className="text-[#2D2D2D]/60 text-lg max-w-lg mx-auto"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              The incredible creators we are proud to represent.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredTalent.map((talent) => (
              <motion.div key={talent.id} variants={staggerItem}>
                <motion.div
                  className="bg-white rounded-3xl overflow-hidden border-4 border-[#FAF0E6] shadow-lg hover:shadow-2xl transition-shadow group cursor-pointer"
                  whileHover={bounceHover}
                >
                  <Link href={`/talent/${talent.id}`}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={talent.image}
                        alt={talent.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      {/* Category pill */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-[#EC008C] to-[#E8673C] text-white text-xs font-bold px-3 py-1 rounded-full">
                          {talent.categories[0]}
                        </span>
                      </div>
                      {/* Decorative circles */}
                      <div className="absolute top-4 right-4 flex gap-1">
                        <span className="w-3 h-3 rounded-full bg-[#EC008C] opacity-60" />
                        <span className="w-3 h-3 rounded-full bg-[#E8673C] opacity-60" />
                        <span className="w-3 h-3 rounded-full bg-white opacity-60" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3
                        className="text-2xl font-bold text-[#2D2D2D] mb-1"
                        style={{
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {talent.name}
                      </h3>
                      <p className="text-[#EC008C] font-medium text-sm mb-2">
                        {talent.handle}
                      </p>
                      <p className="text-[#2D2D2D]/60 text-sm line-clamp-2">
                        {talent.bio}
                      </p>
                      {/* Category tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {talent.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs bg-[#FFF0F5] text-[#EC008C] px-2.5 py-1 rounded-full font-medium"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={bounceHover}>
              <Link
                href="/talent"
                className="inline-flex items-center gap-2 bg-white text-[#E8673C] font-bold text-base px-8 py-3 rounded-full shadow-md border-2 border-[#E8673C]/20 hover:border-[#E8673C]/50 transition-colors"
              >
                View All Creators
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <WaveDivider fillColor="white" variant="smooth" />
      </section>

      {/* ===== VALUES / ABOUT SECTION ===== */}
      <section className="bg-white py-20 md:py-28 relative overflow-hidden">
        <BlobShape
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-10 pointer-events-none"
          color="#E8673C"
        />
        <DotPattern className="absolute bottom-8 right-8 text-[#E8673C] opacity-20 hidden lg:block" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="inline-block bg-[#E8673C]/10 text-[#E8673C] text-sm font-bold px-4 py-1.5 rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Our Values
            </motion.span>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-[#2D2D2D]">
              How we{" "}
              <span className="bg-gradient-to-r from-[#E8673C] to-[#EC008C] bg-clip-text text-transparent">
                work
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                variants={staggerItem}
                custom={i}
              >
                <motion.div
                  className="bg-[#FAF0E6] rounded-3xl p-8 text-center border-4 border-[#FAF0E6] hover:border-[#EC008C]/30 transition-colors h-full"
                  whileHover={{ ...bounceHover, y: -12 } as TargetAndTransition}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#EC008C] to-[#E8673C] flex items-center justify-center mx-auto mb-6 shadow-lg"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3
                    className="text-2xl font-bold text-[#2D2D2D] mb-3"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                    }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-[#2D2D2D]/60 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Pull-quote */}
          <motion.div
            className="max-w-2xl mx-auto text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#EC008C] to-[#E8673C] bg-clip-text text-transparent leading-snug">
              &ldquo;Collaborative, not transactional.&rdquo;
            </p>
          </motion.div>
        </div>

        {/* Wave to next section */}
        <WaveDivider fillColor="#FFF0F5" variant="subtle" />
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="bg-[#FFF0F5] py-20 md:py-28 relative overflow-hidden">
        <BlobShape
          className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-15 pointer-events-none"
          color="#EC008C"
        />
        <BlobShape
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] opacity-10 pointer-events-none"
          color="#E8673C"
        />
        <DotPattern className="absolute top-8 left-8 text-[#EC008C] opacity-25 hidden lg:block" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            className="bg-gradient-to-br from-[#EC008C] to-[#E8673C] rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 lg:p-20 text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Decorative circles inside CTA */}
            <div className="absolute top-6 left-6 flex gap-2 opacity-30">
              <span className="w-4 h-4 rounded-full bg-white" />
              <span className="w-4 h-4 rounded-full bg-white" />
              <span className="w-4 h-4 rounded-full bg-white" />
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2 opacity-30">
              <span className="w-6 h-6 rounded-full bg-white" />
              <span className="w-4 h-4 rounded-full bg-white" />
              <span className="w-3 h-3 rounded-full bg-white" />
            </div>

            {/* Large inline SVG sparkle */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              className="mx-auto mb-6 opacity-80"
            >
              <path
                d="M30 0 L33 25 L60 30 L33 35 L30 60 L27 35 L0 30 L27 25 Z"
                fill="white"
              />
            </svg>

            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Let&apos;s create
              <br />
              something{" "}
              <span
                className="italic"
                style={{ fontFamily: "'Genty', cursive" }}
              >
                amazing
              </span>
            </h2>
            <p
              className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Whether you&apos;re a brand looking for the right creator or a
              creator ready for thoughtful representation — we&apos;d love to
              hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={bounceHover}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-white text-[#EC008C] font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow"
                >
                  Get in Touch
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={bounceHover}>
                <Link
                  href="/talent"
                  className="inline-flex items-center gap-2 bg-transparent text-white font-bold text-lg px-10 py-4 rounded-full border-2 border-white/40 hover:border-white/80 transition-colors"
                >
                  Browse Talent
                  <Heart className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
