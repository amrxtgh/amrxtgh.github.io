import { getAll } from "@/lib/content";
import { Card } from "@/components/Card";
import { CONTENT_TYPES, type ContentType } from "@/lib/types";
import type { Metadata } from "next";

const TYPE_META: Record<ContentType, { title: string; blurb: string }> = {
  entries: { title: "Entries", blurb: "Short notes and thoughts, newest first." },
  posts: { title: "Posts", blurb: "Long-form writing." },
  external: { title: "External", blurb: "Things I found fascinating elsewhere." },
};

export async function generateStaticParams() {
  return CONTENT_TYPES.map((t) => ({ type: t.type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const meta = TYPE_META[type as ContentType];
  return { title: meta?.title ?? "Index" };
}

export default async function TypeIndex({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const t = type as ContentType;
  const meta = TYPE_META[t];
  if (!meta) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Not found</h1>
        <p className="mt-2 text-sm text-neutral-500">Unknown section: {type}</p>
      </div>
    );
  }
  const items = await getAll(t);
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{meta.blurb}</p>
      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">Nothing yet in <code>content/{t}/</code>.</p>
        ) : (
          items.map((item) => <Card key={item.slug} item={item} showType={false} />)
        )}
      </div>
    </div>
  );
}
