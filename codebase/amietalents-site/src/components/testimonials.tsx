"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote:
      "Amie Talents transformed our influencer marketing strategy. Their creators delivered authentic content that truly resonated with our audience. We saw a 340% increase in engagement.",
    author: "Sarah Mitchell",
    role: "CMO",
    company: "Lifestyle Brand Co.",
    type: "brand",
  },
  {
    id: 2,
    quote:
      "Joining Amie Talents was the best decision for my career. They helped me land partnerships with brands I've always dreamed of working with, and their team genuinely cares about my growth.",
    author: "Marcus Chen",
    role: "Content Creator",
    company: "850K Followers",
    type: "creator",
  },
  {
    id: 3,
    quote:
      "The team at Amie Talents understands both sides of the equation. They match us with creators who truly align with our brand values, not just follower counts.",
    author: "Jennifer Park",
    role: "Brand Partnerships Director",
    company: "Premium Fashion House",
    type: "brand",
  },
  {
    id: 4,
    quote:
      "What sets Amie Talents apart is their personalized approach. They don't just negotiate deals—they help build long-term relationships that benefit everyone involved.",
    author: "Alex Rivera",
    role: "Lifestyle Creator",
    company: "1.2M Followers",
    type: "creator",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-background border-0 shadow-lg">
              <CardContent className="pt-8 pb-8 px-8 md:px-12">
                <Quote className="h-10 w-10 text-primary/20 mb-6" />
                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed mb-8 text-foreground">
                  &ldquo;{testimonials[currentIndex].quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary/60">
                      {testimonials[currentIndex].author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role},{" "}
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
