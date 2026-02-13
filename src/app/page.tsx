import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Sparkles as SparklesIcon, TrendingUp, Heart, Calendar, Instagram } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { AnimatedCounter } from "@/components/animations/animated-counter";
import { BrandMarquee } from "@/components/brand-marquee";
import { Testimonials } from "@/components/testimonials";
import { TalentCard } from "@/components/talent-card";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Spotlight } from "@/components/ui/spotlight";
import { GlassCard, GlassPanel } from "@/components/ui/glass-card";
import { TextGenerate, GradientText } from "@/components/ui/text-generate";
import { Sparkles } from "@/components/ui/sparkles";
import { TalentInstagramGrid } from "@/components/instagram-feed";
import { getFeaturedTalents } from "@/lib/talents";

// Get featured talent from real data
const featuredTalent = getFeaturedTalents().slice(0, 4);

const services = [
  {
    icon: Users,
    title: "Talent Management",
    description:
      "Full-service management for influencers and creators, from strategy to execution.",
  },
  {
    icon: SparklesIcon,
    title: "Brand Partnerships",
    description:
      "We match brands with the perfect creators for authentic, impactful collaborations.",
  },
  {
    icon: TrendingUp,
    title: "Campaign Strategy",
    description:
      "Data-driven campaign planning that maximizes reach and engagement.",
  },
  {
    icon: Heart,
    title: "Content Creation",
    description:
      "End-to-end content production that tells your brand story beautifully.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "We learn about your brand, goals, and target audience to understand your unique needs.",
  },
  {
    step: "02",
    title: "Matching",
    description: "Our team curates a selection of creators that align with your brand values and objectives.",
  },
  {
    step: "03",
    title: "Strategy",
    description: "We develop a comprehensive campaign strategy with clear KPIs and creative direction.",
  },
  {
    step: "04",
    title: "Execution",
    description: "We manage the entire campaign process, from content creation to publishing and beyond.",
  },
  {
    step: "05",
    title: "Results",
    description: "Detailed analytics and reporting to measure success and optimize future campaigns.",
  },
];

const stats = [
  { value: "50+", label: "Creators" },
  { value: "200+", label: "Brand Partners" },
  { value: "500M+", label: "Total Reach" },
  { value: "98%", label: "Client Satisfaction" },
];

// Instagram showcase data for homepage
const instagramShowcase = [
  {
    name: "Sarah Chen",
    username: "sarahcreates",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
    followers: "1.2M",
    posts: [
      { id: "s1", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", likes: "45.2K", comments: "892" },
      { id: "s2", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", likes: "38.1K", comments: "654" },
      { id: "s3", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", likes: "52.4K", comments: "1.2K" },
      { id: "s4", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop", likes: "41.8K", comments: "789" },
      { id: "s5", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", likes: "36.5K", comments: "543" },
      { id: "s6", image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=400&fit=crop", likes: "48.9K", comments: "967" },
    ],
  },
  {
    name: "Ava Williams",
    username: "avawilliams",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop",
    followers: "2.1M",
    posts: [
      { id: "a1", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop", likes: "89.3K", comments: "2.1K" },
      { id: "a2", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop", likes: "76.2K", comments: "1.8K" },
      { id: "a3", image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop", likes: "92.1K", comments: "2.4K" },
      { id: "a4", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop", likes: "68.5K", comments: "1.5K" },
      { id: "a5", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop", likes: "81.7K", comments: "1.9K" },
      { id: "a6", image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&h=400&fit=crop", likes: "74.8K", comments: "1.7K" },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Aurora Background */}
      <AuroraBackground className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-24 md:py-36 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn delay={0.1}>
              <Badge variant="secondary" className="mb-6 backdrop-blur-sm bg-white/10 border-white/20">
                Boutique Talent Management
              </Badge>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
                Where{" "}
                <Sparkles sparkleColor="hsl(var(--primary))">
                  <GradientText>Creators</GradientText>
                </Sparkles>{" "}
                & Brands Connect
              </h1>
            </FadeIn>
            <FadeIn delay={0.3}>
              <TextGenerate
                words="We represent the next generation of influencers and content creators. Let's build something extraordinary together."
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-normal"
              />
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="group backdrop-blur-sm">
                  <Link href="/contact?type=brand">
                    Partner With Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10">
                  <Link href="/talent">Browse Talent</Link>
                </Button>
                <Button size="lg" variant="ghost" asChild className="group backdrop-blur-sm hover:bg-white/10">
                  <Link href="/contact?type=brand#book">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book a Call
                  </Link>
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Floating images */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden opacity-40 rotate-6 hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop"
              alt="Content creation"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-32 right-20 w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden opacity-30 -rotate-12 hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&h=400&fit=crop"
              alt="Social media"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute top-1/2 right-10 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden opacity-25 rotate-12 hidden xl:block">
            <Image
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=300&fit=crop"
              alt="Team collaboration"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </AuroraBackground>

      {/* Brand Marquee */}
      <section className="py-12 border-b backdrop-blur-sm bg-background/80">
        <BrandMarquee />
      </section>

      {/* Stats Section with Glass Cards */}
      <section className="border-b bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 py-16 relative">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <GlassPanel className="text-center p-6">
                  <div className="text-3xl md:text-5xl font-bold text-primary mb-2">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </GlassPanel>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Talent Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  Featured <GradientText>Talent</GradientText>
                </h2>
                <p className="text-muted-foreground max-w-lg">
                  Meet some of the incredible creators we represent.
                </p>
              </div>
              <Button variant="ghost" asChild className="group">
                <Link href="/talent">
                  View All Talent
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTalent.map((talent) => (
              <StaggerItem key={talent.id}>
                <TalentCard talent={talent} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Services Section with Spotlight Effect */}
      <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              What We <GradientText>Do</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From talent management to brand strategy, we offer comprehensive
              services that drive results.
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <Spotlight className="h-full">
                  <div className="p-6 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </Spotlight>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.4} className="text-center mt-10">
            <Button size="lg" variant="outline" asChild className="group backdrop-blur-sm">
              <Link href="/services">
                Learn More About Our Services
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How We <GradientText>Work</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures successful partnerships from start to finish.
            </p>
          </FadeIn>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
              {processSteps.map((step, index) => (
                <StaggerItem key={step.step}>
                  <div className="relative text-center group">
                    {/* Step number */}
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border-2 border-primary/20 mb-6 group-hover:border-primary/50 transition-colors">
                      <span className="text-lg font-bold text-primary">{step.step}</span>
                      {/* Pulse effect on hover */}
                      <div className="absolute inset-0 rounded-full bg-primary/10 scale-0 group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>

                    {/* Arrow for larger screens */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 -right-4 transform translate-x-1/2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div className="relative">
                <GlassCard className="p-8" rotationIntensity={5}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                      alt="Team collaboration"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                </GlassCard>
                {/* Decorative element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl blur-2xl" />
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Why Partner With{" "}
                  <GradientText>Amie Talents</GradientText>?
                </h2>
                <p className="text-muted-foreground text-lg">
                  We&apos;re not just a talent agency. We&apos;re your strategic partner in building authentic connections between creators and brands.
                </p>
                <div className="space-y-4">
                  {[
                    { title: "Personalized Approach", desc: "Every creator and brand is unique. We tailor our strategies to fit your specific goals." },
                    { title: "Data-Driven Results", desc: "We use analytics and insights to optimize campaigns and maximize ROI." },
                    { title: "Long-term Relationships", desc: "We focus on building lasting partnerships, not just one-off deals." },
                  ].map((item, i) => (
                    <GlassPanel key={i} className="p-4">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              What People <GradientText>Say</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from the brands and creators who&apos;ve partnered with us.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Testimonials />
          </FadeIn>
        </div>
      </section>

      {/* Instagram Showcase Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Instagram className="h-6 w-6" />
              <span className="text-sm font-medium text-muted-foreground">@amietalents</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Follow Our <GradientText>Creators</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the latest content from our talented roster of influencers and creators.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <TalentInstagramGrid talents={instagramShowcase} />
          </FadeIn>

          <FadeIn delay={0.3} className="text-center mt-10">
            <Button variant="outline" size="lg" asChild className="group">
              <Link href="/talent">
                Discover All Talent
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section with Glass Effect */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&h=800&fit=crop"
                  alt="Team working together"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-accent/70 backdrop-blur-sm" />
              </div>

              {/* Content */}
              <div className="relative z-10 p-8 md:p-16 text-center">
                <Sparkles sparkleColor="rgba(255,255,255,0.8)">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    Ready to Get Started?
                  </h2>
                </Sparkles>
                <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
                  Whether you&apos;re a brand looking for the perfect creator
                  partnership or a creator ready to take your career to the next
                  level, we&apos;d love to hear from you.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 group backdrop-blur-sm"
                    asChild
                  >
                    <Link href="/contact?type=brand">
                      I&apos;m a Brand
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm"
                    asChild
                  >
                    <Link href="/contact?type=influencer">I&apos;m a Creator</Link>
                  </Button>
                </div>
              </div>

              {/* Decorative glass elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
