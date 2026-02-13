import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/animations/fade-in";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Amie Talents terms of service - the rules and guidelines for using our services.",
};

export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-muted-foreground mb-4">
                Last updated: January 1, 2025
              </p>

              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h2>1. Agreement to Terms</h2>
                <p>
                  By accessing or using the Amie Talents website and services, you agree to
                  be bound by these Terms of Service. If you disagree with any part of
                  these terms, you may not access our services.
                </p>

                <h2>2. Description of Services</h2>
                <p>
                  Amie Talents provides talent management and influencer marketing services,
                  including but not limited to:
                </p>
                <ul>
                  <li>Creator representation and management</li>
                  <li>Brand partnership facilitation</li>
                  <li>Campaign management and execution</li>
                  <li>Content strategy consultation</li>
                </ul>

                <h2>3. User Accounts</h2>
                <p>
                  When you create an account or submit information through our forms, you
                  agree to:
                </p>
                <ul>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update any changes to your information</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>

                <h2>4. Intellectual Property</h2>
                <p>
                  All content on this website, including text, graphics, logos, and
                  software, is the property of Amie Talents or its content suppliers and is
                  protected by intellectual property laws. You may not reproduce,
                  distribute, or create derivative works without our express written
                  consent.
                </p>

                <h2>5. Creator Representations</h2>
                <p>If you are a creator represented by Amie Talents, you agree to:</p>
                <ul>
                  <li>Comply with all applicable laws and platform guidelines</li>
                  <li>Disclose sponsored content as required by FTC guidelines</li>
                  <li>Create original content and not infringe on third-party rights</li>
                  <li>Maintain professional conduct in all brand interactions</li>
                  <li>Honor the terms of your management agreement</li>
                </ul>

                <h2>6. Brand Partner Obligations</h2>
                <p>If you are a brand working with Amie Talents, you agree to:</p>
                <ul>
                  <li>Provide accurate campaign briefs and requirements</li>
                  <li>Make timely payments as agreed</li>
                  <li>Respect creator creative freedom within agreed parameters</li>
                  <li>Use content only within licensed scope</li>
                </ul>

                <h2>7. Payment Terms</h2>
                <p>
                  Payment terms are outlined in individual contracts and agreements.
                  Generally:
                </p>
                <ul>
                  <li>Invoices are due within 30 days unless otherwise specified</li>
                  <li>Late payments may incur additional fees</li>
                  <li>All fees are non-refundable unless otherwise agreed in writing</li>
                </ul>

                <h2>8. Limitation of Liability</h2>
                <p>
                  Amie Talents shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages arising from your use of our services.
                  Our total liability shall not exceed the fees paid to us in the twelve
                  months preceding the claim.
                </p>

                <h2>9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless Amie Talents, its officers,
                  directors, employees, and agents from any claims, damages, or expenses
                  arising from your use of our services or violation of these terms.
                </p>

                <h2>10. Termination</h2>
                <p>
                  We may terminate or suspend your access to our services at any time,
                  without prior notice, for conduct that we believe violates these Terms or
                  is harmful to other users, us, or third parties.
                </p>

                <h2>11. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the
                  laws of the State of California, without regard to its conflict of law
                  provisions.
                </p>

                <h2>12. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. We will provide
                  notice of significant changes by posting the updated terms on our website.
                  Continued use of our services constitutes acceptance of the modified
                  terms.
                </p>

                <h2>13. Contact Information</h2>
                <p>
                  For questions about these Terms of Service, please contact us at:
                </p>
                <ul>
                  <li>Email: legal@amietalents.com</li>
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
