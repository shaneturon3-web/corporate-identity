import type { IntakeRouteResult, IntakeSubmissionInput } from "./schemas";
import { DEFAULT_INTAKE_FORM } from "./schemas";

/**
 * Resolve professional routing from intake answers and qualification tags.
 * Vertical wrappers may override via config KV in production.
 */
export function routeIntakeSubmission(
  input: IntakeSubmissionInput,
  professionals: { id: string; tags: string[] }[],
): IntakeRouteResult {
  const tags = input.qualificationTags ?? [];
  const urgency = String(input.answers.urgency ?? "standard");
  if (urgency === "high") tags.push("urgent");

  const preference = String(input.answers.professional_preference ?? "");
  if (preference) {
    const match = professionals.find((p) => p.id === preference);
    if (match) {
      return { professionalId: match.id, reason: "explicit_preference", tags };
    }
  }

  const referral = tags.includes("referral");
  const scored = professionals
    .map((p) => ({
      id: p.id,
      score: p.tags.filter((t) => tags.includes(t)).length + (referral && p.tags.includes("referral") ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score);

  const chosen = scored[0]?.id ?? professionals[0]?.id ?? "unassigned";
  return {
    professionalId: chosen,
    reason: scored[0]?.score ? "tag_match" : "default_pool",
    tags,
  };
}

export function nextStepIndex(
  formId: string,
  currentIndex: number,
  answers: Record<string, unknown>,
): number {
  const form = formId === DEFAULT_INTAKE_FORM.id ? DEFAULT_INTAKE_FORM : DEFAULT_INTAKE_FORM;
  const step = form.steps[currentIndex];
  if (!step?.branch) return Math.min(currentIndex + 1, form.steps.length - 1);
  const value = String(answers[step.branch.whenField] ?? "");
  if (value === step.branch.equals) {
    const target = form.steps.findIndex((s) => s.id === step.branch!.gotoStepId);
    return target >= 0 ? target : currentIndex + 1;
  }
  return currentIndex + 1;
}
