"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getFeaturedTalents } from "@/lib/talents";

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

const navLinks = [
  { label: "Roster", href: "/team" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const footerSocials = [
  { label: "Instagram", href: "https://instagram.com/amietalents" },
  { label: "TikTok", href: "https://tiktok.com/@amietalents" },
  { label: "Email", href: "mailto:info@amietalents.com" },
];

function getLogoUrl(domain: string) {
  return `https://img.logo.dev/${domain}?token=pk_B2gV_nbBRuSh3HU-PCn3zw&size=64&format=png`;
}

const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.8 },
};

export default function V6Page() {
  const featured = getFeaturedTalents().slice(0, 4);
  const [menuOpen, setMenuOpen] = useState(false);

  // Use erica.jpg for the hero instead of helen.jpg to avoid reusing Helen's image
  // (Helen appears as the first featured talent in the grid below)
  const heroTalent = getFeaturedTalents().find((t) => t.id === "erica");

  return (
    <div
      className="min-h-screen bg-[#FAF0E6] text-black overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* ========== VERTICAL SIDE TEXT ========== */}
      <div className="hidden lg:block fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-black/30"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Amie Talents &mdash; Los Angeles
        </span>
      </div>
      <div className="hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-50">
        <span
          className="text-[10px] uppercase tracking-[0.3em] text-black/30"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Talent Management &mdash; Est. 2024
        </span>
      </div>

      {/* ========== NAV ========== */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-8 border-b border-black/10 relative"
      >
        <span
          className="text-2xl text-black"
          style={{ fontFamily: '"Genty", cursive' }}
        >
          amie
        </span>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-black" />
          ) : (
            <Menu className="w-5 h-5 text-black" />
          )}
        </button>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-[#FAF0E6] border-b border-black/10 z-50 md:hidden"
            >
              <div className="flex flex-col px-8 py-6 gap-5">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-xs uppercase tracking-[0.2em] text-black/60 hover:text-black transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ========== HERO -- SPLIT LAYOUT ========== */}
      <section className="border-b border-black/10">
        <div className="flex flex-col lg:flex-row">
          {/* Left side -- 60% */}
          <div className="lg:w-[60%] px-8 md:px-16 lg:px-24 py-16 lg:py-32 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-2">
                Vol. 01 &mdash; Spring 2024
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-6">
                01 &mdash; Introduction
              </p>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-8"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                <span className="italic">Where</span>{" "}
                <span className="not-italic">talent</span>
                <br />
                <span className="not-italic">meets</span>{" "}
                <span className="italic text-[#E8673C]">vision</span>
              </h1>
              <div className="w-16 h-[1px] bg-[#E8673C] mb-8" />
              <p className="text-black/50 text-lg max-w-md leading-relaxed mb-10">
                A women-led talent management agency in Los Angeles, shaping the
                future of creator partnerships.
              </p>
              <Link
                href="/contact"
                className="inline-block border border-black px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Inquire
              </Link>
            </motion.div>
          </div>

          {/* Right side -- 40% with large image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="lg:w-[40%] relative min-h-[400px] lg:min-h-[600px] bg-black/5"
          >
            <Image
              src={heroTalent?.image ?? "/talent/erica.jpg"}
              alt="Featured talent"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/50">
                Featured
              </p>
              <p
                className="text-sm italic"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                {heroTalent?.name ?? "Erica"} &mdash;{" "}
                {heroTalent?.categories.join(" & ") ??
                  "Fashion, Beauty & Lifestyle"}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== BRANDS ========== */}
      <section className="py-16 px-8 md:px-16 lg:px-24 border-b border-black/10">
        <motion.div {...fadeIn}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-10 text-center">
            02 &mdash; Select Partners
          </p>
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className={`flex flex-col items-center gap-3 px-6 md:px-8 py-5 ${
                  i < brands.length - 1 ? "border-r border-black/10" : ""
                }`}
              >
                <img
                  src={getLogoUrl(brand.domain)}
                  alt={brand.name}
                  width={32}
                  height={32}
                  className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <span className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                  {brand.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ========== TALENT / EDITORIAL GRID ========== */}
      <section className="py-20 px-8 md:px-16 lg:px-24 border-b border-black/10">
        <motion.div {...fadeIn}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-4">
            03 &mdash; The Roster
          </p>
          <h2
            className="text-4xl md:text-6xl italic mb-16"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Our creators
          </h2>
        </motion.div>

        {/* Editorial grid -- 1 large feature + 3 smaller */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-black/10">
          {/* Large feature -- first talent */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 lg:row-span-2 bg-[#FAF0E6] relative group"
          >
            <div className="flex flex-col lg:flex-row h-full">
              <div className="lg:w-1/2 relative min-h-[350px] lg:min-h-full">
                <Image
                  src={featured[0].image}
                  alt={featured[0].name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-4">
                  Featured Creator
                </p>
                <h3
                  className="text-4xl lg:text-5xl italic mb-4"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {featured[0].name}
                </h3>
                <p className="text-black/40 text-sm mb-4">
                  {featured[0].handle}
                </p>
                <div className="w-10 h-[1px] bg-[#E8673C] mb-4" />

                {/* Pull quote */}
                <blockquote
                  className="text-xl italic text-black/70 leading-relaxed mb-6"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  &ldquo;{featured[0].bio}&rdquo;
                </blockquote>

                <div className="flex gap-2 flex-wrap mb-6">
                  {featured[0].categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[10px] uppercase tracking-[0.2em] border border-black/20 px-3 py-1"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/talent/${featured[0].id}`}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#E8673C] hover:text-black transition-colors"
                >
                  View Profile &rarr;
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Smaller cards -- remaining 3 */}
          {featured.slice(1).map((talent, i) => (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className="bg-[#FAF0E6] group"
            >
              <div className="relative h-64 lg:h-56">
                <Image
                  src={talent.image}
                  alt={talent.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3
                    className="text-2xl italic"
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", serif',
                    }}
                  >
                    {talent.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-black/40">
                    {talent.handle}
                  </span>
                </div>
                <div className="w-8 h-[0.5px] bg-[#E8673C] mb-3" />
                <div className="flex gap-2 flex-wrap mb-3">
                  {talent.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[9px] uppercase tracking-[0.2em] text-black/40"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/talent/${talent.id}`}
                  className="text-[10px] uppercase tracking-[0.2em] text-[#E8673C] hover:text-black transition-colors"
                >
                  Profile &rarr;
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/talent"
            className="inline-block border border-black px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
          >
            View Full Roster
          </Link>
        </motion.div>
      </section>

      {/* ========== VALUES / ABOUT ========== */}
      <section className="py-20 px-8 md:px-16 lg:px-24 border-b border-black/10">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeIn}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-4">
              04 &mdash; Philosophy
            </p>
            <h2
              className="text-4xl md:text-6xl italic mb-6"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              What we <span className="text-[#E8673C]">believe</span>
            </h2>
            <div className="w-16 h-[1px] bg-black/20 mb-16" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/10">
            {[
              {
                num: "01",
                title: "Authenticity",
                desc: "We champion creators who bring their genuine selves to every collaboration. Real stories resonate.",
              },
              {
                num: "02",
                title: "Partnership",
                desc: "More than management \u2014 we build lasting relationships between creators and brands that share their values.",
              },
              {
                num: "03",
                title: "Empowerment",
                desc: "Women-led and purpose-driven. We elevate voices that deserve to be heard on the world\u2019s biggest stages.",
              },
            ].map((value, i) => (
              <motion.div
                key={value.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className={`p-10 ${
                  i < 2
                    ? "md:border-r border-b md:border-b-0 border-black/10"
                    : ""
                }`}
              >
                <span
                  className="text-5xl text-black/10 block mb-6"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                  }}
                >
                  {value.num}
                </span>
                <h3
                  className="text-xl italic mb-4"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                  }}
                >
                  {value.title}
                </h3>
                <p className="text-black/50 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Pull quote */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="mt-20 max-w-3xl mx-auto text-center"
          >
            <div className="w-8 h-[1px] bg-[#E8673C] mx-auto mb-8" />
            <blockquote
              className="text-3xl md:text-4xl italic leading-snug text-black/80"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              &ldquo;We don&rsquo;t just manage talent &mdash; we curate a
              vision for what creator partnerships can become.&rdquo;
            </blockquote>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-black/40">
              &mdash; Amie Talents, Los Angeles
            </p>
            <div className="w-8 h-[1px] bg-[#E8673C] mx-auto mt-8" />
          </motion.div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-24 px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 mb-6">
            05 &mdash; Connect
          </p>
          <h2
            className="text-5xl md:text-7xl lg:text-8xl italic leading-[0.9] mb-8"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Let&rsquo;s write the
            <br />
            <span className="text-[#E8673C]">next chapter</span>
          </h2>
          <p className="text-black/50 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
            Whether you&rsquo;re a brand seeking authentic voices or a creator
            ready for your next opportunity, we&rsquo;d love to connect.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/contact"
              className="border border-black px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: "italic",
                fontSize: "14px",
                letterSpacing: "0.1em",
              }}
            >
              For Brands
            </Link>
            <Link
              href="/contact"
              className="border border-[#E8673C] text-[#E8673C] px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#E8673C] hover:text-white transition-all duration-300"
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: "italic",
                fontSize: "14px",
                letterSpacing: "0.1em",
              }}
            >
              For Creators
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-black/10 py-12 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span
              className="text-xl text-black"
              style={{ fontFamily: '"Genty", cursive' }}
            >
              amie talents
            </span>
          </div>
          <div className="flex gap-8">
            {footerSocials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={
                  item.href.startsWith("mailto:")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/30">
            &copy; {new Date().getFullYear()} Amie Talents
          </p>
        </div>
      </footer>
    </div>
  );
}
