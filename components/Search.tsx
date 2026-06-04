"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

type Item = {
  type: "entries" | "posts" | "external";
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: string;
  url?: string;
  path: string;
};

const TYPE_LABEL: Record<Item["type"], string> = {
  entries: "Entry",
  posts: "Post",
  external: "External",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function Search() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/index.json")
      .then((r) => r.json())
      .then((data: Item[]) =>
        setItems(
          data.map((d) => ({
            ...d,
            body: stripHtml(d.body).slice(0, 4000),
          })),
        ),
      )
      .catch(() => setItems([]));
  }, []);

  const fuse = useMemo(
    () =>
      items
        ? new Fuse(items, {
            keys: [
              { name: "title", weight: 0.5 },
              { name: "tags", weight: 0.2 },
              { name: "excerpt", weight: 0.2 },
              { name: "body", weight: 0.1 },
            ],
            threshold: 0.35,
            ignoreLocation: true,
            includeMatches: false,
          })
        : null,
    [items],
  );

  const results = useMemo(() => {
    if (!fuse) return [];
    const q = query.trim();
    if (!q) return items ?? [];
    return fuse.search(q).map((r) => r.item);
  }, [fuse, query, items]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search entries, posts, external…"
        autoFocus
        className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-500"
      />
      <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
        {items === null
          ? "Loading…"
          : query.trim()
            ? `${results.length} result${results.length === 1 ? "" : "s"}`
            : `${items.length} item${items.length === 1 ? "" : "s"}`}
      </p>
      <ul className="mt-4 space-y-4">
        {results.map((item) => (
          <li key={`${item.type}/${item.slug}`} className="border-b border-neutral-200 pb-4 last:border-0 dark:border-neutral-800">
            <div className="flex items-baseline justify-between gap-3">
              <Link
                href={`/${item.type}/${item.slug}`}
                className="font-medium hover:underline"
              >
                {item.title}
              </Link>
              <span className="text-[10px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                {TYPE_LABEL[item.type]}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
