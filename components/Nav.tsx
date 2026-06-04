import Link from "next/link";
import { site } from "@/lib/site";

export function Nav() {
  const links = [
    { href: "/", label: "Home" },
    { href: "/entries", label: "Entries" },
    { href: "/posts", label: "Posts" },
    { href: "/external", label: "External" },
    { href: "/search", label: "Search" },
  ];
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          {site.title}
        </Link>
        <ul className="flex gap-5 text-sm">
          {links.slice(1).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
