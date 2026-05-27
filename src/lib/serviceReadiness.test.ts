import { describe, expect, it } from "vitest";
import { calculateServiceReadiness, validateServiceOperatingModel } from "./serviceReadiness";

describe("service readiness", () => {
  it("scores a hardened enterprise pilot as launch ready", () => {
    const result = calculateServiceReadiness({
      evaluationScore: 94,
      specScore: 94,
      readinessScore: 96,
      securityReadiness: 96,
      approvalReadiness: 92,
      riskFindings: [],
      documentCount: 8,
      chunkCount: 18
    });

    expect(result.score).toBeGreaterThanOrEqual(92);
    expect(result.tier).toBe("Launch Ready");
    expect(result.blockers).toHaveLength(0);
  });

  it("penalizes high-risk findings before external launch", () => {
    const result = calculateServiceReadiness({
      evaluationScore: 94,
      specScore: 94,
      readinessScore: 96,
      securityReadiness: 62,
      approvalReadiness: 84,
      riskFindings: [{ severity: "높음" }, { severity: "중간" }],
      documentCount: 8,
      chunkCount: 18
    });

    expect(result.score).toBeLessThan(90);
    expect(result.blockers.some((item) => item.includes("고위험"))).toBe(true);
  });

  it("keeps service operating model evidence complete", () => {
    const result = validateServiceOperatingModel();

    expect(result.uniqueIds).toBe(true);
    expect(result.pillarsComplete).toBe(true);
    expect(result.controlsActionable).toBe(true);
    expect(result.slosHaveOwners).toBe(true);
    expect(result.maturityHasGates).toBe(true);
  });
});
