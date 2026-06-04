import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = process.cwd();
const TYPES = ["entries", "posts", "external"];

function excerptOf(body, max = 220) {
  const text = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

async function build() {
  const items = [];
  for (const type of TYPES) {
    const dir = join(ROOT, "content", type);
    let files = [];
    try {
      files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
    } catch {
      continue;
    }
    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const raw = await readFile(join(dir, file), "utf8");
      const { data, content } = matter(raw);
      items.push({
        type,
        slug,
        title: data.title ?? slug,
        date: data.date ? new Date(data.date).toISOString() : "",
        tags: Array.isArray(data.tags) ? data.tags : [],
        excerpt: data.excerpt ?? excerptOf(content),
        body: await marked.parse(content),
        url: typeof data.url === "string" ? data.url : undefined,
        path: `content/${type}/${slug}.md`,
      });
    }
  }
  items.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
  const out = join(ROOT, "public", "index.json");
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(items), "utf8");
  console.log(`[build-index] wrote ${items.length} items to ${out}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
