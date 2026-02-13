import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Amie Talents | Influencer & Creator Management",
    template: "%s | Amie Talents",
  },
  description:
    "Amie Talents is a boutique talent management agency connecting brands with authentic influencers and content creators. We build partnerships that resonate.",
  keywords: [
    "talent management",
    "influencer agency",
    "content creators",
    "brand partnerships",
    "influencer marketing",
    "creator economy",
  ],
  authors: [{ name: "Amie Talents" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Amie Talents",
    title: "Amie Talents | Influencer & Creator Management",
    description:
      "Connecting brands with authentic influencers and content creators. We build partnerships that resonate.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amie Talents | Influencer & Creator Management",
    description:
      "Connecting brands with authentic influencers and content creators.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
