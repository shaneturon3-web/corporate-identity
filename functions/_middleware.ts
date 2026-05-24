/**
 * Unified domain perimeter — subdomain routing for shaneturon.ca zone.
 * @see docs/ORDER-001-ROUTING.md
 */
interface Env {
  SHIPYARD_ORIGIN?: string;
}

const PSYNOVA_PREFIX = "/psynova";

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  const shipyardOrigin =
    context.env.SHIPYARD_ORIGIN ?? "https://shipyard.shaneturon.ca";

  if (host === "shipyard.shaneturon.ca") {
    const target = new URL(url.pathname + url.search, shipyardOrigin);
    const headers = new Headers(context.request.headers);
    headers.set("X-ShipYard-Perimeter", "shaneturon.ca");
    return fetch(
      new Request(target.toString(), {
        method: context.request.method,
        headers,
        body: context.request.body,
        redirect: "manual",
      }),
    );
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
