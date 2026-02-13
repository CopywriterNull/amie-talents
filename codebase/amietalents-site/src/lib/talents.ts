export interface Talent {
  id: string;
  name: string;
  handle: string;
  category: string;
  categories: string[];
  bio: string;
  image: string;
  featured: boolean;
  socials: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
  };
}

export const talents: Talent[] = [
  {
    id: "helen",
    name: "Helen",
    handle: "@helenpenggg",
    category: "Dance",
    categories: ["Dance", "Fashion"],
    bio: "Dance and fashion content creator bringing energy and style to every collaboration.",
    image: "/talent/helen.jpg",
    featured: true,
    socials: {
      instagram: "https://www.instagram.com/helenpenggg/",
      tiktok: "https://www.tiktok.com/@helenpenggg",
      youtube: "https://www.youtube.com/@HelenPeng",
    },
  },
  {
    id: "kai",
    name: "Kai",
    handle: "@_kaiichu",
    category: "Beauty",
    categories: ["Beauty", "Lifestyle"],
    bio: "Beauty and lifestyle creator sharing authentic content and creative inspiration.",
    image: "/talent/kai.jpg",
    featured: true,
    socials: {
      instagram: "https://www.instagram.com/_kaiichu/",
      tiktok: "https://www.tiktok.com/@_kaiichu",
    },
  },
  {
    id: "alice",
    name: "Alice",
    handle: "@2.asc",
    category: "Makeup",
    categories: ["Makeup", "Beauty", "Fashion"],
    bio: "Makeup artist and beauty creator showcasing stunning looks and fashion inspiration.",
    image: "/talent/alice.jpg",
    featured: true,
    socials: {
      instagram: "https://www.instagram.com/2.asc/",
      tiktok: "https://www.tiktok.com/@2.asc",
      youtube: "https://www.youtube.com/channel/UCpBVydCzRu2DVBp7vFx52jA",
    },
  },
  {
    id: "laura",
    name: "Laura",
    handle: "@laurahwclx",
    category: "Fashion",
    categories: ["Fashion"],
    bio: "Fashion influencer curating trendy looks and style inspiration.",
    image: "/talent/laura.jpg",
    featured: true,
    socials: {
      instagram: "https://www.instagram.com/laurahwclx/",
      tiktok: "https://www.tiktok.com/@laurahwclx",
    },
  },
  {
    id: "erica",
    name: "Erica",
    handle: "@erica.syl",
    category: "Fashion",
    categories: ["Fashion", "Beauty", "Lifestyle"],
    bio: "Fashion, beauty, and lifestyle creator sharing everyday inspiration and authentic moments.",
    image: "/talent/erica.jpg",
    featured: true,
    socials: {
      instagram: "https://www.instagram.com/erica.syl/",
      tiktok: "https://www.tiktok.com/@erica.syl",
      youtube: "https://www.youtube.com/@ericasyl",
    },
  },
  {
    id: "niwa",
    name: "Niwa",
    handle: "@kneewah",
    category: "Makeup",
    categories: ["Makeup", "Beauty", "Fashion"],
    bio: "Makeup and beauty expert creating stunning transformations and fashion content.",
    image: "/talent/niwa.jpg",
    featured: false,
    socials: {
      instagram: "https://www.instagram.com/kneewah/",
      tiktok: "https://www.tiktok.com/@kneewah",
      youtube: "https://www.youtube.com/channel/UCGQDm73EWtR150vKtGSSfuA",
    },
  },
  {
    id: "katie",
    name: "Katie",
    handle: "@kqtei",
    category: "Dance",
    categories: ["Dance", "Fashion"],
    bio: "Dance content creator bringing movement and fashion together in creative ways.",
    image: "/talent/katie.jpg",
    featured: false,
    socials: {
      instagram: "https://www.instagram.com/kqtei",
      tiktok: "https://www.tiktok.com/@kqtei",
      youtube: "https://www.youtube.com/@kqtei",
    },
  },
  {
    id: "lia",
    name: "Lia",
    handle: "@sunnyliachoi",
    category: "Lifestyle",
    categories: ["Lifestyle"],
    bio: "Lifestyle creator sharing sunny vibes and everyday moments.",
    image: "/talent/lia.jpg",
    featured: false,
    socials: {
      instagram: "https://www.instagram.com/sunnyliachoi/",
      tiktok: "https://www.tiktok.com/@sunnyliachoi",
      youtube: "https://www.youtube.com/@sunnyliachoi",
    },
  },
];

export const categories = [
  "All",
  "Dance",
  "Fashion",
  "Beauty",
  "Makeup",
  "Lifestyle",
];

export function getTalentById(id: string): Talent | undefined {
  return talents.find((t) => t.id === id);
}

export function getFeaturedTalents(): Talent[] {
  return talents.filter((t) => t.featured);
}

export function getTalentsByCategory(category: string): Talent[] {
  if (category === "All") return talents;
  return talents.filter((t) => t.categories.includes(category));
}
