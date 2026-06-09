export const WRITING_CATEGORIES = ["articles", "stories", "jokes", "projects"] as const;

export type WritingCategory = (typeof WRITING_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<WritingCategory, string> = {
  articles: "Articles",
  stories: "Stories",
  jokes: "Jokes",
  projects: "Project Notes",
};

export const CATEGORY_DESCRIPTIONS: Record<WritingCategory, string> = {
  articles: "Essays, observations, and long-form notes on systems, work, and craft.",
  stories: "Short fiction, scenes, and narrative experiments.",
  jokes: "One-liners, bits, and lighter material.",
  projects: "Build logs, architecture notes, and in-progress project reflections.",
};

export function isWritingCategory(value: string): value is WritingCategory {
  return (WRITING_CATEGORIES as readonly string[]).includes(value);
}
