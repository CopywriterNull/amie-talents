"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, ExternalLink } from "lucide-react";
import { Talent } from "@/lib/talents";

// TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

interface TalentCardProps {
  talent: Talent;
}

export function TalentCard({ talent }: TalentCardProps) {
  return (
    <Link href={`/talent/${talent.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card className="group overflow-hidden cursor-pointer h-full border-white/10 bg-background/50 backdrop-blur-sm">
          <div className="aspect-[3/4] relative bg-muted">
            {/* Image or gradient placeholder */}
            {talent.image ? (
              <Image
                src={talent.image}
                alt={talent.name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                <span className="text-6xl font-bold text-primary/30 transition-transform duration-500 group-hover:scale-110">
                  {talent.name.charAt(0)}
                </span>
              </div>
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Hover overlay with glassmorphism */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 backdrop-blur-0 group-hover:backdrop-blur-[1px] transition-all duration-300" />

            {/* Featured badge */}
            {talent.featured && (
              <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm shadow-lg border-0">
                Featured
              </Badge>
            )}

            {/* View profile indicator - appears on hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ExternalLink className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300">
              <Badge className="mb-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                {talent.category}
              </Badge>
              <h3 className="font-semibold text-lg">{talent.name}</h3>
              <p className="text-sm text-white/80">{talent.handle}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-white/60">
                  {talent.categories.join(" · ")}
                </p>

                {/* Platform icons */}
                {talent.socials && (
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {talent.socials.instagram && (
                      <span className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                        <Instagram className="h-3 w-3" />
                      </span>
                    )}
                    {talent.socials.tiktok && (
                      <span className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                        <TikTokIcon className="h-3 w-3" />
                      </span>
                    )}
                    {talent.socials.youtube && (
                      <span className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
                        <Youtube className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}
