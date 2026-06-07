import {
  behavioralLevers,
  reviewerPersonas,
  culturalAdoptionPatterns,
  expansionPaths,
  reviewMotions,
  servicePackages,
  targetVerticals,
  validationExperiments,
  type ExpansionPath
} from "../data/businessModel";

export type ValueAssumptions = {
  teamMembers: number;
  monthlyWorkflows: number;
  minutesSavedPerWorkflow: number;
  approvalSteps: number;
};

export type ValueReadinessCase = {
  monthlySavedHours: number;
  weeklyReviewLoad: number;
  recommendedPackage: string;
  readinessSignal: "준비" | "검증" | "보류";
  anchorMessage: string;
};

export type ExpansionPathResult = {
  targetTeams: number;
  workflowFootprint: number;
  reviewCadence: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function formatCount(value: number) {
  return Math.round(value).toLocaleString("ko-KR");
}

export function calculateValueReadiness(input: ValueAssumptions): ValueReadinessCase {
  const teamMembers = clamp(input.teamMembers, 1, 2000);
  const monthlyWorkflows = clamp(input.monthlyWorkflows, 100, 500000);
  const minutesSaved = clamp(input.minutesSavedPerWorkflow, 1, 60);
  const approvalSteps = clamp(input.approvalSteps, 1, 8);

  const monthlySavedHours = Math.round((monthlyWorkflows * minutesSaved) / 60);
  const weeklyReviewLoad = Math.max(1, Math.ceil((teamMembers + approvalSteps * 8) / 25));
  const recommendedPackage = teamMembers >= 300 || monthlyWorkflows >= 75000 ? "Enterprise" : teamMembers >= 50 || monthlyWorkflows >= 15000 ? "Operations" : "Diagnostic";
  const readinessSignal =
    monthlySavedHours >= 5000 && approvalSteps <= 5 ? "준비" : monthlySavedHours >= 800 || approvalSteps <= 6 ? "검증" : "보류";
  const anchorMessage =
    readinessSignal === "준비"
      ? "반복 업무 규모와 승인 경로가 명확합니다. 다음 단계는 고객 데이터 경계와 운영 리소스 확정입니다."
      : readinessSignal === "검증"
        ? "파일럿으로 실제 업무 데이터를 더 모으면 운영 전환 근거가 충분해집니다."
        : "현재 범위에서는 더 좁은 업무부터 시작해 사용 증거와 승인자를 먼저 확보하는 편이 좋습니다.";

  return {
    monthlySavedHours,
    weeklyReviewLoad,
    recommendedPackage,
    readinessSignal,
    anchorMessage
  };
}

export function calculateExpansionPath(path: ExpansionPath): ExpansionPathResult {
  return {
    targetTeams: path.targetTeams,
    workflowFootprint: path.targetTeams * path.representativeWorkflows,
    reviewCadence: path.targetTeams >= 12 ? "biweekly steering review" : "weekly pilot review"
  };
}

function hasText(value: string) {
  return value.trim().length > 0;
}

export function validateBusinessModel() {
  const ids = [
    ...servicePackages.map((item) => item.id),
    ...reviewerPersonas.map((item) => item.id),
    ...behavioralLevers.map((item) => item.id),
    ...culturalAdoptionPatterns.map((item) => item.id),
    ...validationExperiments.map((item) => item.id),
    ...targetVerticals.map((item) => item.id),
    ...expansionPaths.map((item) => item.id),
    ...reviewMotions.map((item) => item.id)
  ];

  return {
    uniqueIds: new Set(ids).size === ids.length,
    servicePackagesComplete: servicePackages.every(
      (item) =>
        hasText(item.promise) &&
        hasText(item.usage) &&
        item.resources.length >= 3 &&
        hasText(item.activationGate) &&
        hasText(item.riskReversal)
    ),
    personasCloseable: reviewerPersonas.every(
      (persona) => hasText(persona.pain) && hasText(persona.desiredOutcome) && hasText(persona.proof) && hasText(persona.closeMessage)
    ),
    behavioralLeversEthical: behavioralLevers.every((lever) => hasText(lever.ethicalUse) && hasText(lever.productMove) && hasText(lever.metric)),
    culturalPatternsActionable: culturalAdoptionPatterns.every((pattern) => hasText(pattern.friction) && hasText(pattern.rolloutMove) && hasText(pattern.message)),
    experimentsMeasurable: validationExperiments.every((experiment) => hasText(experiment.hypothesis) && hasText(experiment.test) && hasText(experiment.successMetric)),
    targetVerticalsFocused: targetVerticals.every(
      (vertical) => hasText(vertical.market) && hasText(vertical.wedgeWorkflow) && hasText(vertical.approvalOwner) && hasText(vertical.adoptionTrigger)
    ),
    expansionPathsConcrete: expansionPaths.every((path) => path.targetTeams > 0 && path.representativeWorkflows > 0 && hasText(path.resourceFocus)),
    reviewMotionMeasurable: reviewMotions.every((motion) => hasText(motion.stage) && hasText(motion.action) && hasText(motion.metric))
  };
}
