"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface FloatingImage {
  src: string;
  alt: string;
  className?: string;
}

interface FloatingImagesProps {
  images: FloatingImage[];
  className?: string;
}

export function FloatingImages({ images, className }: FloatingImagesProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={cn(
            "absolute rounded-2xl overflow-hidden shadow-2xl",
            image.className
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -10, 0],
          }}
          transition={{
            opacity: { duration: 0.5, delay: index * 0.2 },
            y: {
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            },
          }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      ))}
    </div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ParallaxImage({ src, alt, className }: ParallaxImageProps) {
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-2xl", className)}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </motion.div>
  );
}
