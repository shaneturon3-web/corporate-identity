/** Palantir-style system tags per operational case file (Order 044). */
export interface CaseFileMeta {
  node: string;
  encrypt: string;
  telemetry: string;
}

const DEFAULT: CaseFileMeta = {
  node: "GLOBAL_EDGE",
  encrypt: "PIPEDA_A",
  telemetry: "NOMINAL",
};

const BY_SLUG: Record<string, CaseFileMeta> = {
  corespine: { node: "SPINE_PRIMARY", encrypt: "D1_VAULT", telemetry: "PEAK_EFFICIENCY" },
  "psynova-quebec": { node: "QUEBEC_NORTH", encrypt: "LAW_25", telemetry: "PEAK_EFFICIENCY" },
  "prospine-accountant": { node: "PROFESSIONAL_WEST", encrypt: "LIGHT_SHIELD", telemetry: "BILLABLE_SYNC" },
  "control-tower": { node: "ORCHESTRATION_ROOT", encrypt: "ACCESS_JWT", telemetry: "HANDOFF_READY" },
  marketing: { node: "BRAND_PIPELINE", encrypt: "MKT_SIGNAL", telemetry: "LEAD_FLOW" },
  "wellness-gateway": { node: "EXPANSION_EDGE", encrypt: "ANON_NICK", telemetry: "GROUP_WELLNESS" },
  bureauforge: { node: "INSTITUTIONAL_PMO", encrypt: "WHITE_LABEL", telemetry: "FUTURE_STATE" },
  "d1-orchestrator-demo": { node: "D1_LIVE", encrypt: "ADAPTIVE_ROW", telemetry: "AUTO_CARD" },
};

export function caseFileMeta(slug: string): CaseFileMeta {
  return BY_SLUG[slug] ?? DEFAULT;
}
