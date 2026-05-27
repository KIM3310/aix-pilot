import { launchMaturity, servicePillars, serviceSlos, trustControls } from "../data/serviceModel";

type Severity = "낮음" | "중간" | "높음";

export type ServiceReadinessInput = {
  evaluationScore: number;
  specScore: number;
  readinessScore: number;
  securityReadiness: number;
  approvalReadiness: number;
  riskFindings: Array<{ severity: Severity }>;
  documentCount: number;
  chunkCount: number;
};

export type ServiceReadinessResult = {
  score: number;
  tier: "Launch Ready" | "Pilot Hardened" | "Executive Review" | "Needs Hardening";
  posture: string;
  riskPenalty: number;
  blockers: string[];
  weights: {
    quality: number;
    security: number;
    spec: number;
    operations: number;
    approval: number;
    knowledge: number;
  };
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function scoreKnowledgeDepth(documentCount: number, chunkCount: number) {
  return clamp(68 + documentCount * 3 + Math.min(14, Math.round(chunkCount * 0.7)));
}

function scoreRiskPenalty(riskFindings: ServiceReadinessInput["riskFindings"]) {
  return Math.min(
    22,
    riskFindings.reduce((total, finding) => {
      if (finding.severity === "높음") return total + 8;
      if (finding.severity === "중간") return total + 3;
      return total + 1;
    }, 0)
  );
}

export function calculateServiceReadiness(input: ServiceReadinessInput): ServiceReadinessResult {
  const weights = {
    quality: clamp(input.evaluationScore) * 0.26,
    security: clamp(input.securityReadiness) * 0.22,
    spec: clamp(input.specScore) * 0.18,
    operations: clamp(input.readinessScore) * 0.15,
    approval: clamp(input.approvalReadiness) * 0.1,
    knowledge: scoreKnowledgeDepth(input.documentCount, input.chunkCount) * 0.09
  };
  const riskPenalty = scoreRiskPenalty(input.riskFindings);
  const weightedScore = Object.values(weights).reduce((total, value) => total + value, 0);
  const score = clamp(Math.round(weightedScore - riskPenalty), 0, 99);

  const blockers = [
    input.riskFindings.some((finding) => finding.severity === "높음") ? "고위험 보안 탐지 항목은 승인 전까지 외부 발송을 보류" : "",
    input.evaluationScore < 85 ? "골든 평가 점수 85점 미만" : "",
    input.specScore < 90 ? "운영 전환 스펙 커버리지 90% 미만" : "",
    input.documentCount < 5 ? "파일럿 지식 베이스 최소 5건 미만" : "",
    input.approvalReadiness < 80 ? "Agent 승인 흐름 준비도 80% 미만" : ""
  ].filter(Boolean);

  const tier =
    score >= 92 ? "Launch Ready" : score >= 84 ? "Pilot Hardened" : score >= 74 ? "Executive Review" : "Needs Hardening";
  const posture =
    tier === "Launch Ready"
      ? "운영 전환 검토 가능"
      : tier === "Pilot Hardened"
        ? "파일럿 확장 가능"
        : tier === "Executive Review"
          ? "임원 검토 전 보완 필요"
          : "보안/품질 보강 필요";

  return {
    score,
    tier,
    posture,
    riskPenalty,
    blockers,
    weights: {
      quality: Math.round(weights.quality),
      security: Math.round(weights.security),
      spec: Math.round(weights.spec),
      operations: Math.round(weights.operations),
      approval: Math.round(weights.approval),
      knowledge: Math.round(weights.knowledge)
    }
  };
}

function hasText(value: string) {
  return value.trim().length > 0;
}

export function validateServiceOperatingModel() {
  const pillarIds = servicePillars.map((item) => item.id);
  const trustIds = trustControls.map((item) => item.id);
  const sloIds = serviceSlos.map((item) => item.id);
  const maturityIds = launchMaturity.map((item) => item.id);
  const ids = [...pillarIds, ...trustIds, ...sloIds, ...maturityIds];

  return {
    uniqueIds: new Set(ids).size === ids.length,
    pillarsComplete: servicePillars.every(
      (item) =>
        hasText(item.name) &&
        hasText(item.intent) &&
        hasText(item.operator) &&
        hasText(item.metric) &&
        hasText(item.evidence) &&
        item.score >= 80
    ),
    controlsActionable: trustControls.every(
      (item) => hasText(item.objective) && hasText(item.evidence) && hasText(item.automation) && hasText(item.status)
    ),
    slosHaveOwners: serviceSlos.every((item) => hasText(item.metric) && hasText(item.target) && hasText(item.owner) && hasText(item.signal)),
    maturityHasGates: launchMaturity.every((item) => hasText(item.promise) && hasText(item.gate))
  };
}
