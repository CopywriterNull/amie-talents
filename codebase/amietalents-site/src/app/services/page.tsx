import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  TrendingUp,
  Camera,
  Megaphone,
  BarChart3,
  Handshake,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";
import { Spotlight } from "@/components/ui/spotlight";
import { GlassCard, GlassPanel } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/text-generate";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore our talent management and brand partnership services. From campaign strategy to content creation, we deliver results.",
};

const services = [
  {
    icon: Users,
    title: "Talent Management",
    description:
      "Comprehensive representation for influencers and content creators.",
    features: [
      "Career strategy & development",
      "Contract negotiation",
      "Brand deal sourcing",
      "Personal branding guidance",
      "Content strategy support",
    ],
  },
  {
    icon: Handshake,
    title: "Brand Partnerships",
    description:
      "Strategic matchmaking between brands and the perfect creators.",
    features: [
      "Talent discovery & vetting",
      "Campaign concept development",
      "Partnership negotiation",
      "Collaboration management",
      "Performance tracking",
    ],
  },
  {
    icon: Megaphone,
    title: "Campaign Management",
    description: "End-to-end campaign execution from concept to completion.",
    features: [
      "Campaign strategy & planning",
      "Creator coordination",
      "Content approval workflows",
      "Timeline management",
      "Deliverable tracking",
    ],
  },
  {
    icon: Camera,
    title: "Content Production",
    description:
      "High-quality content creation that tells your brand story.",
    features: [
      "Photo & video production",
      "Creative direction",
      "Post-production editing",
      "Multi-platform optimization",
      "Content repurposing",
    ],
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Data-driven insights to measure and optimize performance.",
    features: [
      "Campaign performance reports",
      "Audience insights",
      "ROI analysis",
      "Competitive benchmarking",
      "Growth recommendations",
    ],
  },
  {
    icon: Lightbulb,
    title: "Strategy Consulting",
    description:
      "Expert guidance for brands entering the influencer marketing space.",
    features: [
      "Influencer marketing strategy",
      "Platform selection",
      "Budget optimization",
      "Best practices training",
      "Trend forecasting",
    ],
  },
];

const process = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We learn about your goals, audience, and vision to find the perfect fit.",
  },
  {
    step: "02",
    title: "Strategy",
    description:
      "We develop a tailored approach that aligns with your objectives.",
  },
  {
    step: "03",
    title: "Execution",
    description:
      "Our team manages every detail to bring the campaign to life.",
  },
  {
    step: "04",
    title: "Analysis",
    description:
      "We measure results and provide insights for future optimization.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6 backdrop-blur-sm bg-white/10 border-white/20">
                Our Services
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Everything You Need to{" "}
                <GradientText>Succeed</GradientText>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                From talent management to brand campaigns, we offer comprehensive
                services designed to create authentic connections and deliver
                measurable results.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <StaggerItem key={service.title}>
                <Spotlight className="h-full">
                  <div className="p-6 h-full">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Spotlight>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              How We <GradientText>Work</GradientText>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures every project runs smoothly from
              start to finish.
            </p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <StaggerItem key={step.step}>
                <div className="relative">
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -translate-x-1/2" />
                  )}
                  <GlassPanel className="text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold text-primary">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </GlassPanel>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* For Brands Section */}
      <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <div>
                <Badge variant="secondary" className="mb-4 backdrop-blur-sm bg-white/10 border-white/20">
                  For Brands
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Find Your Perfect <GradientText>Creator Match</GradientText>
                </h2>
                <p className="text-muted-foreground mb-6">
                  We connect brands with authentic voices that resonate with their
                  target audience. Our vetted roster of creators spans multiple
                  niches and platforms, ensuring you find the right fit for every
                  campaign.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Access to 50+ vetted creators",
                    "Combined reach of 500M+ followers",
                    "End-to-end campaign management",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="group">
                  <Link href="/contact?type=brand">
                    Start a Partnership
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <GlassCard className="p-6" rotationIntensity={5}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop"
                    alt="Brand partnership meeting"
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

      {/* For Creators Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn className="order-2 md:order-1">
              <GlassCard className="p-6" rotationIntensity={5}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop"
                    alt="Content creator at work"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              </GlassCard>
            </FadeIn>
            <FadeIn delay={0.2} className="order-1 md:order-2">
              <div>
                <Badge variant="secondary" className="mb-4 backdrop-blur-sm bg-white/10 border-white/20">
                  For Creators
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  Take Your Career to the <GradientText>Next Level</GradientText>
                </h2>
                <p className="text-muted-foreground mb-6">
                  We provide full-service management for influencers and content
                  creators. From securing brand deals to developing your personal
                  brand, we&apos;re here to help you grow.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Dedicated talent manager",
                    "Access to top brand partnerships",
                    "Career strategy & growth support",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="group">
                  <Link href="/contact?type=influencer">
                    Apply to Join
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </FadeIn>
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
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=600&fit=crop"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-accent/70 backdrop-blur-sm" />
              </div>

              <div className="relative z-10 p-8 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
                  Ready to Get Started?
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto mb-8">
                  Let&apos;s discuss how we can help you achieve your goals. Reach out
                  today for a consultation.
                </p>
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 group">
                  <Link href="/contact">
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
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
