import { defineConfig } from "astro/config";
import react from "@astrojs/react";

/**
 * Institutional identity layer @ shaneturon.ca
 * Subdomains: shipyard.* (Worker proxy), psynova.* (rewrite → /psynova/)
 * Enforced at the edge via functions/_middleware.ts on Cloudflare Pages.
 */
export const SITE_HOSTS = {
  root: "shaneturon.ca",
  shipyard: "shipyard.shaneturon.ca",
  psynova: "psynova.shaneturon.ca",
};

export default defineConfig({
  site: "https://shaneturon.ca",
  output: "static",
  integrations: [react()],
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  vite: {
    server: {
      host: true,
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        SITE_HOSTS.root,
        SITE_HOSTS.shipyard,
        SITE_HOSTS.psynova,
      ],
    },
  },
});
