import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/fade-in";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Amie Talents privacy policy - how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-6">
                Legal
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mb-4">
                Last updated: January 1, 2025
              </p>

              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h2>1. Introduction</h2>
                <p>
                  Amie Talents (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is
                  committed to protecting your personal data. This privacy policy explains
                  how we collect, use, disclose, and safeguard your information when you
                  visit our website or use our services.
                </p>

                <h2>2. Information We Collect</h2>
                <h3>Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide, including:</p>
                <ul>
                  <li>Name and contact information (email, phone number)</li>
                  <li>Company name and job title</li>
                  <li>Social media handles and profile information</li>
                  <li>Portfolio links and content samples</li>
                  <li>Communication preferences</li>
                </ul>

                <h3>Automatically Collected Information</h3>
                <p>When you visit our website, we automatically collect:</p>
                <ul>
                  <li>IP address and browser type</li>
                  <li>Device information</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring website addresses</li>
                </ul>

                <h2>3. How We Use Your Information</h2>
                <p>We use collected information to:</p>
                <ul>
                  <li>Provide and improve our services</li>
                  <li>Process applications and inquiries</li>
                  <li>Match creators with brand opportunities</li>
                  <li>Send newsletters and marketing communications (with consent)</li>
                  <li>Analyze website usage and improve user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>4. Information Sharing</h2>
                <p>
                  We may share your information with:
                </p>
                <ul>
                  <li>Brand partners (for creators seeking partnerships)</li>
                  <li>Service providers who assist our operations</li>
                  <li>Legal authorities when required by law</li>
                </ul>
                <p>
                  We do not sell your personal information to third parties.
                </p>

                <h2>5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect
                  your personal data against unauthorized access, alteration, disclosure, or
                  destruction. However, no method of transmission over the Internet is 100%
                  secure.
                </p>

                <h2>6. Your Rights</h2>
                <p>Depending on your location, you may have the right to:</p>
                <ul>
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Object to or restrict processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent</li>
                </ul>

                <h2>7. Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing
                  experience. You can control cookie settings through your browser
                  preferences.
                </p>

                <h2>8. Third-Party Links</h2>
                <p>
                  Our website may contain links to third-party websites. We are not
                  responsible for their privacy practices and encourage you to review their
                  policies.
                </p>

                <h2>9. Children&apos;s Privacy</h2>
                <p>
                  Our services are not intended for individuals under 18. We do not
                  knowingly collect personal information from children.
                </p>

                <h2>10. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy periodically. We will notify you of
                  significant changes by posting the new policy on this page and updating
                  the &quot;Last updated&quot; date.
                </p>

                <h2>11. Contact Us</h2>
                <p>
                  If you have questions about this privacy policy or our practices, please
                  contact us at:
                </p>
                <ul>
                  <li>Email: privacy@amietalents.com</li>
                  <li>Address: Los Angeles, CA</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
