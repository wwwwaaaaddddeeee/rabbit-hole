import type { Bookmark, RaindropItem, RaindropResponse } from "./types";

const RAINDROP_API = "https://api.raindrop.io/rest/v1";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val || val.startsWith("your_"))
    throw new Error(`Missing env var: ${key}`);
  return val;
}

function mapRaindrop(item: RaindropItem): Omit<Bookmark, "aiTags"> {
  return {
    id: item._id,
    title: item.title,
    link: item.link,
    excerpt: item.excerpt || "",
    cover: item.cover || "",
    created: item.created,
    domain: item.domain || new URL(item.link).hostname,
    raindropTags: item.tags || [],
  };
}

export async function fetchBookmarks(
  page = 0,
  perPage = 50
): Promise<Omit<Bookmark, "aiTags">[]> {
  const token = getEnv("RAINDROP_TOKEN");
  const collectionId = getEnv("RAINDROP_COLLECTION_ID");

  const url = new URL(`${RAINDROP_API}/raindrops/${collectionId}`);
  url.searchParams.set("sort", "-created");
  url.searchParams.set("page", String(page));
  url.searchParams.set("perpage", String(Math.min(perPage, 50)));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    console.error(`Raindrop API error: ${res.status} ${res.statusText}`);
    return [];
  }

  const data: RaindropResponse = await res.json();

  if (!data.result) {
    console.error("Raindrop API returned result: false");
    return [];
  }

  return data.items.map(mapRaindrop);
}

export async function fetchAllBookmarks(): Promise<
  Omit<Bookmark, "aiTags">[]
> {
  const allBookmarks: Omit<Bookmark, "aiTags">[] = [];
  let page = 0;

  while (true) {
    const batch = await fetchBookmarks(page, 50);
    allBookmarks.push(...batch);
    if (batch.length < 50) break;
    page++;
  }

  return allBookmarks;
}
