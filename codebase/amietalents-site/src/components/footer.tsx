import Link from "next/link";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { NewsletterSignup } from "@/components/newsletter-signup";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/talent", label: "Our Talent" },
    { href: "/contact", label: "Contact" },
  ],
  talent: [
    { href: "/contact?type=influencer", label: "Join Our Roster" },
    { href: "/services", label: "What We Offer" },
  ],
  brands: [
    { href: "/contact?type=brand", label: "Work With Us" },
    { href: "/talent", label: "Browse Talent" },
    { href: "/services", label: "Our Services" },
  ],
};

const socialLinks = [
  { href: "https://instagram.com/amietalents", icon: Instagram, label: "Instagram" },
  { href: "https://twitter.com/amietalents", icon: Twitter, label: "Twitter" },
  { href: "https://linkedin.com/company/amietalents", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:hello@amietalents.com", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block group">
              <span className="text-xl font-bold tracking-tight">
                Amie<span className="text-primary transition-colors group-hover:text-primary/80">Talents</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Connecting brands with authentic influencers and content creators.
              We build partnerships that resonate.
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 transform"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Talent */}
          <div>
            <h3 className="font-semibold text-sm mb-4">For Talent</h3>
            <ul className="space-y-3">
              {footerLinks.talent.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Brands */}
          <div>
            <h3 className="font-semibold text-sm mb-4">For Brands</h3>
            <ul className="space-y-3">
              {footerLinks.brands.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-1">
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Amie Talents. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
