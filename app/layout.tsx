import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: site.title, template: `%s — ${site.title}` },
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Nav />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">{children}</main>
        <footer className="border-t border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-3xl px-6 py-6 text-xs text-neutral-500 dark:text-neutral-400">
            {site.title} · edited on GitHub
          </div>
        </footer>
      </body>
    </html>
  );
}
