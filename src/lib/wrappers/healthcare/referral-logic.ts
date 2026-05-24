import type { ReferralDiscipline } from "./types";

export interface ReferralTarget {
  discipline: ReferralDiscipline;
  providerId: string;
  displayName: string;
  optional: boolean;
}

export interface MultidisciplinaryPlan {
  primary: ReferralTarget;
  adjuncts: ReferralTarget[];
  rationale: string;
}

const ADJUNCT_POOL: ReferralTarget[] = [
  { discipline: "coach", providerId: "coach-01", displayName: "Performance Coach", optional: true },
  { discipline: "social_worker", providerId: "sw-01", displayName: "Clinical Social Worker", optional: true },
  { discipline: "yoga_instructor", providerId: "yoga-01", displayName: "Therapeutic Movement", optional: true },
];

/** Optional cross-referrals after primary psychologist match. */
export function buildMultidisciplinaryPlan(
  psychologistId: string,
  goals: string[],
): MultidisciplinaryPlan {
  const adjuncts: ReferralTarget[] = [];
  if (goals.includes("stress") || goals.includes("burnout")) {
    adjuncts.push(ADJUNCT_POOL.find((a) => a.discipline === "coach")!);
  }
  if (goals.includes("family") || goals.includes("housing")) {
    adjuncts.push(ADJUNCT_POOL.find((a) => a.discipline === "social_worker")!);
  }
  if (goals.includes("somatic") || goals.includes("anxiety_body")) {
    adjuncts.push(ADJUNCT_POOL.find((a) => a.discipline === "yoga_instructor")!);
  }
  return {
    primary: {
      discipline: "psychologist",
      providerId: psychologistId,
      displayName: "Licensed Psychologist",
      optional: false,
    },
    adjuncts,
    rationale: "Primary clinical authority preserved; adjuncts are optional and consent-gated.",
  };
}
