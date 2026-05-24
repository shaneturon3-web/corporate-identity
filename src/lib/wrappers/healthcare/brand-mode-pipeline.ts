import { routeIntakeSubmission } from "../../spine/intake/routing-logic";
import type { IntakeSubmissionInput } from "../../spine/intake/schemas";
import type { LeadChannel } from "./types";

export interface MarketingLead {
  id: string;
  channel: LeadChannel;
  externalId: string;
  rawPayload: Record<string, string>;
  receivedAt: string;
}

export interface ClinicalFitResult {
  fit: boolean;
  score: number;
  blockers: string[];
  routedProfessionalId?: string;
}

const DISQUALIFIERS = ["crisis_immediate", "under_18_unaccompanied", "out_of_province"];

/** Facebook / WhatsApp → intake → clinical fit gate before booking. */
export function ingestMarketingLead(lead: MarketingLead): IntakeSubmissionInput {
  return {
    formId: "psynova-brand-intake",
    channel: lead.channel === "facebook" || lead.channel === "whatsapp" ? "web" : "referral",
    stepIndex: 0,
    answers: {
      name: lead.rawPayload.name ?? "",
      email: lead.rawPayload.email ?? "",
      phone: lead.rawPayload.phone ?? "",
      reason: lead.rawPayload.reason ?? lead.rawPayload.message ?? "",
      urgency: lead.rawPayload.urgency ?? "standard",
      source_channel: lead.channel,
    },
    qualificationTags: [lead.channel, "brand_mode"],
  };
}

export function screenClinicalFit(answers: Record<string, string | boolean | number>): ClinicalFitResult {
  const blockers: string[] = [];
  for (const flag of DISQUALIFIERS) {
    if (String(answers[flag] ?? "") === "true") blockers.push(flag);
  }
  const province = String(answers.province ?? "QC");
  if (province !== "QC" && province !== "Quebec") {
    blockers.push("requires_quebec_residency");
  }
  const score = blockers.length === 0 ? 1 : Math.max(0, 1 - blockers.length * 0.35);
  return { fit: blockers.length === 0, score, blockers };
}

export function processBrandModeLead(
  lead: MarketingLead,
  professionals: { id: string; tags: string[] }[],
): { intake: IntakeSubmissionInput; fit: ClinicalFitResult; route?: ReturnType<typeof routeIntakeSubmission> } {
  const intake = ingestMarketingLead(lead);
  const fit = screenClinicalFit(intake.answers);
  if (!fit.fit) return { intake, fit };
  const route = routeIntakeSubmission(intake, professionals);
  return { intake, fit, route };
}
