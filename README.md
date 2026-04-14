# rabit.wtf

> things found on the internet

A minimal, public-facing bookmarks feed powered by [Raindrop.io](https://raindrop.io) and AI. Save a link to your Raindrop collection and it shows up on rabit.wtf within seconds — automatically tagged, searchable, and browsable by anyone.

---

## Overview

rabit.wtf is a single-page web app that pulls bookmarks from a dedicated Raindrop.io collection and displays them as a clean, scrollable feed. Each bookmark is automatically enriched with AI-generated tags using Mistral Small 3.1. Visitors can filter by tag, browse the feed, or chat with an AI agent ("The Rabbit Hole") that can search the collection and answer questions.

### Key Features

- **Live bookmark feed** — New bookmarks appear within ~15 seconds of being saved to Raindrop
- **AI-generated tags** — Mistral Small 3.1 analyzes each bookmark and generates relevant tags, cached per bookmark
- **Tag filtering** — Click any tag to filter the feed; only tags with 2+ bookmarks appear in the top filter bar
- **AI chat agent** — "The Rabbit Hole" lives in a floating drawer, has a bold personality, and can search the bookmark collection
- **Weather pill** — Header displays the visitor's city, local time, and live weather (via Open-Meteo)
- **System light/dark mode** — Respects `prefers-color-scheme`
- **Responsive** — Single-column layout optimized for all screen sizes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Animation** | Framer Motion |
| **AI SDK** | Vercel AI SDK v6 (`ai`, `@ai-sdk/react`) |
| **LLM Provider** | Mistral Small 3.1 (`@ai-sdk/mistral`) |
| **Data Source** | Raindrop.io REST API |
| **Weather** | Open-Meteo API (free, no key) |
| **Geolocation** | Browser Geolocation API + ipapi.co fallback |
| **Hosting** | Vercel |
| **Domain** | Namecheap (DNS via Vercel) |
| **Font** | Geist Sans (via `next/font`) |

---

## Architecture

```
Browser → Next.js (Vercel)
              │
              ├── Server Component (page.tsx)
              │     └── getBookmarks()
              │           ├── Raindrop.io API → fetch collection
              │           └── Mistral Small 3.1 → generate tags (cached)
              │
              ├── API Route: /api/chat
              │     ├── streamText (Mistral Small 3.1)
              │     └── searchShowcase tool → keyword search bookmarks
              │
              └── API Route: /api/weather
                    └── Open-Meteo API → daily forecast
```

### Data Flow

1. User visits rabit.wtf
2. Server component fetches all bookmarks from Raindrop collection
3. Each bookmark is enriched with AI tags (Mistral) — results cached in-memory by content hash
4. Feed renders server-side, hydrates client-side with Framer Motion animations
5. Tag filter bar shows tags appearing on 2+ bookmarks
6. Chat drawer connects to `/api/chat` for streaming AI responses