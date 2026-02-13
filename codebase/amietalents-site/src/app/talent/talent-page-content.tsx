"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Search, X } from "lucide-react";
import { TalentCard } from "@/components/talent-card";
import { FadeIn } from "@/components/animations/fade-in";
import { GlassPanel } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { GradientText } from "@/components/ui/text-generate";
import { talents, categories } from "@/lib/talents";

export function TalentPageContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTalents = useMemo(() => {
    return talents.filter((talent) => {
      const matchesCategory =
        selectedCategory === "All" || talent.categories.includes(selectedCategory);
      const matchesSearch =
        searchQuery === "" ||
        talent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        talent.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6 backdrop-blur-sm bg-white/10 border-white/20">
                Our Roster
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Meet Our <GradientText>Talent</GradientText>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                We represent a diverse roster of influencers and content creators
                who bring authenticity, creativity, and engaged audiences to every
                partnership.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="border-y bg-background/80 backdrop-blur-md sticky top-16 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 backdrop-blur-sm bg-background/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap transition-all hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-primary/90 backdrop-blur-sm"
                      : "bg-background/50 backdrop-blur-sm"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Active filters indicator */}
          {(selectedCategory !== "All" || searchQuery) && (
            <div className="flex items-center gap-2 mt-3 text-sm">
              <span className="text-muted-foreground">
                Showing {filteredTalents.length} result
                {filteredTalents.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={clearFilters}
                className="text-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Talent Grid */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <AnimatePresence mode="wait">
            {filteredTalents.length > 0 ? (
              <motion.div
                key={`${selectedCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredTalents.map((talent, index) => (
                  <motion.div
                    key={talent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <TalentCard talent={talent} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <GlassPanel className="inline-block p-8">
                  <p className="text-xl text-muted-foreground mb-4">
                    No talent found matching your criteria
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="backdrop-blur-sm">
                    Clear filters
                  </Button>
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-8">
              {/* For Brands */}
              <Spotlight className="p-0">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">Looking for Talent?</h3>
                  <p className="text-muted-foreground mb-6">
                    Our team can help you find the perfect creator for your next
                    campaign. Get in touch to discuss your needs.
                  </p>
                  <Button asChild className="group backdrop-blur-sm">
                    <Link href="/contact?type=brand">
                      Work With Our Talent
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Spotlight>

              {/* For Creators */}
              <Spotlight className="p-0">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">
                    Want to Join Our Roster?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    We&apos;re always looking for talented creators to represent.
                    Apply to join the Amie Talents family.
                  </p>
                  <Button variant="outline" asChild className="group backdrop-blur-sm">
                    <Link href="/contact?type=influencer">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </Spotlight>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
