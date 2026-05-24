/** RBAC roles — Order 022 */

export type Role =
  | "BACKEND_ADMIN"
  | "PROFESSIONAL_USER"
  | "OFFICE_ADMIN"
  | "SUPERVISOR"
  | "ACCOUNTANT";

export type PermissionLevel = "PUBLIC" | "PROFESSIONAL" | "OFFICE" | "SUPERVISOR" | "BACKEND";

const PERMISSION_RANK: Record<PermissionLevel, number> = {
  PUBLIC: 0,
  PROFESSIONAL: 1,
  OFFICE: 2,
  SUPERVISOR: 3,
  BACKEND: 4,
};

const ROLE_RANK: Record<Role, number> = {
  PROFESSIONAL_USER: 1,
  OFFICE_ADMIN: 2,
  SUPERVISOR: 3,
  ACCOUNTANT: 3,
  BACKEND_ADMIN: 4,
};

/** Effective rank for a role (supervisor/accountant share supervisor-tier gallery access). */
export function roleRank(role: Role): number {
  return ROLE_RANK[role] ?? 0;
}

export function roleMeetsPermission(role: Role, required: PermissionLevel): boolean {
  const need = PERMISSION_RANK[required] ?? 0;
  if (required === "SUPERVISOR") {
    return role === "SUPERVISOR" || role === "ACCOUNTANT" || role === "BACKEND_ADMIN";
  }
  if (required === "BACKEND") {
    return role === "BACKEND_ADMIN";
  }
  return roleRank(role) >= need;
}

export function parseRole(raw: string | null | undefined): Role {
  const v = (raw ?? "PROFESSIONAL_USER").toUpperCase().replace(/-/g, "_");
  const allowed: Role[] = [
    "BACKEND_ADMIN",
    "PROFESSIONAL_USER",
    "OFFICE_ADMIN",
    "SUPERVISOR",
    "ACCOUNTANT",
  ];
  return allowed.includes(v as Role) ? (v as Role) : "PROFESSIONAL_USER";
}

/** Supervisor / accountant: metrics visible, client PII redacted in ledger views. */
export function shouldRedactClientPii(role: Role): boolean {
  return role === "SUPERVISOR" || role === "ACCOUNTANT";
}

export function redactDisplayName(name: string, role: Role): string {
  if (!shouldRedactClientPii(role)) return name;
  if (!name || name.length < 2) return "Client •••";
  return `Client ${name.charAt(0)}•••`;
}
