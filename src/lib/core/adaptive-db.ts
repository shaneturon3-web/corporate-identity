import type { PermissionLevel } from "../auth/roles";
import type { ProjectStatus } from "../spine/types";

export interface ProjectDataRow {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  layer: 1 | 2 | 3;
  category: string | null;
  architecture: string[];
  href: string;
  permissionLevel: PermissionLevel;
  hidden: boolean;
  draft: boolean;
  sortOrder: number;
}

export interface ModuleConfigRow {
  id: string;
  projectSlug: string;
  moduleKey: string;
  config: Record<string, unknown>;
  enabled: boolean;
}

function parseArchitecture(json: string): string[] {
  try {
    const v = JSON.parse(json) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function parseConfig(json: string): Record<string, unknown> {
  try {
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function listProjectData(db: D1Database): Promise<ProjectDataRow[]> {
  const { results } = await db
    .prepare(
      `SELECT slug, title, tagline, status, layer, category, architecture_json, href,
              permission_level, hidden, draft, sort_order
       FROM project_data
       WHERE draft = 0
       ORDER BY sort_order ASC, title ASC`,
    )
    .all<{
      slug: string;
      title: string;
      tagline: string;
      status: ProjectStatus;
      layer: number;
      category: string | null;
      architecture_json: string;
      href: string;
      permission_level: PermissionLevel;
      hidden: number;
      draft: number;
      sort_order: number;
    }>();

  return (results ?? []).map((r) => ({
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    status: r.status,
    layer: (r.layer === 1 || r.layer === 3 ? r.layer : 2) as 1 | 2 | 3,
    category: r.category,
    architecture: parseArchitecture(r.architecture_json),
    href: r.href,
    permissionLevel: r.permission_level,
    hidden: r.hidden === 1,
    draft: r.draft === 1,
    sortOrder: r.sort_order,
  }));
}

export async function listModuleConfigForSlug(
  db: D1Database,
  projectSlug: string,
): Promise<ModuleConfigRow[]> {
  const { results } = await db
    .prepare(
      `SELECT id, project_slug, module_key, config_json, enabled
       FROM module_config WHERE project_slug = ? AND enabled = 1`,
    )
    .bind(projectSlug)
    .all<{
      id: string;
      project_slug: string;
      module_key: string;
      config_json: string;
      enabled: number;
    }>();

  return (results ?? []).map((r) => ({
    id: r.id,
    projectSlug: r.project_slug,
    moduleKey: r.module_key,
    config: parseConfig(r.config_json),
    enabled: r.enabled === 1,
  }));
}

export async function listAllModuleConfig(db: D1Database): Promise<ModuleConfigRow[]> {
  const { results } = await db
    .prepare(
      `SELECT id, project_slug, module_key, config_json, enabled
       FROM module_config WHERE enabled = 1`,
    )
    .all<{
      id: string;
      project_slug: string;
      module_key: string;
      config_json: string;
      enabled: number;
    }>();

  return (results ?? []).map((r) => ({
    id: r.id,
    projectSlug: r.project_slug,
    moduleKey: r.module_key,
    config: parseConfig(r.config_json),
    enabled: r.enabled === 1,
  }));
}
