/**
 * Unified domain perimeter — subdomain routing for shaneturon.ca zone.
 * @see docs/ORDER-001-ROUTING.md
 * @see ~/CONTROL TOWER/04_GLOBAL_RULES/OPERATING-DOCTRINE-MASTER-RE24MAY2.md
 */
interface Env {
  SHIPYARD_ORIGIN?: string;
}

const PSYNOVA_PREFIX = "/psynova";
const SHIPYARD_HOST = "shipyard.shaneturon.ca";
const APEX_HOSTS = new Set(["shaneturon.ca", "www.shaneturon.ca"]);

const EXPANSION_HOSTS: Record<string, string> = {
  "insights.shaneturon.ca": "/insights",
  "docs.shaneturon.ca": "/docs",
  "status.shaneturon.ca": "/status",
};

function proxyToShipyardConsole(
  request: Request,
  url: URL,
  shipyardOrigin: string,
  host: string,
): Response | Promise<Response> {
  const originUrl = new URL(shipyardOrigin);
  if (originUrl.hostname === host) {
    return new Response(
      "Shipyard proxy misconfigured: SHIPYARD_ORIGIN must not equal the public hostname.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }
  let workerPath = url.pathname;
  if (workerPath.startsWith("/console")) {
    workerPath = workerPath.replace(/^\/console/, "") || "/";
  }
  const target = new URL(workerPath + url.search, shipyardOrigin);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.set("X-Shipyard-Perimeter", "shaneturon.ca");
  headers.set("X-Forwarded-Host", host);
  return fetch(
    new Request(target.toString(), {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    }),
  );
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  const shipyardOrigin =
    context.env.SHIPYARD_ORIGIN ??
    "https://shipyard-web.shaneturon3.workers.dev";

  if (APEX_HOSTS.has(host) || host === "www.shaneturon.ca") {
    if (url.pathname.startsWith("/projects") || url.pathname.startsWith("/case-files")) {
      const rest = url.pathname.replace(/^\/projects/, "").replace(/^\/case-files/, "") || "/";
      const target = new URL(`/case-files${rest}${url.search}`, `https://${SHIPYARD_HOST}`);
      return Response.redirect(target.toString(), 308);
    }
  }

  if (host === SHIPYARD_HOST) {
    const path = url.pathname;
    if (path.startsWith("/console") || path.startsWith("/api/")) {
      return proxyToShipyardConsole(context.request, url, shipyardOrigin, host);
    }
    if (path === "/" || path === "") {
      return Response.redirect(`https://${SHIPYARD_HOST}/case-files/`, 308);
    }
    return context.next();
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
