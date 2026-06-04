import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { ContentType, Item } from "./types";

const CONTENT_DIR = join(process.cwd(), "content");

const ALLOWED: Record<ContentType, string> = {
  entries: "content/entries",
  posts: "content/posts",
  external: "content/external",
};

function excerptOf(body: string, max = 180): string {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

async function readType(type: ContentType): Promise<Item[]> {
  const dir = join(CONTENT_DIR, type);
  let files: string[];
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const items: Item[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const raw = await readFile(join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const html = await marked.parse(content);
    const date = data.date ? new Date(data.date).toISOString() : "";
    items.push({
      type,
      slug,
      title: data.title ?? slug,
      date,
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt ?? excerptOf(content),
      body: html,
      url: typeof data.url === "string" ? data.url : undefined,
    });
  }
  return items.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
}

export async function getAll(type: ContentType): Promise<Item[]> {
  return readType(type);
}

export async function getOne(type: ContentType, slug: string): Promise<Item | null> {
  const items = await readType(type);
  return items.find((i) => i.slug === slug) ?? null;
}

export async function getAllSlugs(type: ContentType): Promise<{ slug: string }[]> {
  const items = await readType(type);
  return items.map((i) => ({ slug: i.slug }));
}

export async function getAllItems(): Promise<Item[]> {
  const [a, b, c] = await Promise.all([readType("entries"), readType("posts"), readType("external")]);
  return [...a, ...b, ...c].sort((x, y) => (y.date > x.date ? 1 : y.date < x.date ? -1 : 0));
}

export function sourcePath(type: ContentType, slug: string): string {
  return `${ALLOWED[type]}/${slug}.md`;
}
