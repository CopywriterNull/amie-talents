import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Homepage Variants",
  robots: "noindex",
};

const variants = [
  { id: 1, name: "Poppi Pop", desc: "Huge serif hero, bubbly shapes, neon accents, playful bouncing animations" },
  { id: 6, name: "Editorial Mag", desc: "Serif headlines, asymmetric layout, magazine grid, editorial feel" },
  { id: 9, name: "Brutalist", desc: "Monospace, no radius, thick borders, exposed grid, raw aesthetic" },
];

export default function VariantsPage() {
  return (
    <div className="min-h-screen bg-[#FAF0E6] py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="font-display text-5xl md:text-7xl text-[#E8673C] mb-4">
          Homepage Variants
        </h1>
        <p className="text-lg text-[#8B7355] mb-12 max-w-2xl">
          3 homepage variants — each a completely different design system.
          Pick your favorite direction.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {variants.map((v) => (
            <Link
              key={v.id}
              href={`/v${v.id}`}
              className="group block bg-white rounded-2xl p-6 border border-[#E8D5C0] hover:border-[#E8673C] hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl font-display text-[#E8673C]">
                  {String(v.id).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-semibold text-[#2D2926]">
                  {v.name}
                </h2>
              </div>
              <p className="text-sm text-[#8B7355] leading-relaxed">{v.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
