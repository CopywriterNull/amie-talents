"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

const brandFaqs = [
  {
    question: "How do you match brands with creators?",
    answer:
      "We use a combination of data analysis and human expertise to find the perfect creator matches. We consider audience demographics, engagement rates, content style, brand values alignment, and past campaign performance. Our team personally vets every creator to ensure authentic partnerships.",
  },
  {
    question: "What types of campaigns do you manage?",
    answer:
      "We handle everything from one-off sponsored posts to long-term brand ambassador programs. This includes product launches, awareness campaigns, content series, event activations, affiliate programs, and integrated marketing campaigns across multiple platforms.",
  },
  {
    question: "How is campaign success measured?",
    answer:
      "We track comprehensive metrics including reach, impressions, engagement rate, click-through rates, conversions, and ROI. We provide detailed reporting with actionable insights after every campaign, and we set clear KPIs upfront so success is measurable.",
  },
  {
    question: "What's your pricing model?",
    answer:
      "Our pricing varies based on campaign scope, creator tier, and deliverables. We work with budgets of all sizes and can create custom packages. Contact us for a detailed proposal tailored to your specific goals and budget.",
  },
  {
    question: "How long does it take to launch a campaign?",
    answer:
      "Typical timelines range from 2-4 weeks for simple campaigns to 6-8 weeks for larger, multi-creator initiatives. This includes creator selection, briefing, content creation, approval, and posting. Rush campaigns are possible with adjusted timelines.",
  },
  {
    question: "Do you handle contracts and payments?",
    answer:
      "Yes, we manage all contractual agreements and payments. We handle creator negotiations, usage rights, exclusivity clauses, and ensure all legal requirements are met. This protects both your brand and our creators.",
  },
];

const creatorFaqs = [
  {
    question: "What do I need to apply for representation?",
    answer:
      "We look for creators with engaged audiences (not just follower counts), consistent content quality, professional communication, and authentic personal brands. Typically, we work with creators who have 50K+ followers, though exceptions are made for exceptional talent.",
  },
  {
    question: "What services do you provide to creators?",
    answer:
      "We offer full-service management including brand deal sourcing and negotiation, contract review, career strategy, content guidance, platform growth support, and business development. We're your partners in building a sustainable creator career.",
  },
  {
    question: "What's your commission structure?",
    answer:
      "We typically work on a commission basis, taking a percentage of deals we secure for you. The exact rate depends on the level of service and exclusivity. We'll discuss specifics during the application process—our goal is always to grow your earnings.",
  },
  {
    question: "Do I need to be exclusive with Amie Talents?",
    answer:
      "We offer both exclusive and non-exclusive representation options. Exclusive creators receive priority access to opportunities and more hands-on management. We'll discuss what arrangement works best for your situation.",
  },
  {
    question: "How do you find brand partnerships for me?",
    answer:
      "We actively pitch you to brands that align with your content and values. We also receive inbound requests from brands specifically looking for creators like you. Our extensive network means more opportunities than you'd find on your own.",
  },
  {
    question: "How long is the typical contract term?",
    answer:
      "Initial contracts are typically 1 year, with options to renew. This gives both parties time to build a strong working relationship and see meaningful results. We're flexible and focused on long-term partnerships.",
  },
];

const generalFaqs = [
  {
    question: "What makes Amie Talents different from other agencies?",
    answer:
      "We're a boutique agency, which means personalized attention for every creator and brand we work with. We're not just matching follower counts—we build authentic partnerships based on genuine alignment. Our team has deep industry experience and genuine passion for the creator economy.",
  },
  {
    question: "What platforms do you specialize in?",
    answer:
      "We work across all major platforms including Instagram, TikTok, YouTube, Twitter, LinkedIn, Pinterest, and emerging platforms. Our creators are multi-platform, and we help brands navigate the right mix for their goals.",
  },
  {
    question: "Where are you located?",
    answer:
      "We're headquartered in Los Angeles but work with creators and brands globally. Our team operates remotely, allowing us to stay connected with the digital-first nature of the creator economy.",
  },
  {
    question: "How do I get started?",
    answer:
      "For brands: reach out through our contact form with details about your goals, and we'll schedule a discovery call. For creators: submit an application through our talent form, and our team will review your profile within a week.",
  },
];

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={`overflow-hidden transition-all ${
        isOpen ? "shadow-md" : "hover:shadow-sm"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-start justify-between text-left"
      >
        <span className="font-semibold pr-4">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mt-1"
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="pt-0 pb-6 px-6">
              <p className="text-muted-foreground">{answer}</p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function FAQList({ faqs }: { faqs: typeof brandFaqs }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6">
                <HelpCircle className="h-3 w-3 mr-1" />
                FAQ
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Frequently Asked <span className="text-primary">Questions</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Everything you need to know about working with Amie Talents.
                Can&apos;t find what you&apos;re looking for? Reach out to our
                team.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Tabs defaultValue="brands" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="brands">For Brands</TabsTrigger>
                <TabsTrigger value="creators">For Creators</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
              </TabsList>

              <TabsContent value="brands">
                <FadeIn>
                  <FAQList faqs={brandFaqs} />
                </FadeIn>
              </TabsContent>

              <TabsContent value="creators">
                <FadeIn>
                  <FAQList faqs={creatorFaqs} />
                </FadeIn>
              </TabsContent>

              <TabsContent value="general">
                <FadeIn>
                  <FAQList faqs={generalFaqs} />
                </FadeIn>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Still Have Questions?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our team is here to help. Reach out and we&apos;ll get back to
                you within 24 hours.
              </p>
              <Button size="lg" asChild className="group">
                <Link href="/contact">
                  Contact Us
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
