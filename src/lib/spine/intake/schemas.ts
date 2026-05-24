import type { IntakeChannel } from "../types";

export interface IntakeStep {
  id: string;
  label: string;
  fieldKeys: string[];
  /** Next step id when condition matches, else default next */
  branch?: { whenField: string; equals: string; gotoStepId: string };
}

export interface IntakeFormDefinition {
  id: string;
  vertical: string;
  steps: IntakeStep[];
  qualificationTags: string[];
}

export interface IntakeSubmissionInput {
  formId: string;
  channel: IntakeChannel;
  stepIndex: number;
  answers: Record<string, string | boolean | number>;
  qualificationTags?: string[];
}

export interface IntakeRouteResult {
  professionalId: string;
  reason: string;
  tags: string[];
}

/** Default multi-step intake for professional verticals. */
export const DEFAULT_INTAKE_FORM: IntakeFormDefinition = {
  id: "core-intake-v1",
  vertical: "professional",
  qualificationTags: ["urgent", "referral", "standard"],
  steps: [
    { id: "contact", label: "Contact", fieldKeys: ["name", "email", "phone"] },
    { id: "context", label: "Context", fieldKeys: ["reason", "preferred_channel"] },
    {
      id: "qualify",
      label: "Qualification",
      fieldKeys: ["urgency"],
      branch: { whenField: "urgency", equals: "high", gotoStepId: "route" },
    },
    { id: "route", label: "Routing", fieldKeys: ["professional_preference"] },
  ],
};
