"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";

type FormType = "brand" | "influencer";

interface FormData {
  name: string;
  email: string;
  company?: string;
  website?: string;
  socialHandle?: string;
  followers?: string;
  message: string;
  talentInterest?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  company: "",
  website: "",
  socialHandle: "",
  followers: "",
  message: "",
  talentInterest: "",
};

export default function ContactForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type") as FormType | null;
  const talentParam = searchParams.get("talent");

  const [activeTab, setActiveTab] = useState<FormType>(
    typeParam === "influencer" ? "influencer" : "brand"
  );
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    talentInterest: talentParam || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeParam === "influencer" || typeParam === "brand") {
      setActiveTab(typeParam);
    }
  }, [typeParam]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: activeTab,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSubmitted(true);
      setFormData(initialFormData);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Message Sent!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for reaching out. Our team will review your message and
            get back to you within 2-3 business days.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6">
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Let&apos;s <span className="text-primary">Connect</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Whether you&apos;re a brand looking for creator partnerships or a
              talented creator seeking representation, we&apos;d love to hear
              from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <Card className="bg-muted/30 border-0">
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <a
                            href="mailto:hello@amietalents.com"
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            hello@amietalents.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <a
                            href="tel:+1234567890"
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            (123) 456-7890
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            Los Angeles, CA
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-4">Follow Us</h3>
                    <div className="flex gap-3">
                      <a
                        href="https://instagram.com/amietalents"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                      <a
                        href="https://twitter.com/amietalents"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a
                        href="https://linkedin.com/company/amietalents"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 2-3 business days. For urgent
                      inquiries, please call us directly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Forms */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => setActiveTab(v as FormType)}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="brand">I&apos;m a Brand</TabsTrigger>
                      <TabsTrigger value="influencer">
                        I&apos;m a Creator
                      </TabsTrigger>
                    </TabsList>

                    <CardContent className="pt-6 px-0">
                      {error && (
                        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {/* Brand Form */}
                      <TabsContent value="brand" className="mt-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="brand-name">Your Name *</Label>
                              <Input
                                id="brand-name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Smith"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="brand-email">Work Email *</Label>
                              <Input
                                id="brand-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@company.com"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="brand-company">
                                Company Name *
                              </Label>
                              <Input
                                id="brand-company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                placeholder="Company Inc."
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="brand-website">Website</Label>
                              <Input
                                id="brand-website"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                placeholder="https://company.com"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="brand-talent">
                              Interested in specific talent?
                            </Label>
                            <Input
                              id="brand-talent"
                              name="talentInterest"
                              value={formData.talentInterest}
                              onChange={handleInputChange}
                              placeholder="e.g., Sarah Chen, or leave blank for general inquiry"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="brand-message">
                              Tell us about your project *
                            </Label>
                            <Textarea
                              id="brand-message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              placeholder="Describe your campaign goals, timeline, and any specific requirements..."
                              rows={5}
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Inquiry
                                <Send className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>

                      {/* Influencer Form */}
                      <TabsContent value="influencer" className="mt-0">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="inf-name">Your Name *</Label>
                              <Input
                                id="inf-name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your full name"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="inf-email">Email *</Label>
                              <Input
                                id="inf-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@email.com"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="inf-handle">
                                Primary Social Handle *
                              </Label>
                              <Input
                                id="inf-handle"
                                name="socialHandle"
                                value={formData.socialHandle}
                                onChange={handleInputChange}
                                placeholder="@yourhandle"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="inf-followers">
                                Total Followers *
                              </Label>
                              <Input
                                id="inf-followers"
                                name="followers"
                                value={formData.followers}
                                onChange={handleInputChange}
                                placeholder="e.g., 50K, 500K, 1M"
                                required
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="inf-website">
                              Website or Media Kit Link
                            </Label>
                            <Input
                              id="inf-website"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              placeholder="https://yourwebsite.com or link to media kit"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="inf-message">
                              Tell us about yourself *
                            </Label>
                            <Textarea
                              id="inf-message"
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              placeholder="Share your content niche, what platforms you're on, your goals, and why you'd like to work with Amie Talents..."
                              rows={5}
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                Submit Application
                                <Send className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
