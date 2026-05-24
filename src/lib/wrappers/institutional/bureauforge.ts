/** BureauForge — PMO orchestration scaffold (Order 027, FUTURE). */

export type BureauForgeStatus = "FUTURE" | "PILOT" | "NOW";

export interface BureauForgeCapabilities {
  pmoOrchestration: boolean;
  billingWhiteLabel: boolean;
  adminWhiteLabel: boolean;
}

export const BUREAUFORGE_STATUS: BureauForgeStatus = "FUTURE";

export const BUREAUFORGE_CAPABILITIES: BureauForgeCapabilities = {
  pmoOrchestration: false,
  billingWhiteLabel: false,
  adminWhiteLabel: false,
};

export interface BureauForgeModuleDescriptor {
  key: string;
  label: string;
  phase: BureauForgeStatus;
  description: string;
}

export const BUREAUFORGE_MODULES: BureauForgeModuleDescriptor[] = [
  {
    key: "pmo",
    label: "PMO Orchestration",
    phase: "FUTURE",
    description: "Program portfolio routing across CONTROL TOWER handoffs.",
  },
  {
    key: "billing",
    label: "White-label Billing",
    phase: "FUTURE",
    description: "Institutional ledger skins with operator revenue splits.",
  },
  {
    key: "admin",
    label: "White-label Admin",
    phase: "FUTURE",
    description: "Tenant-scoped BACKEND_ADMIN consoles.",
  },
];
