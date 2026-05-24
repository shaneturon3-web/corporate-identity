import type { ClinicalNoteKind } from "./types";

export interface ClinicalTemplate {
  kind: ClinicalNoteKind;
  title: string;
  sections: string[];
}

export const CLINICAL_TEMPLATES: ClinicalTemplate[] = [
  {
    kind: "intake",
    title: "Initial Intake",
    sections: ["Presenting concern", "History", "Risk screen", "Goals", "Consent confirmation"],
  },
  {
    kind: "assessment",
    title: "Clinical Assessment",
    sections: ["Mental status", "Formulation", "Diagnosis (provisional)", "Treatment plan"],
  },
  {
    kind: "follow_up",
    title: "Follow-up Session",
    sections: ["Interval history", "Intervention response", "Plan adjustment"],
  },
  {
    kind: "summary",
    title: "Session Summary (Zone 3)",
    sections: ["Session focus", "Clinical observations", "Next steps"],
  },
];

export function renderTemplate(kind: ClinicalNoteKind): ClinicalTemplate {
  const t = CLINICAL_TEMPLATES.find((x) => x.kind === kind);
  if (!t) throw new Error(`Unknown template: ${kind}`);
  return t;
}

export function blankNoteFromTemplate(
  kind: ClinicalNoteKind,
  entityId: string,
  authorLicenseId: string,
): Record<string, unknown> {
  const template = renderTemplate(kind);
  const body: Record<string, string> = {};
  for (const section of template.sections) {
    body[section] = "";
  }
  return {
    entityId,
    authorLicenseId,
    kind,
    title: template.title,
    body,
    createdAt: new Date().toISOString(),
  };
}
