/**
 * Unified domain perimeter — subdomain routing for shaneturon.ca zone.
 * @see docs/ORDER-001-ROUTING.md
 * @see docs/ORDER-025-EXPANSION-SUBDOMAINS.md
 */
interface Env {
  SHIPYARD_ORIGIN?: string;
}

const PSYNOVA_PREFIX = "/psynova";

const EXPANSION_HOSTS: Record<string, string> = {
  "insights.shaneturon.ca": "/insights",
  "docs.shaneturon.ca": "/docs",
  "status.shaneturon.ca": "/status",
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  const shipyardOrigin =
    context.env.SHIPYARD_ORIGIN ??
    "https://shipyard-web.shaneturon3.workers.dev";

  if (host === "shipyard.shaneturon.ca") {
    const originUrl = new URL(shipyardOrigin);
    if (originUrl.hostname === host) {
      return new Response(
        "ShipYard proxy misconfigured: SHIPYARD_ORIGIN must not equal the public hostname (use workers.dev).",
        { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
      );
    }
    const target = new URL(url.pathname + url.search, shipyardOrigin);
    const headers = new Headers(context.request.headers);
    headers.delete("host");
    headers.set("X-ShipYard-Perimeter", "shaneturon.ca");
    headers.set("X-Forwarded-Host", host);
    return fetch(
      new Request(target.toString(), {
        method: context.request.method,
        headers,
        body: context.request.body,
        redirect: "manual",
      }),
    );
  }

  const expansionPrefix = EXPANSION_HOSTS[host];
  if (expansionPrefix) {
    let path = url.pathname;
    if (path === "/" || path === "") {
      path = `${expansionPrefix}/`;
    } else if (!path.startsWith(expansionPrefix)) {
      path = `${expansionPrefix}${path.startsWith("/") ? path : `/${path}`}`;
    }
    if (path !== url.pathname) {
      const target = new URL(path + url.search, url.origin);
      return Response.redirect(target.toString(), 308);
    }
  }

  if (host === "psynova.shaneturon.ca") {
    let path = url.pathname;
    if (path === "/" || path === "") {
      path = `${PSYNOVA_PREFIX}/`;
    } else if (!path.startsWith(PSYNOVA_PREFIX)) {
      path = `${PSYNOVA_PREFIX}${path.startsWith("/") ? path : `/${path}`}`;
    }
    if (path !== url.pathname) {
      const target = new URL(path + url.search, url.origin);
      return Response.redirect(target.toString(), 308);
    }
  }

  if (host === "www.shaneturon.ca") {
    const canonical = new URL(url.pathname + url.search, "https://shaneturon.ca");
    return Response.redirect(canonical.toString(), 301);
  }

  return context.next();
};
