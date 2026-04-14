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