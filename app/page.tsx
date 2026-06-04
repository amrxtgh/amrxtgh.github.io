import { getAllItems } from "@/lib/content";
import { Card } from "@/components/Card";

export default async function Home() {
  const items = await getAllItems();
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Latest</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Everything in one feed, newest first.
      </p>
      <div className="mt-6">
        {items.length === 0 ? (
          <p className="text-sm text-neutral-500">Nothing yet — add a markdown file under <code>content/</code>.</p>
        ) : (
          items.map((item) => <Card key={`${item.type}/${item.slug}`} item={item} />)
        )}
      </div>
    </div>
  );
}
