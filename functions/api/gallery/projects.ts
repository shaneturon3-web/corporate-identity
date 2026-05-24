import { parseRole } from "../../../src/lib/auth/roles";
import { listAllModuleConfig, listProjectData } from "../../../src/lib/core/adaptive-db";
import { mergeGalleryCards, type StaticProjectInput } from "../../../src/lib/core/adaptive-renderer";

interface Env {
  SPINE_DB: D1Database;
}

/** Static seed mirrored from content collection for API merge (D1 rows override by slug). */
const STATIC_SEED: StaticProjectInput[] = [
  {
    slug: "corespine",
    title: "CoreSpine (SugarCube Engine)",
    tagline: "The Headless Administrative Engine for Professional Operational Continuity.",
    status: "NOW",
    layer: 1,
    architecture: [
      "Layer 1 — Data Perimeter (Cloudflare D1 / KV)",
      "Layer 2 — Vertical Wrappers",
      "Layer 3 — CONTROL TOWER governance",
    ],
    href: "/projects/corespine/",
    permissionLevel: "PUBLIC",
  },
  {
    slug: "wellness-gateway",
    title: "Wellness Gateway",
    tagline: "Coaching & group wellness with Light Shield anonymous participation.",
    status: "PILOT",
    layer: 2,
    category: "Expansion",
    architecture: [
      "Telehealth — nickname-only group sessions",
      "Light Shield compliance stratum",
      "Expansion vertical",
    ],
    href: "/projects/wellness-gateway/",
    permissionLevel: "PUBLIC",
  },
  {
    slug: "bureauforge",
    title: "BureauForge",
    tagline: "Institutional PMO orchestration & white-label admin (scaffold).",
    status: "FUTURE",
    layer: 2,
    category: "Expansion",
    architecture: [
      "PMO orchestration (FUTURE)",
      "White-label billing",
      "Tenant BACKEND_ADMIN consoles",
    ],
    href: "/projects/bureauforge/",
    permissionLevel: "PUBLIC",
  },
];

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const role = parseRole(url.searchParams.get("role"));

  try {
    const d1Projects = await listProjectData(context.env.SPINE_DB);
    const modules = await listAllModuleConfig(context.env.SPINE_DB);
    const staticSlugs = new Set(STATIC_SEED.map((p) => p.slug));
    const cards = mergeGalleryCards(STATIC_SEED, d1Projects, modules, role, staticSlugs);

    return Response.json({
      role,
      cards: cards.map((c) => ({
        slug: c.slug,
        title: c.title,
        tagline: c.tagline,
        status: c.status,
        layer: c.layer,
        category: c.category,
        architecture: c.architecture,
        href: c.href,
        permissionLevel: c.permissionLevel,
        source: c.source,
        moduleCount: c.modules?.length ?? 0,
      })),
    });
  } catch {
    const cards = mergeGalleryCards(STATIC_SEED, [], [], role, new Set(STATIC_SEED.map((p) => p.slug)));
    return Response.json({ role, cards, degraded: true });
  }
};
