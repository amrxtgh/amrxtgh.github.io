import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getOne, sourcePath } from "@/lib/content";
import { EditOnGitHub } from "@/components/EditOnGitHub";

export async function generateStaticParams() {
  return getAllSlugs("external");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getOne("external", slug);
  return item ? { title: item.title } : {};
}

export default async function ExternalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getOne("external", slug);
  if (!item) notFound();
  return (
    <article>
      <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">External</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{item.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        {item.date && (
          <time dateTime={item.date}>
            {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        )}
        {item.tags.length > 0 && <span>{item.tags.map((t) => `#${t}`).join(" ")}</span>}
        <EditOnGitHub path={sourcePath("external", item.slug)} />
      </div>
      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Visit link ↗
        </a>
      )}
      <div className="prose-content mt-6" dangerouslySetInnerHTML={{ __html: item.body }} />
    </article>
  );
}
