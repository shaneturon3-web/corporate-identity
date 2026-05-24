/** Pareto gamification — Order 024 */

export const PARETO_WEEKLY_HOURS_THRESHOLD = 20;

export type GamificationTier = "baseline" | "pareto" | "elite";

export interface GamificationState {
  billableHoursThisWeek: number;
  threshold: number;
  tier: GamificationTier;
  progressPct: number;
  showUpgradeCta: boolean;
  ctaMessage: string;
}

export function evaluateWeeklyBillable(hours: number): GamificationState {
  const threshold = PARETO_WEEKLY_HOURS_THRESHOLD;
  const progressPct = Math.min(100, Math.round((hours / threshold) * 100));
  let tier: GamificationTier = "baseline";
  if (hours >= threshold * 1.25) tier = "elite";
  else if (hours >= threshold) tier = "pareto";

  const showUpgradeCta = hours >= threshold;
  const ctaMessage =
    tier === "elite"
      ? "Elite recovery band — unlock Growth Module retainer."
      : "Pareto threshold met — upgrade to managed lead gen.";

  return {
    billableHoursThisWeek: hours,
    threshold,
    tier,
    progressPct,
    showUpgradeCta,
    ctaMessage,
  };
}
