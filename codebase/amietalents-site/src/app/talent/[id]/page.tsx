import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Instagram, Youtube } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { GlassPanel } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { talents, getTalentById } from "@/lib/talents";

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

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const talent = getTalentById(id);

  if (!talent) {
    return {
      title: "Talent Not Found",
    };
  }

  return {
    title: `${talent.name} | Amie Talents`,
    description: talent.bio,
  };
}

export async function generateStaticParams() {
  return talents.map((talent) => ({
    id: talent.id,
  }));
}

export default async function TalentProfilePage({ params }: Props) {
  const { id } = await params;
  const talent = getTalentById(id);

  if (!talent) {
    notFound();
  }

  return (
    <>
      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-6 pt-8">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link href="/talent">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Talent
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-muted via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Profile Image */}
            <FadeIn>
              <div className="aspect-[3/4] relative rounded-2xl overflow-hidden">
                <Image
                  src={talent.image}
                  alt={talent.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </FadeIn>

            {/* Profile Info */}
            <FadeIn delay={0.2}>
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {talent.categories.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                  {talent.name}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {talent.handle}
                </p>

                <p className="text-muted-foreground mb-8 text-lg">{talent.bio}</p>

                {/* Social Links */}
                <div className="space-y-3 mb-8">
                  {talent.socials.instagram && (
                    <a
                      href={talent.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <GlassPanel className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <span className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
                          <Instagram className="h-6 w-6 text-white" />
                        </span>
                        <div>
                          <p className="font-medium">Instagram</p>
                          <p className="text-sm text-muted-foreground">
                            {talent.handle}
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </GlassPanel>
                    </a>
                  )}

                  {talent.socials.tiktok && (
                    <a
                      href={talent.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <GlassPanel className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <span className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                          <TikTokIcon className="h-6 w-6 text-white" />
                        </span>
                        <div>
                          <p className="font-medium">TikTok</p>
                          <p className="text-sm text-muted-foreground">
                            {talent.handle}
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </GlassPanel>
                    </a>
                  )}

                  {talent.socials.youtube && (
                    <a
                      href={talent.socials.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <GlassPanel className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                        <span className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                          <Youtube className="h-6 w-6 text-white" />
                        </span>
                        <div>
                          <p className="font-medium">YouTube</p>
                          <p className="text-sm text-muted-foreground">
                            {talent.name}
                          </p>
                        </div>
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                      </GlassPanel>
                    </a>
                  )}
                </div>

                <Button size="lg" asChild className="group">
                  <Link href={`/contact?type=brand&talent=${talent.id}`}>
                    Work with {talent.name}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-foreground/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <StaggerContainer className="flex flex-wrap justify-center gap-4">
            {talent.categories.map((category) => (
              <StaggerItem key={category}>
                <GlassPanel className="px-6 py-4 text-center">
                  <p className="text-lg font-semibold">{category}</p>
                </GlassPanel>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-foreground" />
              <div className="relative z-10 p-8 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-background">
                  Interested in Working with {talent.name}?
                </h2>
                <p className="text-background/80 max-w-2xl mx-auto mb-8">
                  Get in touch with our team to discuss partnership opportunities and
                  campaign ideas.
                </p>
                <Button size="lg" variant="secondary" asChild className="group">
                  <Link href={`/contact?type=brand&talent=${talent.id}`}>
                    Start a Conversation
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
