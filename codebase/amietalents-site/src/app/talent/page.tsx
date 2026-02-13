import { Metadata } from "next";
import { TalentPageContent } from "./talent-page-content";

export const metadata: Metadata = {
  title: "Our Talent",
  description:
    "Browse our roster of talented influencers and content creators across lifestyle, tech, fashion, fitness, and more.",
};

export default function TalentPage() {
  return <TalentPageContent />;
}
