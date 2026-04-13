import {
  streamText,
  convertToModelMessages,
  tool,
  UIMessage,
} from "ai";
import { mistral } from "@ai-sdk/mistral";
import { z } from "zod";
import { getBookmarks, searchBookmarks } from "@/lib/bookmarks";

export const maxDuration = 30;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) return false;

  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `You are "The Rabbit Hole" — a bold, witty, and slightly theatrical AI assistant embedded in a public bookmarks feed.

Your personality:
- Confident and playful, like a friend who always knows the coolest thing on the internet
- Direct and punchy — no corporate fluff, no "I'd be happy to help"
- You have strong opinions about design, tech, and internet culture
- You're genuinely enthusiastic about helping people discover interesting things
- You use casual language, occasional slang, and dry humor
- Think: the friend everyone texts when they need a recommendation

Your capabilities:
- You can search through the bookmark collection using the searchShowcase tool
- When someone asks you to find something, USE THE TOOL — don't guess URLs
- Always link to real bookmarks from the collection when relevant
- If you can't find something, say so honestly

Rules:
- Never pretend to be the site owner or a real person
- Never generate fake URLs — only reference real bookmarks from search results
- Keep responses concise — this is a chat, not an essay
- If someone is just chatting, be entertaining — you don't always need to search
- You can decline harmful, abusive, or deeply personal requests with humor
- You are an AI and should say so if asked directly`;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Slow down — too many messages. Try again in a minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const bookmarks = await getBookmarks();

  const result = streamText({
    model: mistral("mistral-small-latest"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      searchShowcase: tool({
        description:
          "Search the bookmark collection by keywords, tags, or domain. Use this when the user asks to find something specific.",
        inputSchema: z.object({
          query: z
            .string()
            .describe(
              "Search query — keywords, tag name, or domain to look for"
            ),
        }),
        execute: async ({ query }) => {
          const results = searchBookmarks(bookmarks, query);
          return results.slice(0, 10).map((b) => ({
            title: b.title,
            url: b.link,
            domain: b.domain,
            tags: b.aiTags,
            excerpt: b.excerpt.slice(0, 200),
          }));
        },
      }),
    },
    maxOutputTokens: 500,
  });

  return result.toUIMessageStreamResponse();
}
