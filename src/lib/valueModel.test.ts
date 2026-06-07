import { describe, expect, it } from "vitest";
import { expansionPaths } from "../data/businessModel";
import { calculateExpansionPath, calculateValueReadiness, formatCount, validateBusinessModel } from "./valueModel";

describe("value readiness model", () => {
  it("calculates an operational value case from workflow recovery", () => {
    const result = calculateValueReadiness({
      teamMembers: 450,
      monthlyWorkflows: 120000,
      minutesSavedPerWorkflow: 7,
      approvalSteps: 4
    });

    expect(result.monthlySavedHours).toBe(14000);
    expect(result.readinessSignal).toBe("준비");
    expect(result.recommendedPackage).toBe("Enterprise");
  });

  it("keeps weak adoption cases from being over-positioned", () => {
    const result = calculateValueReadiness({
      teamMembers: 3,
      monthlyWorkflows: 300,
      minutesSavedPerWorkflow: 2,
      approvalSteps: 8
    });

    expect(result.readinessSignal).toBe("보류");
    expect(result.anchorMessage).toContain("더 좁은 업무");
  });

  it("formats Korean counts for executive readouts", () => {
    expect(formatCount(9900)).toBe("9,900");
    expect(formatCount(125000)).toBe("125,000");
  });

  it("models expansion paths without publishing financial projections", () => {
    const path = calculateExpansionPath(expansionPaths[0]);

    expect(path.targetTeams).toBeGreaterThanOrEqual(8);
    expect(path.workflowFootprint).toBeGreaterThanOrEqual(80);
    expect(path.reviewCadence).toContain("review");
  });

  it("keeps the business model complete and measurable", () => {
    const result = validateBusinessModel();

    expect(result.uniqueIds).toBe(true);
    expect(result.servicePackagesComplete).toBe(true);
    expect(result.personasCloseable).toBe(true);
    expect(result.behavioralLeversEthical).toBe(true);
    expect(result.culturalPatternsActionable).toBe(true);
    expect(result.experimentsMeasurable).toBe(true);
    expect(result.targetVerticalsFocused).toBe(true);
    expect(result.expansionPathsConcrete).toBe(true);
    expect(result.reviewMotionMeasurable).toBe(true);
  });
});
