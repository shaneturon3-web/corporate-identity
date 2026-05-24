/** Level 3 perimeter — hostname map (routing in functions/_middleware.ts). */
export const SITE_HOSTS = {
  root: "shaneturon.ca",
  www: "www.shaneturon.ca",
  shipyard: "shipyard.shaneturon.ca",
  psynova: "psynova.shaneturon.ca",
} as const;

export const SHIPYARD_ORIGIN =
  import.meta.env.PUBLIC_SHIPYARD_ORIGIN ?? "https://shipyard-web.shaneturon3.workers.dev";

export type SiteHostKey = keyof typeof SITE_HOSTS;
