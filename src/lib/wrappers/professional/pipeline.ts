import type { PipelineStage, TaxFilingStatus } from "./types";

/** Travel-agency pipeline: Lead → Discovery → Document Collection */
export const PIPELINE_ORDER: PipelineStage[] = [
  "lead",
  "discovery",
  "document_collection",
  "active",
];

export function pipelineToTaxStatus(stage: PipelineStage): TaxFilingStatus {
  switch (stage) {
    case "lead":
      return "Discovery";
    case "discovery":
      return "Discovery";
    case "document_collection":
      return "Documents_Pending";
    case "active":
      return "Review";
    default:
      return "Discovery";
  }
}

export function advancePipeline(current: PipelineStage): PipelineStage {
  const idx = PIPELINE_ORDER.indexOf(current);
  if (idx < 0 || idx >= PIPELINE_ORDER.length - 1) return current;
  return PIPELINE_ORDER[idx + 1];
}

export function taxStatusLabel(status: TaxFilingStatus): string {
  return status.replace(/_/g, " ");
}
