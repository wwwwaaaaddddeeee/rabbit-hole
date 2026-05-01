"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Bookmark } from "@/lib/types";

type Props = {
  initial?: Bookmark | null;
  mode: "create" | "edit";
};

export function BookmarkForm({ initial, mode }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [url, setUrl] = useState(initial?.link ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [cover, setCover] = useState(initial?.cover ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [spotlightOrder, setSpotlightOrder] = useState(() =>
    String(initial?.spotlightOrder ?? 0)
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/admin/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            title: title || undefined,
            excerpt: excerpt || undefined,
            tags,
            featured,
            spotlightOrder: featured
              ? Number(spotlightOrder) || 0
              : null,
            skipOg: false,
          }),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? "Save failed");
        }
        const j = (await res.json()) as { id: number };
        router.push(`/admin/bookmarks/${j.id}/edit`);
        router.refresh();
        return;
      }

      if (!initial) return;
      const res = await fetch(`/api/admin/bookmarks/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url || undefined,
          title: title || undefined,
          excerpt: excerpt || undefined,
          cover: cover || undefined,
          tags,
          featured,
          spotlightOrder: featured
            ? Number(spotlightOrder) || 0
            : null,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Update failed");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  async function onRefreshOg() {
    if (!initial || mode === "create") return;
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/admin/refresh-og", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initial.id }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Refresh failed");
      }
      const j = (await res.json()) as { cover: string };
      if (j.cover) setCover(j.cover);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl">
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5" htmlFor="url">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required={mode === "create"}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label
          className="block text-xs font-medium text-zinc-500 mb-1.5"
          htmlFor="title"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label
          className="block text-xs font-medium text-zinc-500 mb-1.5"
          htmlFor="excerpt"
        >
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={3}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>
      {mode === "edit" && (
        <div>
          <label
            className="block text-xs font-medium text-zinc-500 mb-1.5"
            htmlFor="cover"
          >
            Cover image URL
          </label>
          <input
            id="cover"
            name="cover"
            type="url"
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
          />
        </div>
      )}
      <div>
        <label
          className="block text-xs font-medium text-zinc-500 mb-1.5"
          htmlFor="tags"
        >
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="design, music, dev"
          className="w-full rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured (spotlight pool)
        </label>
        {featured && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Order</span>
            <input
              type="number"
              min={0}
              max={99}
              className="w-16 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-sm"
              value={spotlightOrder}
              onChange={(e) => setSpotlightOrder(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900 disabled:opacity-50"
        >
          {pending ? "Saving…" : mode === "create" ? "Add bookmark" : "Save changes"}
        </button>
        {mode === "edit" && initial && (
          <button
            type="button"
            disabled={pending}
            onClick={onRefreshOg}
            className="rounded-md border border-zinc-200 dark:border-zinc-700 px-4 py-2 text-sm"
          >
            Refresh Open Graph
          </button>
        )}
      </div>
    </form>
  );
}
