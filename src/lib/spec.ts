import {
  capabilityRequirements,
  evaluationGates,
  rolloutPhases,
  securityGates,
  stackDecisions
} from "../data/enterpriseSpec";

function hasText(value: string) {
  return value.trim().length > 0;
}

export function uniqueIds(ids: string[]) {
  return new Set(ids).size === ids.length;
}

export function specCoverageScore() {
  const completed = capabilityRequirements.filter((item) => item.status === "완료").length;
  const verified = capabilityRequirements.filter((item) => item.status === "검증").length;
  const expanded = capabilityRequirements.filter((item) => item.status === "확장").length;
  const weighted = completed * 1 + verified * 0.88 + expanded * 0.72;

  return Math.round((weighted / capabilityRequirements.length) * 100);
}

export function validateSpecPack() {
  const ids = [
    ...capabilityRequirements.map((item) => item.id),
    ...rolloutPhases.map((item) => item.id),
    ...evaluationGates.map((item) => item.id),
    ...securityGates.map((item) => item.id),
    ...stackDecisions.map((item) => item.id)
  ];

  const requirementsComplete = capabilityRequirements.every(
    (item) =>
      hasText(item.area) &&
      hasText(item.requirement) &&
      hasText(item.pilot) &&
      hasText(item.production) &&
      hasText(item.owner) &&
      hasText(item.evidence)
  );
  const phasesHaveGates = rolloutPhases.every((phase) => phase.gates.length >= 3 && phase.gates.every(hasText));
  const evalsHavePassCriteria = evaluationGates.every((gate) => hasText(gate.metric) && hasText(gate.pass) && hasText(gate.evidence));
  const securityHasEvidence = securityGates.every((gate) => hasText(gate.control) && hasText(gate.evidence));
  const stackHasConstraints = stackDecisions.every((decision) => hasText(decision.freeOption) && hasText(decision.enterprisePath) && hasText(decision.constraint));

  return {
    uniqueIds: uniqueIds(ids),
    requirementsComplete,
    phasesHaveGates,
    evalsHavePassCriteria,
    securityHasEvidence,
    stackHasConstraints,
    coverageScore: specCoverageScore()
  };
}
