"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Heart, MessageCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface InstagramPost {
  id: string;
  image: string;
  likes: string;
  comments: string;
  caption?: string;
}

interface InstagramFeedProps {
  username: string;
  posts: InstagramPost[];
  className?: string;
}

export function InstagramFeed({ username, posts, className }: InstagramFeedProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <a
          href={`https://instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center border border-border">
            <Instagram className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold group-hover:underline">@{username}</p>
            <p className="text-sm text-muted-foreground">Follow on Instagram</p>
          </div>
        </a>
        <a
          href={`https://instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View Profile
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {posts.map((post, index) => (
          <motion.a
            key={post.id}
            href={`https://instagram.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square rounded-xl overflow-hidden bg-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Image
              src={post.image}
              alt={post.caption || `Instagram post ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5 fill-white" />
                <span className="font-semibold">{post.likes}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="h-5 w-5 fill-white" />
                <span className="font-semibold">{post.comments}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

// Simplified single post embed
interface InstagramEmbedProps {
  postUrl: string;
  image: string;
  username: string;
  caption?: string;
  likes?: string;
  className?: string;
}

export function InstagramEmbed({
  postUrl,
  image,
  username,
  caption,
  likes,
  className,
}: InstagramEmbedProps) {
  return (
    <motion.div
      className={cn(
        "rounded-xl border border-border bg-card overflow-hidden max-w-md",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
          <Instagram className="h-5 w-5" />
        </div>
        <a
          href={`https://instagram.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          @{username}
        </a>
      </div>

      {/* Image */}
      <a
        href={postUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-square group"
      >
        <Image
          src={image}
          alt={caption || "Instagram post"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </a>

      {/* Footer */}
      <div className="p-4">
        {likes && (
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 fill-foreground" />
            <span className="font-semibold">{likes} likes</span>
          </div>
        )}
        {caption && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            <span className="font-semibold text-foreground">@{username}</span>{" "}
            {caption}
          </p>
        )}
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground mt-2 inline-flex items-center gap-1"
        >
          View on Instagram
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}

// Grid for talent profiles with multiple feeds
interface TalentInstagramProps {
  talents: {
    name: string;
    username: string;
    image: string;
    followers: string;
    posts: InstagramPost[];
  }[];
  className?: string;
}

export function TalentInstagramGrid({ talents, className }: TalentInstagramProps) {
  return (
    <div className={cn("space-y-12", className)}>
      {talents.map((talent) => (
        <div key={talent.username}>
          {/* Talent header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden relative">
                <Image
                  src={talent.image}
                  alt={talent.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{talent.name}</h3>
                <a
                  href={`https://instagram.com/${talent.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  @{talent.username}
                </a>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">{talent.followers}</p>
              <p className="text-sm text-muted-foreground">followers</p>
            </div>
          </div>

          {/* Posts grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {talent.posts.slice(0, 6).map((post, index) => (
              <motion.a
                key={post.id}
                href={`https://instagram.com/${talent.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
              >
                <Image
                  src={post.image}
                  alt={`${talent.name}'s post`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white fill-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
