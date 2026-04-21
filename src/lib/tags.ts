import { generateText } from "ai";
import { mistral } from "@ai-sdk/mistral";
import type { Bookmark } from "./types";

const tagCache = new Map<string, string[]>();

function contentHash(b: Omit<Bookmark, "aiTags">): string {
  const raw = `${b.id}:${b.title}:${b.link}:${b.excerpt}:${b.raindropTags.join(",")}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
  }
  return `${b.id}:${hash}`;
}

async function generateTags(
  b: Omit<Bookmark, "aiTags">
): Promise<string[]> {
  try {
    const result = await generateText({
      model: mistral("mistral-small-latest"),
      prompt: `Generate 3-7 short, lowercase tags for this bookmark. Respond with ONLY a JSON array of strings, nothing else.

Title: ${b.title}
URL: ${b.link}
Domain: ${b.domain}
Excerpt: ${b.excerpt || "none"}
Existing tags: ${b.raindropTags.length > 0 ? b.raindropTags.join(", ") : "none"}

Keep tags short (1-3 words each), lowercase, no hashtags. Example: ["design","react","tutorial"]`,
    });

    const text = result.text.trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      return b.raindropTags.length > 0 ? b.raindropTags : [];
    }
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return b.raindropTags.length > 0 ? b.raindropTags : [];
    }
    return parsed
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.toLowerCase().trim())
      .slice(0, 7);
  } catch (error) {
    console.error(`Failed to generate tags for bookmark ${b.id}:`, error);
    return b.raindropTags.length > 0 ? b.raindropTags : [];
  }
}

export async function enrichWithTags(
  bookmarks: Omit<Bookmark, "aiTags">[]
): Promise<Bookmark[]> {
  return Promise.all(
    bookmarks.map(async (bookmark) => {
      const key = contentHash(bookmark);
      let tags = tagCache.get(key);
      if (!tags) {
        tags = await generateTags(bookmark);
        tagCache.set(key, tags);
      }
      return { ...bookmark, aiTags: tags };
    })
  );
}

export function getAllCachedTags(): Map<string, number> {
  const tagCounts = new Map<string, number>();

  for (const tags of tagCache.values()) {
    for (const tag of tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  return tagCounts;
}
