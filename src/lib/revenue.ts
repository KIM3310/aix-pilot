import {
  behavioralLevers,
  buyerPersonas,
  culturalAdoptionPatterns,
  pricingTiers,
  revenueExperiments,
  salesMotions,
  scaleScenarios,
  targetVerticals,
  type ScaleScenario
} from "../data/businessModel";

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

export type ScaleScenarioResult = {
  mrrKrw: number;
  setupPipelineKrw: number;
  annualRunRateKrw: number;
  targetAccounts: number;
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
  const tierPrice = clamp(input.selectedTierMonthlyKrw, 100000, 100000000);

  const monthlySavedHours = Math.round((monthlyWorkflows * minutesSaved) / 60);
  const monthlySavingsKrw = Math.round(monthlySavedHours * hourlyCost);
  const annualSavingsKrw = monthlySavingsKrw * 12;
  const paybackMultiple = Number((monthlySavingsKrw / tierPrice).toFixed(1));
  const recommendedTier = teamMembers >= 300 || monthlyWorkflows >= 75000 ? "Enterprise" : teamMembers >= 50 || monthlyWorkflows >= 15000 ? "Ops" : "Pilot";
  const rawPaybackMonths = tierPrice / Math.max(1, monthlySavingsKrw);
  const paybackMonths = rawPaybackMonths < 0.1 ? 0.1 : Number(rawPaybackMonths.toFixed(1));
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

export function calculateScaleScenario(scenario: ScaleScenario): ScaleScenarioResult {
  if (scenario.id === "SCALE-MIXED") {
    const enterpriseMrr = 5 * 29000000;
    const opsMrr = 10 * 9900000;
    const setupPipelineKrw = 5 * 90000000 + 10 * 35000000;

    return {
      mrrKrw: enterpriseMrr + opsMrr,
      setupPipelineKrw,
      annualRunRateKrw: (enterpriseMrr + opsMrr) * 12,
      targetAccounts: scenario.targetAccounts
    };
  }

  const mrrKrw = scenario.targetAccounts * scenario.monthlyKrw;

  return {
    mrrKrw,
    setupPipelineKrw: scenario.targetAccounts * scenario.setupKrw,
    annualRunRateKrw: mrrKrw * 12,
    targetAccounts: scenario.targetAccounts
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
    ...revenueExperiments.map((item) => item.id),
    ...targetVerticals.map((item) => item.id),
    ...scaleScenarios.map((item) => item.id),
    ...salesMotions.map((item) => item.id)
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
    experimentsMeasurable: revenueExperiments.every((experiment) => hasText(experiment.hypothesis) && hasText(experiment.test) && hasText(experiment.successMetric)),
    targetVerticalsFocused: targetVerticals.every(
      (vertical) => hasText(vertical.market) && hasText(vertical.wedgeWorkflow) && hasText(vertical.budgetOwner) && hasText(vertical.buyingTrigger)
    ),
    scaleScenariosReachHundredMillion: scaleScenarios.every((scenario) => calculateScaleScenario(scenario).mrrKrw >= 100000000),
    salesMotionMeasurable: salesMotions.every((motion) => hasText(motion.stage) && hasText(motion.action) && hasText(motion.metric))
  };
}
