"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { talents } from "@/lib/talents";

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
  { label: "CREATORS", value: String(talents.length).padStart(2, "0") },
  { label: "BRANDS", value: "15+" },
  { label: "FOUNDED", value: "2024" },
  { label: "BASE", value: "LA" },
];

export default function V9Page() {
  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-[#E8673C] selection:text-white">
      {/* ============================================================ */}
      {/* NAV */}
      {/* ============================================================ */}
      <nav className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-xl font-bold tracking-tight uppercase">
            AMIE<span className="bg-[#E8673C] text-white px-1">TALENTS</span>
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wider">
            <Link href="#talent" className="underline underline-offset-4 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors">
              [TALENT]
            </Link>
            <Link href="#about" className="underline underline-offset-4 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors">
              [ABOUT]
            </Link>
            <Link href="#brands" className="underline underline-offset-4 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors">
              [BRANDS]
            </Link>
            <Link href="#contact" className="underline underline-offset-4 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors">
              [CONTACT]
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/* HERO */}
      {/* ============================================================ */}
      <section className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 min-h-[70vh]">
          {/* Left column */}
          <div className="md:col-span-8 border-r-0 md:border-r-4 border-black px-6 py-12 flex flex-col justify-between">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-sm uppercase tracking-widest mb-8"
              >
                [WOMEN-LED TALENT MANAGEMENT]
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.9] tracking-tighter"
              >
                WE DON&apos;T DO
                <br />
                <span className="bg-[#E8673C] text-white px-2">PRETTY.</span>
                <br />
                WE DO
                <br />
                <span className="inline-block border-4 border-black px-2">EFFECTIVE.</span>
              </motion.h1>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-sm uppercase tracking-wider mt-12 max-w-lg"
            >
              Amie Talents is a Los Angeles-based talent management
              agency connecting creators with brands that matter. No
              fluff. No filler. Just results.
            </motion.p>
          </div>

          {/* Right column — stats */}
          <div className="md:col-span-4 flex flex-col">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
                className="flex-1 border-b-4 border-black last:border-b-0 px-6 py-6 flex flex-col justify-center"
              >
                <span className="text-4xl md:text-5xl font-bold tracking-tighter">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-widest mt-1">
                  [{stat.label}]
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* BRANDS SECTION */}
      {/* ============================================================ */}
      <section id="brands" className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-widest">[BRAND PARTNERS]</span>
            <div className="flex-1 border-t-2 border-black" />
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 border-4 border-black">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.05 * i }}
                className="border border-black px-3 py-4 flex flex-col items-center justify-center gap-2 hover:bg-[#E8673C] hover:text-white transition-colors cursor-default group"
              >
                <img
                  src={`https://img.logo.dev/${brand.domain}?token=pk_B2gV_nbBRuSh3HU-PCn3zw&size=64&format=png`}
                  alt={brand.name}
                  width={32}
                  height={32}
                  className="grayscale group-hover:grayscale-0 transition-all"
                />
                <span className="text-[10px] md:text-xs uppercase tracking-wider font-bold text-center">
                  {brand.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TALENT ROSTER TABLE */}
      {/* ============================================================ */}
      <section id="talent" className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs uppercase tracking-widest">[TALENT ROSTER]</span>
            <div className="flex-1 border-t-2 border-black" />
            <span className="text-xs uppercase tracking-widest">
              {String(talents.length).padStart(2, "0")} TOTAL
            </span>
          </div>

          {/* Scroll indicator — mobile only */}
          <div className="md:hidden text-center mb-3">
            <span className="text-[10px] uppercase tracking-widest text-black/50">
              &larr; SCROLL &rarr;
            </span>
          </div>

          {/* Horizontally scrollable table wrapper */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Table */}
              <div className="border-4 border-black">
                {/* Table header */}
                <div className="grid grid-cols-12 border-b-4 border-black bg-black text-white px-4 py-3 text-xs uppercase tracking-widest">
                  <div className="col-span-1">#</div>
                  <div className="col-span-2">IMAGE</div>
                  <div className="col-span-3">NAME</div>
                  <div className="col-span-3">HANDLE</div>
                  <div className="col-span-3">CATEGORY</div>
                </div>

                {/* Table rows — all talents */}
                {talents.map((talent, i) => (
                  <motion.div
                    key={talent.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * i }}
                    className="grid grid-cols-12 items-center border-b-2 border-black last:border-b-0 px-4 py-4 hover:bg-[#E8673C] hover:text-white transition-colors group"
                  >
                    <div className="col-span-1 text-2xl font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-2">
                      <div className="relative w-16 h-16 border-4 border-black rounded-none overflow-hidden shadow-[4px_4px_0_black] group-hover:shadow-[4px_4px_0_white]">
                        <Image
                          src={talent.image}
                          alt={talent.name}
                          fill
                          className="object-cover rounded-none"
                        />
                      </div>
                    </div>
                    <div className="col-span-3 text-lg font-bold uppercase tracking-tight">
                      {talent.name}
                    </div>
                    <div className="col-span-3 text-sm">
                      {talent.handle}
                    </div>
                    <div className="col-span-3 flex flex-wrap gap-1">
                      {talent.categories.map((cat) => (
                        <span
                          key={cat}
                          className="text-xs uppercase tracking-wider border-2 border-current px-2 py-0.5 rounded-none"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-right">
            <Link
              href="/talent"
              className="text-sm uppercase tracking-widest underline underline-offset-4 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors"
            >
              VIEW FULL ROSTER &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ABOUT / VALUES */}
      {/* ============================================================ */}
      <section id="about" className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2">
          {/* Left — manifesto */}
          <div className="border-r-0 md:border-r-4 border-black px-6 py-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs uppercase tracking-widest">[ABOUT]</span>
              <div className="flex-1 border-t-2 border-black" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold uppercase leading-tight tracking-tighter mb-6">
                WE BELIEVE IN{" "}
                <span className="bg-[#E8673C] text-white px-1">TRANSPARENCY</span>,{" "}
                <span className="bg-[#E8673C] text-white px-1">HONESTY</span>, AND{" "}
                <span className="bg-[#E8673C] text-white px-1">REAL WORK</span>.
              </h2>
              <p className="text-sm uppercase tracking-wider leading-relaxed">
                Amie Talents was built to cut through the noise of
                influencer culture. We represent creators who make
                real content, build real audiences, and deliver real
                results for brands. No vanity metrics. No
                smoke-and-mirror deals. We show you the numbers, the
                strategy, and the outcome — in plain text.
              </p>
            </motion.div>
          </div>

          {/* Right — values grid */}
          <div className="flex flex-col">
            {[
              {
                tag: "[01]",
                title: "AUTHENTICITY",
                desc: "Our creators are real people with real audiences. No fake engagement. No bought followers.",
              },
              {
                tag: "[02]",
                title: "STRATEGY",
                desc: "Every partnership is data-driven. We match brands with creators based on audience alignment, not follower count.",
              },
              {
                tag: "[03]",
                title: "TRANSPARENCY",
                desc: "Open communication, clear contracts, honest reporting. You see everything we see.",
              },
              {
                tag: "[04]",
                title: "RESULTS",
                desc: "We measure success in conversions, engagement, and brand lift — not just impressions.",
              },
            ].map((value, i) => (
              <motion.div
                key={value.tag}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * i }}
                className="flex-1 border-b-4 border-black last:border-b-0 px-6 py-6"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl font-bold tracking-tighter shrink-0">
                    {value.tag}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-1">
                      {value.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PROCESS SECTION */}
      {/* ============================================================ */}
      <section className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs uppercase tracking-widest">[PROCESS]</span>
            <div className="flex-1 border-t-2 border-black" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-4 border-black">
            {[
              {
                step: "01",
                title: "INTAKE",
                desc: "Tell us your goals, budget, and timeline. We listen. We ask hard questions.",
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4">
                    <rect x="2" y="2" width="36" height="36" stroke="currentColor" strokeWidth="3" />
                    <line x1="12" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="26" x2="22" y2="26" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
              },
              {
                step: "02",
                title: "MATCH",
                desc: "We pair your brand with creators whose audience actually aligns. Data > gut feel.",
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4">
                    <circle cx="14" cy="20" r="10" stroke="currentColor" strokeWidth="3" />
                    <circle cx="26" cy="20" r="10" stroke="currentColor" strokeWidth="3" />
                  </svg>
                ),
              },
              {
                step: "03",
                title: "EXECUTE",
                desc: "Content goes live. We track everything. You get a full report — no fluff.",
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4">
                    <polygon points="8,4 8,36 34,20" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.15 * i }}
                className="border-r-0 md:border-r-4 md:last:border-r-0 border-b-4 md:border-b-0 last:border-b-0 border-black px-6 py-8"
              >
                {item.icon}
                <span className="text-5xl font-bold tracking-tighter block mb-2">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold uppercase tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-xs uppercase tracking-wider leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA SECTION */}
      {/* ============================================================ */}
      <section id="contact" className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs uppercase tracking-widest">[CONTACT]</span>
            <div className="flex-1 border-t-2 border-black" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-[0.95] mb-8">
              READY TO WORK
              <br />
              WITH <span className="bg-[#E8673C] text-white px-2">REAL</span> CREATORS?
            </h2>
            <p className="text-sm uppercase tracking-wider max-w-xl mb-10 leading-relaxed">
              Drop us a line. No discovery calls. No sales decks. Just
              a straightforward conversation about what you need and
              how we can deliver.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-block border-4 border-black bg-black text-white px-8 py-4 text-sm uppercase tracking-widest font-bold rounded-none hover:bg-[#E8673C] hover:border-[#E8673C] transition-colors shadow-[6px_6px_0_black] hover:shadow-[6px_6px_0_#E8673C]"
              >
                GET IN TOUCH &rarr;
              </Link>
              <Link
                href="mailto:info@amietalents.com"
                className="inline-block text-sm uppercase tracking-widest underline underline-offset-4 px-4 py-4 hover:bg-[#E8673C] hover:text-white hover:no-underline transition-colors"
              >
                INFO@AMIETALENTS.COM
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-xs uppercase tracking-wider leading-relaxed">
          <p>AMIE TALENTS / LOS ANGELES, CA / EST. 2024</p>
          <p className="mt-2">
            A WOMEN-LED TALENT MANAGEMENT AGENCY.
          </p>
          <p className="mt-4">
            <Link href="/privacy" className="underline underline-offset-4 mr-6 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors">
              [PRIVACY]
            </Link>
            <Link href="/terms" className="underline underline-offset-4 mr-6 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors">
              [TERMS]
            </Link>
            <a href="https://instagram.com/amietalents" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:bg-[#E8673C] hover:text-white hover:no-underline px-1 transition-colors">
              [INSTAGRAM]
            </a>
          </p>
          <p className="mt-4 text-[10px] tracking-widest">
            &copy; {new Date().getFullYear()} AMIE TALENTS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
