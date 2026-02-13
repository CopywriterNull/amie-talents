"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoHeroProps {
  videoSrc?: string;
  posterSrc?: string;
  children: React.ReactNode;
  overlay?: boolean;
  className?: string;
}

export function VideoHero({
  videoSrc,
  posterSrc,
  children,
  overlay = true,
  className,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // If no video source, show animated gradient background
  if (!videoSrc) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(var(--primary), 0.2) 0%, rgba(var(--accent), 0.1) 50%, var(--background) 100%)",
                "linear-gradient(225deg, rgba(var(--primary), 0.15) 0%, rgba(var(--accent), 0.2) 50%, var(--background) 100%)",
                "linear-gradient(315deg, rgba(var(--primary), 0.2) 0%, rgba(var(--accent), 0.1) 50%, var(--background) 100%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          {/* Floating orbs */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster={posterSrc}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Video Controls */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-20">
        <Button
          variant="secondary"
          size="icon"
          onClick={togglePlay}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleMute}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
