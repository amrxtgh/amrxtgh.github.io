import Link from "next/link";
import type { Item } from "@/lib/types";

const TYPE_COLOR: Record<Item["type"], string> = {
  entries: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  posts: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300",
  external: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
};

function fmtDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function Card({ item, showType = true }: { item: Item; showType?: boolean }) {
  const href = `/${item.type}/${item.slug}`;
  return (
    <article className="border-b border-neutral-200 py-5 last:border-0 dark:border-neutral-800">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-lg font-medium tracking-tight">
          <Link href={href} className="hover:underline">
            {item.title}
          </Link>
        </h2>
        {item.date && (
          <time dateTime={item.date} className="shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
            {fmtDate(item.date)}
          </time>
        )}
      </div>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{item.excerpt}</p>
      <div className="mt-2 flex items-center gap-3">
        {showType && (
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${TYPE_COLOR[item.type]}`}>
            {item.type}
          </span>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            Visit ↗
          </a>
        )}
        {item.tags.length > 0 && (
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {item.tags.map((t) => `#${t}`).join(" ")}
          </span>
        )}
      </div>
    </article>
  );
}
