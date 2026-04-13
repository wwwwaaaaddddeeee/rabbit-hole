import { generateText, Output } from "ai";
import { mistral } from "@ai-sdk/mistral";
import { z } from "zod";
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
      output: Output.object({
        schema: z.object({
          tags: z
            .array(z.string())
            .min(3)
            .max(7)
            .describe("3-7 short lowercase tags for this bookmark"),
        }),
      }),
      prompt: `Generate 3-7 short, lowercase tags for this bookmark. Tags should capture the topic, domain, and type of content. Be specific and useful for filtering.

Title: ${b.title}
URL: ${b.link}
Domain: ${b.domain}
Excerpt: ${b.excerpt || "none"}
Existing tags: ${b.raindropTags.length > 0 ? b.raindropTags.join(", ") : "none"}

Return only the tags array. Keep tags short (1-3 words each), lowercase, no hashtags.`,
    });

    const tags = result.output?.tags;
    if (!tags || tags.length === 0) {
      return b.raindropTags.length > 0 ? b.raindropTags : [];
    }

    return tags.map((t) => t.toLowerCase().trim()).slice(0, 7);
  } catch (error) {
    console.error(`Failed to generate tags for bookmark ${b.id}:`, error);
    return b.raindropTags.length > 0 ? b.raindropTags : [];
  }
}

export async function enrichWithTags(
  bookmarks: Omit<Bookmark, "aiTags">[]
): Promise<Bookmark[]> {
  const results: Bookmark[] = [];

  for (const bookmark of bookmarks) {
    const key = contentHash(bookmark);
    let tags = tagCache.get(key);

    if (!tags) {
      tags = await generateTags(bookmark);
      tagCache.set(key, tags);
    }

    results.push({ ...bookmark, aiTags: tags });
  }

  return results;
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
