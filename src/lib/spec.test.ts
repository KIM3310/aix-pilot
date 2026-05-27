import { describe, expect, it } from "vitest";
import { capabilityRequirements, evaluationGates, rolloutPhases, securityGates, stackDecisions } from "../data/enterpriseSpec";
import { specCoverageScore, uniqueIds, validateSpecPack } from "./spec";

describe("enterprise spec pack", () => {
  it("keeps all spec ids unique across matrices", () => {
    const ids = [
      ...capabilityRequirements.map((item) => item.id),
      ...rolloutPhases.map((item) => item.id),
      ...evaluationGates.map((item) => item.id),
      ...securityGates.map((item) => item.id),
      ...stackDecisions.map((item) => item.id)
    ];

    expect(uniqueIds(ids)).toBe(true);
  });

  it("has enough gates and evidence to work as a handoff spec", () => {
    const result = validateSpecPack();

    expect(result.requirementsComplete).toBe(true);
    expect(result.phasesHaveGates).toBe(true);
    expect(result.evalsHavePassCriteria).toBe(true);
    expect(result.securityHasEvidence).toBe(true);
    expect(result.stackHasConstraints).toBe(true);
    expect(result.coverageScore).toBeGreaterThanOrEqual(90);
  });

  it("covers the core enterprise GenAI domains", () => {
    expect(specCoverageScore()).toBeGreaterThanOrEqual(90);
    expect(capabilityRequirements.map((item) => item.area)).toEqual(
      expect.arrayContaining(["RAG", "Agent", "Security", "KPI", "Audit", "Evaluation", "Deployment"])
    );
  });
});
