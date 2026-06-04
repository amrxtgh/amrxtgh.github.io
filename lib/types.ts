export type ContentType = "entries" | "posts" | "external";

export type Item = {
  type: ContentType;
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: string;
  url?: string;
};

export const CONTENT_TYPES: { type: ContentType; label: string; singular: string }[] = [
  { type: "entries", label: "Entries", singular: "entry" },
  { type: "posts", label: "Posts", singular: "post" },
  { type: "external", label: "External", singular: "external" },
];
