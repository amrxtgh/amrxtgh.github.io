import { Search } from "@/components/Search";

export default function SearchPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        Searches across entries, posts, and external links.
      </p>
      <div className="mt-6">
        <Search />
      </div>
    </div>
  );
}
