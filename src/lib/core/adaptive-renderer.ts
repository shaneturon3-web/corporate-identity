import { roleMeetsPermission, type PermissionLevel, type Role } from "../auth/roles";
import type { ProjectStatus } from "../spine/types";
import type { ModuleConfigRow, ProjectDataRow } from "./adaptive-db";

export interface GalleryCardModel {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  layer: 1 | 2 | 3;
  category?: string;
  architecture: string[];
  href: string;
  permissionLevel: PermissionLevel;
  hidden?: boolean;
  source: "content" | "d1";
  modules?: ModuleConfigRow[];
}

export interface StaticProjectInput {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  layer?: 1 | 2 | 3;
  category?: string;
  architecture: string[];
  href: string;
  permissionLevel?: PermissionLevel;
  hidden?: boolean;
}

export function canViewCard(card: GalleryCardModel, role: Role): boolean {
  if (card.hidden && !roleMeetsPermission(role, "BACKEND")) return false;
  return roleMeetsPermission(role, card.permissionLevel);
}

export function mergeGalleryCards(
  staticProjects: StaticProjectInput[],
  d1Projects: ProjectDataRow[],
  modules: ModuleConfigRow[],
  role: Role,
  staticSlugs: Set<string>,
): GalleryCardModel[] {
  const moduleBySlug = new Map<string, ModuleConfigRow[]>();
  for (const m of modules) {
    const list = moduleBySlug.get(m.projectSlug) ?? [];
    list.push(m);
    moduleBySlug.set(m.projectSlug, list);
  }

  const staticCards: GalleryCardModel[] = staticProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    status: p.status,
    layer: p.layer ?? 2,
    category: p.category,
    architecture: p.architecture,
    href: p.href,
    permissionLevel: p.permissionLevel ?? "PUBLIC",
    source: "content",
    hidden: p.hidden ?? false,
    modules: moduleBySlug.get(p.slug),
  }));

  const d1Only: GalleryCardModel[] = d1Projects
    .filter((p) => !staticSlugs.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      status: p.status,
      layer: p.layer,
      category: p.category ?? undefined,
      architecture: p.architecture,
      href: p.href,
      permissionLevel: p.permissionLevel,
      source: "d1" as const,
      hidden: p.hidden,
      modules: moduleBySlug.get(p.slug),
    }));

  return [...staticCards, ...d1Only]
    .filter((c) => canViewCard(c, role))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function renderDashboardWidgets(
  projectSlug: string,
  modules: ModuleConfigRow[],
): { moduleKey: string; widgets: string[] }[] {
  return modules
    .filter((m) => m.projectSlug === projectSlug)
    .map((m) => ({
      moduleKey: m.moduleKey,
      widgets: Array.isArray(m.config.widgets)
        ? (m.config.widgets as string[])
        : ["status"],
    }));
}
