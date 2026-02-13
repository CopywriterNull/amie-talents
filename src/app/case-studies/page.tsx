import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Eye, Heart, Users, Play } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/fade-in";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Explore our successful influencer marketing campaigns. Real results, real impact, real partnerships.",
};

const caseStudies = [
  {
    id: "lifestyle-brand-launch",
    client: "Premium Lifestyle Brand",
    title: "Product Launch That Broke the Internet",
    category: "Lifestyle",
    image: "/case-studies/lifestyle.jpg",
    description:
      "How we helped a premium lifestyle brand achieve viral success with their product launch through strategic creator partnerships.",
    stats: [
      { label: "Impressions", value: "45M+", icon: Eye },
      { label: "Engagement Rate", value: "8.2%", icon: Heart },
      { label: "Sales Increase", value: "340%", icon: TrendingUp },
    ],
    creators: 12,
    platforms: ["Instagram", "TikTok", "YouTube"],
    featured: true,
  },
  {
    id: "tech-awareness",
    client: "Tech Startup",
    title: "From Unknown to Industry Leader",
    category: "Tech",
    image: "/case-studies/tech.jpg",
    description:
      "A comprehensive awareness campaign that positioned a tech startup as an industry thought leader.",
    stats: [
      { label: "Video Views", value: "28M+", icon: Play },
      { label: "Brand Mentions", value: "15K+", icon: Users },
      { label: "App Downloads", value: "500K+", icon: TrendingUp },
    ],
    creators: 8,
    platforms: ["YouTube", "Twitter"],
    featured: true,
  },
  {
    id: "fashion-sustainability",
    client: "Sustainable Fashion Brand",
    title: "Making Sustainability Trendy",
    category: "Fashion",
    image: "/case-studies/fashion.jpg",
    description:
      "Partnering with fashion creators to shift perception and drive adoption of sustainable fashion choices.",
    stats: [
      { label: "Reach", value: "62M+", icon: Eye },
      { label: "Engagement", value: "4.5M+", icon: Heart },
      { label: "Revenue Growth", value: "215%", icon: TrendingUp },
    ],
    creators: 15,
    platforms: ["Instagram", "TikTok", "Pinterest"],
    featured: true,
  },
  {
    id: "fitness-app-launch",
    client: "Fitness App",
    title: "Building a Fitness Community",
    category: "Fitness",
    image: "/case-studies/fitness.jpg",
    description:
      "Launching a fitness app with authentic creator partnerships that built a loyal community from day one.",
    stats: [
      { label: "Impressions", value: "35M+", icon: Eye },
      { label: "Sign-ups", value: "250K+", icon: Users },
      { label: "Retention Rate", value: "78%", icon: Heart },
    ],
    creators: 10,
    platforms: ["Instagram", "YouTube", "TikTok"],
    featured: false,
  },
  {
    id: "food-brand-awareness",
    client: "CPG Food Brand",
    title: "Recipe for Viral Success",
    category: "Food",
    image: "/case-studies/food.jpg",
    description:
      "Turning a traditional food brand into a social media sensation through creative recipe content.",
    stats: [
      { label: "Video Views", value: "52M+", icon: Play },
      { label: "Recipe Saves", value: "890K+", icon: Heart },
      { label: "Store Sales", value: "180%", icon: TrendingUp },
    ],
    creators: 20,
    platforms: ["TikTok", "Instagram", "YouTube"],
    featured: false,
  },
  {
    id: "beauty-launch",
    client: "Indie Beauty Brand",
    title: "From Indie to Icon",
    category: "Beauty",
    image: "/case-studies/beauty.jpg",
    description:
      "Helping an indie beauty brand compete with industry giants through authentic creator advocacy.",
    stats: [
      { label: "Earned Media Value", value: "$2.5M+", icon: TrendingUp },
      { label: "UGC Created", value: "5K+", icon: Users },
      { label: "Sales Growth", value: "420%", icon: TrendingUp },
    ],
    creators: 25,
    platforms: ["Instagram", "TikTok", "YouTube"],
    featured: false,
  },
];

const overallStats = [
  { value: "$50M+", label: "Campaign Value Delivered" },
  { value: "500M+", label: "Total Impressions" },
  { value: "95%", label: "Client Retention Rate" },
  { value: "300+", label: "Campaigns Executed" },
];

export default function CaseStudiesPage() {
  const featuredStudies = caseStudies.filter((study) => study.featured);
  const otherStudies = caseStudies.filter((study) => !study.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-accent/20 to-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-6">
                Our Work
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Campaigns That{" "}
                <span className="text-primary">Drive Results</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                We don&apos;t just connect brands with creators—we build
                partnerships that move the needle. Explore our case studies to
                see real impact in action.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Overall Stats */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {overallStats.map((stat) => (
              <StaggerItem key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Featured Case Studies */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Featured Campaigns
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Deep dives into our most impactful partnerships.
            </p>
          </FadeIn>

          <div className="space-y-12">
            {featuredStudies.map((study, index) => (
              <FadeIn key={study.id} delay={index * 0.1}>
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="aspect-video md:aspect-auto relative bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center min-h-[300px]">
                      <span className="text-6xl font-bold text-primary/20">
                        {study.category.charAt(0)}
                      </span>
                      <Badge className="absolute top-4 left-4 bg-primary">
                        Featured
                      </Badge>
                    </div>

                    {/* Content */}
                    <CardContent className="p-8 flex flex-col justify-center">
                      <Badge variant="outline" className="w-fit mb-4">
                        {study.category}
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-2">
                        {study.client}
                      </p>
                      <h3 className="text-2xl font-bold mb-4">{study.title}</h3>
                      <p className="text-muted-foreground mb-6">
                        {study.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {study.stats.map((stat) => (
                          <div key={stat.label}>
                            <div className="flex items-center gap-2 mb-1">
                              <stat.icon className="h-4 w-4 text-primary" />
                              <span className="text-lg font-bold">
                                {stat.value}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span>{study.creators} Creators</span>
                        <span>•</span>
                        <span>{study.platforms.join(", ")}</span>
                      </div>

                      <Button asChild className="w-fit group">
                        <Link href={`/case-studies/${study.id}`}>
                          View Full Case Study
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Other Case Studies Grid */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              More Success Stories
            </h2>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherStudies.map((study) => {
              const FirstStatIcon = study.stats[0].icon;
              return (
                <StaggerItem key={study.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                    <div className="aspect-video relative bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/20">
                        {study.category.charAt(0)}
                      </span>
                    </div>
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-3">
                        {study.category}
                      </Badge>
                      <p className="text-sm text-muted-foreground mb-1">
                        {study.client}
                      </p>
                      <h3 className="text-lg font-bold mb-3">{study.title}</h3>

                      {/* Key stat */}
                      <div className="flex items-center gap-2 mb-4 text-primary">
                        <FirstStatIcon className="h-4 w-4" />
                        <span className="font-bold">{study.stats[0].value}</span>
                        <span className="text-sm text-muted-foreground">
                          {study.stats[0].label}
                        </span>
                      </div>

                      <Button variant="ghost" size="sm" asChild className="group p-0">
                        <Link href={`/case-studies/${study.id}`}>
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to Create Your Success Story?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Let&apos;s discuss how we can help your brand achieve similar
                results with authentic creator partnerships.
              </p>
              <Button size="lg" asChild className="group">
                <Link href="/contact?type=brand">
                  Start a Conversation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
