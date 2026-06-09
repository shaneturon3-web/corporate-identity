import { getCollection, type CollectionEntry } from "astro:content";
import type { WritingCategory } from "./categories";

export type WritingEntry = CollectionEntry<"writing">;

export async function getPublishedWriting(): Promise<WritingEntry[]> {
  const all = await getCollection("writing", ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getWritingByCategory(category: WritingCategory): Promise<WritingEntry[]> {
  const all = await getPublishedWriting();
  return all.filter((entry) => entry.data.category === category);
}

export function formatWritingDate(date: Date, language = "en"): string {
  return date.toLocaleDateString(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function postHref(entry: WritingEntry): string {
  return `/writing/${entry.data.category}/${entry.slug}/`;
}
