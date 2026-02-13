import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Eye, Heart, Users } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { GlassCard, GlassPanel } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { GradientText } from "@/components/ui/text-generate";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Amie Talents - a boutique talent management agency connecting brands with authentic influencers and content creators.",
};

const values = [
  {
    icon: Heart,
    title: "Authenticity First",
    description:
      "We believe in genuine connections. Every partnership we build is rooted in authenticity and shared values.",
  },
  {
    icon: Users,
    title: "Creator-Centric",
    description:
      "Our talent comes first. We're dedicated to nurturing careers and helping creators reach their full potential.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "We measure success by impact. Every campaign is designed to deliver meaningful, measurable outcomes.",
  },
  {
    icon: Eye,
    title: "Forward-Thinking",
    description:
      "The creator economy evolves daily. We stay ahead of trends to keep our talent and partners at the forefront.",
  },
];

const team = [
  {
    name: "Amie Roberts",
    role: "Founder & CEO",
    bio: "Former entertainment executive with 15+ years in talent management. Amie founded the agency with a vision to redefine creator partnerships.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Jordan Martinez",
    role: "Head of Talent",
    bio: "Passionate about discovering emerging voices. Jordan leads our talent acquisition and development programs.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
  },
  {
    name: "Taylor Kim",
    role: "Brand Partnerships Director",
    bio: "Expert in building brand relationships. Taylor ensures every collaboration creates value for all parties.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn>
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Building Bridges Between{" "}
                <GradientText>Creators & Brands</GradientText>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Amie Talents is a boutique talent management agency dedicated to
                representing the next generation of influencers and content
                creators. We believe in the power of authentic storytelling and
                meaningful partnerships.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Our <GradientText>Story</GradientText>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2020, Amie Talents emerged from a simple
                    observation: the creator economy was booming, but many
                    talented creators lacked the guidance and support they needed
                    to thrive.
                  </p>
                  <p>
                    Our founder, Amie Roberts, spent over a decade in traditional
                    entertainment before recognizing the seismic shift toward
                    digital-first creators. She built this agency to bridge the
                    gap between emerging talent and the brands eager to connect
                    with their audiences.
                  </p>
                  <p>
                    Today, we represent 50+ creators across lifestyle, tech,
                    fashion, fitness, and more. We&apos;ve partnered with over 200
                    brands to create campaigns that resonate, engage, and deliver
                    real results.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <GlassCard className="p-6" rotationIntensity={5}>
                <div className="relative aspect-square rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=800&fit=crop"
                    alt="Team meeting and collaboration"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Our <GradientText>Values</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from how we support our
              talent to how we build brand partnerships.
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <Spotlight className="h-full">
                  <div className="p-6 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </Spotlight>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Meet the <GradientText>Team</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A passionate group of industry professionals dedicated to creator
              success.
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <StaggerItem key={member.name}>
                <GlassPanel className="p-6 text-center h-full">
                  <div className="w-28 h-28 rounded-full mx-auto mb-4 relative overflow-hidden border-2 border-white/20">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </GlassPanel>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-center">
              Life at <GradientText>Amie Talents</GradientText>
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop", alt: "Team collaboration" },
              { src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop", alt: "Creative brainstorm" },
              { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop", alt: "Office meeting" },
              { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop", alt: "Team discussion" },
            ].map((image, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden group">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1600&h=600&fit=crop"
                  alt="Creative workspace"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-accent/80 backdrop-blur-sm" />
              </div>

              <div className="relative z-10 p-8 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                  Want to Work With Us?
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto mb-8">
                  Whether you&apos;re a creator looking for representation or a brand
                  seeking authentic partnerships, we&apos;d love to connect.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 group">
                    <Link href="/contact?type=brand">
                      Partner With Us
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
                    <Link href="/contact?type=influencer">Join as Talent</Link>
                  </Button>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
