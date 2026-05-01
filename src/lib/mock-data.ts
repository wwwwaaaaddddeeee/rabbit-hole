import type { Bookmark } from "./types";

export const MOCK_BOOKMARKS: Bookmark[] = [
  {
    id: 1,
    title:
      "The Art of Noticing — How to Reclaim Your Attention in the Age of Distraction",
    link: "https://robwalker.substack.com/p/the-art-of-noticing",
    excerpt:
      "A guide to seeing the world more clearly by paying attention to what others overlook. Small practices that change how you move through your day.",
    cover:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    created: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    domain: "robwalker.substack.com",
    tags: ["attention", "creativity"],
    featured: true,
    spotlightOrder: 0,
  },
  {
    id: 2,
    title: "Linear — The Issue Tracking Tool Designers Actually Love",
    link: "https://linear.app",
    excerpt:
      "Streamlined project management built for modern software teams. Keyboard-first, blazingly fast, beautifully designed.",
    cover: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop",
    created: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    domain: "linear.app",
    tags: ["tools"],
    featured: true,
    spotlightOrder: 1,
  },
  {
    id: 3,
    title: "BAMBA!!",
    link: "https://open.spotify.com/track/example",
    excerpt: "Nick Satchel, Dp0mmy · WOODSTOCK '99 · Song · 2024",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    created: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    domain: "open.spotify.com",
    tags: ["music"],
    featured: false,
  },
  {
    id: 4,
    title: "Tailwind CSS v4.0 — A New Engine, a New Era",
    link: "https://tailwindcss.com/blog/tailwindcss-v4",
    excerpt:
      "A ground-up rewrite of the framework with a new high-performance engine written in Rust, bringing massive speed improvements.",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=200&h=200&fit=crop",
    created: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    domain: "tailwindcss.com",
    tags: ["css", "dev"],
    featured: false,
  },
  {
    id: 5,
    title: "Why Your Brain Needs More Downtime",
    link: "https://www.scientificamerican.com/article/mental-downtime/",
    excerpt:
      "Research confirms that mental breaks increase productivity, replenish attention, and solidify memories. Your brain does its best work when you stop trying.",
    cover: "",
    created: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    domain: "scientificamerican.com",
    tags: [],
    featured: false,
  },
  {
    id: 6,
    title:
      "Teenage Engineering OP-1 Field — A Portable Synthesizer That's Also a Piece of Art",
    link: "https://teenage.engineering/products/op-1-field",
    excerpt:
      "The second generation of the iconic portable synthesizer. New engine, new codec, same unmistakable design language.",
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
    created: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    domain: "teenage.engineering",
    tags: ["music", "hardware"],
    featured: false,
  },
  {
    id: 7,
    title: "Dieter Rams: 10 Principles of Good Design",
    link: "https://readymag.com/shuffle/dieter-rams/",
    excerpt:
      "Less, but better. The timeless design philosophy that shaped Apple, Braun, and an entire generation of product thinkers.",
    cover: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
    created: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    domain: "readymag.com",
    tags: ["design"],
    featured: true,
    spotlightOrder: 2,
  },
  {
    id: 8,
    title: "How Aphex Twin Changed Electronic Music Forever",
    link: "https://pitchfork.com/features/aphex-twin-legacy/",
    excerpt:
      "From ambient soundscapes to drill-and-bass chaos, Richard D. James built a universe of sound that still defies categorization.",
    cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200&fit=crop",
    created: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    domain: "pitchfork.com",
    tags: ["music"],
    featured: false,
  },
];

export function splitMockForHome(source: Bookmark[] = MOCK_BOOKMARKS): {
  spotlight: Bookmark[];
  archive: Bookmark[];
} {
  const featured = source
    .filter((b) => b.featured)
    .sort((a, b) => a.id - b.id);
  const spotlight = featured.slice(0, 3);
  const inSpot = new Set(spotlight.map((b) => b.id));
  const archive = source
    .filter((b) => !inSpot.has(b.id))
    .sort(
      (a, b) =>
        new Date(b.created).getTime() - new Date(a.created).getTime()
    );
  return { spotlight, archive };
}
