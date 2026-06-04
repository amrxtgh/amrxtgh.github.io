import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getOne, sourcePath } from "@/lib/content";
import { EditOnGitHub } from "@/components/EditOnGitHub";

export async function generateStaticParams() {
  return getAllSlugs("posts");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getOne("posts", slug);
  return item ? { title: item.title } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getOne("posts", slug);
  if (!item) notFound();
  return (
    <article>
      <div className="text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Post</div>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{item.title}</h1>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
        {item.date && (
          <time dateTime={item.date}>
            {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </time>
        )}
        {item.tags.length > 0 && <span>{item.tags.map((t) => `#${t}`).join(" ")}</span>}
        <EditOnGitHub path={sourcePath("posts", item.slug)} />
      </div>
      <div className="prose-content mt-6" dangerouslySetInnerHTML={{ __html: item.body }} />
    </article>
  );
}
