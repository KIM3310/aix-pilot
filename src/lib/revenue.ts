import { behavioralLevers, buyerPersonas, culturalAdoptionPatterns, pricingTiers, revenueExperiments } from "../data/businessModel";

export type RevenueAssumptions = {
  teamMembers: number;
  monthlyWorkflows: number;
  minutesSavedPerWorkflow: number;
  hourlyCostKrw: number;
  selectedTierMonthlyKrw: number;
};

export type RevenueBusinessCase = {
  monthlySavedHours: number;
  monthlySavingsKrw: number;
  annualSavingsKrw: number;
  paybackMultiple: number;
  paybackMonths: number;
  recommendedTier: string;
  closeSignal: "강함" | "검증" | "보류";
  anchorMessage: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatKrw(value: number) {
  if (value >= 100000000) return `${(value / 100000000).toFixed(1)}억`;
  if (value >= 10000) return `${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
  return value.toLocaleString("ko-KR");
}

export function calculateRevenueBusinessCase(input: RevenueAssumptions): RevenueBusinessCase {
  const teamMembers = clamp(input.teamMembers, 1, 2000);
  const monthlyWorkflows = clamp(input.monthlyWorkflows, 100, 500000);
  const minutesSaved = clamp(input.minutesSavedPerWorkflow, 1, 60);
  const hourlyCost = clamp(input.hourlyCostKrw, 10000, 250000);
  const tierPrice = clamp(input.selectedTierMonthlyKrw, 100000, 20000000);

  const monthlySavedHours = Math.round((monthlyWorkflows * minutesSaved) / 60);
  const monthlySavingsKrw = Math.round(monthlySavedHours * hourlyCost);
  const annualSavingsKrw = monthlySavingsKrw * 12;
  const paybackMultiple = Number((monthlySavingsKrw / tierPrice).toFixed(1));
  const recommendedTier = teamMembers >= 120 || monthlyWorkflows >= 25000 ? "Enterprise" : teamMembers >= 25 || monthlyWorkflows >= 7000 ? "Ops" : "Pilot";
  const paybackMonths = Number((tierPrice / Math.max(1, monthlySavingsKrw)).toFixed(2));
  const closeSignal = paybackMultiple >= 5 ? "강함" : paybackMultiple >= 2.5 ? "검증" : "보류";
  const anchorMessage =
    closeSignal === "강함"
      ? "가격보다 새는 시간이 훨씬 큽니다. 연간 계약으로 예산화할 수 있습니다."
      : closeSignal === "검증"
        ? "파일럿으로 실제 업무 데이터를 더 모으면 유료 전환 근거가 충분합니다."
        : "현재 범위에서는 더 좁은 업무부터 시작해 ROI를 키우는 편이 좋습니다.";

  return {
    monthlySavedHours,
    monthlySavingsKrw,
    annualSavingsKrw,
    paybackMultiple,
    paybackMonths,
    recommendedTier,
    closeSignal,
    anchorMessage
  };
}

function hasText(value: string) {
  return value.trim().length > 0;
}

export function validateBusinessModel() {
  const ids = [
    ...pricingTiers.map((item) => item.id),
    ...buyerPersonas.map((item) => item.id),
    ...behavioralLevers.map((item) => item.id),
    ...culturalAdoptionPatterns.map((item) => item.id),
    ...revenueExperiments.map((item) => item.id)
  ];

  return {
    uniqueIds: new Set(ids).size === ids.length,
    pricingComplete: pricingTiers.every(
      (tier) =>
        tier.monthlyKrw > 0 &&
        tier.setupKrw >= 0 &&
        hasText(tier.promise) &&
        tier.features.length >= 4 &&
        hasText(tier.conversionTrigger) &&
        hasText(tier.riskReversal)
    ),
    personasCloseable: buyerPersonas.every(
      (persona) => hasText(persona.pain) && hasText(persona.desiredOutcome) && hasText(persona.proof) && hasText(persona.closeMessage)
    ),
    behavioralLeversEthical: behavioralLevers.every((lever) => hasText(lever.ethicalUse) && hasText(lever.productMove) && hasText(lever.metric)),
    culturalPatternsActionable: culturalAdoptionPatterns.every((pattern) => hasText(pattern.friction) && hasText(pattern.rolloutMove) && hasText(pattern.message)),
    experimentsMeasurable: revenueExperiments.every((experiment) => hasText(experiment.hypothesis) && hasText(experiment.test) && hasText(experiment.successMetric))
  };
}
