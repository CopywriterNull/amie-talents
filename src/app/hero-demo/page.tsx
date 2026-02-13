import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  HeroEditorial,
  HeroGrid,
  HeroMagazine,
  HeroAgency,
} from "@/components/hero-variants";

export const metadata: Metadata = {
  title: "Hero Designs - Amie Talents",
  description: "Preview hero section designs",
};

export default function HeroDemoPage() {
  return (
    <div>
      {/* Navigation */}
      <nav className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <Badge className="mb-2 bg-white/90 backdrop-blur-sm text-black border shadow-sm">
          Hero Options
        </Badge>
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm" asChild>
          <Link href="#editorial">1. Editorial</Link>
        </Button>
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm" asChild>
          <Link href="#grid">2. Grid</Link>
        </Button>
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm" asChild>
          <Link href="#magazine">3. Magazine</Link>
        </Button>
        <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm" asChild>
          <Link href="#agency">4. Agency</Link>
        </Button>
      </nav>

      {/* Hero 1: Editorial - IMG Models Style */}
      <section id="editorial" className="relative">
        <div className="absolute top-4 left-4 z-20">
          <Badge className="text-sm px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black border shadow-sm">
            1. Editorial — IMG Models inspired
          </Badge>
        </div>
        <HeroEditorial />
      </section>

      {/* Hero 2: Grid - Kith/Revolve Style */}
      <section id="grid" className="relative">
        <div className="absolute top-4 left-4 z-20">
          <Badge className="text-sm px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black border shadow-sm">
            2. Grid Gallery — Kith/Revolve inspired
          </Badge>
        </div>
        <HeroGrid />
      </section>

      {/* Hero 3: Magazine Spread */}
      <section id="magazine" className="relative">
        <div className="absolute top-4 left-4 z-20">
          <Badge className="text-sm px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black border shadow-sm">
            3. Magazine Spread — Editorial layout
          </Badge>
        </div>
        <HeroMagazine />
      </section>

      {/* Hero 4: Modern Agency */}
      <section id="agency" className="relative">
        <div className="absolute top-4 left-4 z-20">
          <Badge className="text-sm px-3 py-1.5 bg-black/90 backdrop-blur-sm text-white border-neutral-700 shadow-sm">
            4. Modern Agency — Professional dark
          </Badge>
        </div>
        <HeroAgency />
      </section>
    </div>
  );
}
