/** Level 3 perimeter — hostname map (routing in functions/_middleware.ts). */
export const SITE_HOSTS = {
  root: "shaneturon.ca",
  www: "www.shaneturon.ca",
  shipyard: "shipyard.shaneturon.ca",
  psynova: "psynova.shaneturon.ca",
  insights: "insights.shaneturon.ca",
  docs: "docs.shaneturon.ca",
  status: "status.shaneturon.ca",
} as const;

/** Subdomain → site path prefix (Order 025). */
export const EXPANSION_HOST_PATHS: Record<string, string> = {
  [SITE_HOSTS.insights]: "/insights",
  [SITE_HOSTS.docs]: "/docs",
  [SITE_HOSTS.status]: "/status",
};

export const SHIPYARD_ORIGIN =
  import.meta.env.PUBLIC_SHIPYARD_ORIGIN ?? "https://shipyard-web.shaneturon3.workers.dev";

export type SiteHostKey = keyof typeof SITE_HOSTS;
