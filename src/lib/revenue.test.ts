import { describe, expect, it } from "vitest";
import { calculateRevenueBusinessCase, formatKrw, validateBusinessModel } from "./revenue";

describe("revenue engine", () => {
  it("calculates a monetizable business case from workflow savings", () => {
    const result = calculateRevenueBusinessCase({
      teamMembers: 45,
      monthlyWorkflows: 9000,
      minutesSavedPerWorkflow: 7,
      hourlyCostKrw: 32000,
      selectedTierMonthlyKrw: 1490000
    });

    expect(result.monthlySavedHours).toBe(1050);
    expect(result.monthlySavingsKrw).toBe(33600000);
    expect(result.paybackMultiple).toBeGreaterThan(10);
    expect(result.closeSignal).toBe("강함");
    expect(result.recommendedTier).toBe("Ops");
  });

  it("keeps weak business cases from being over-sold", () => {
    const result = calculateRevenueBusinessCase({
      teamMembers: 3,
      monthlyWorkflows: 300,
      minutesSavedPerWorkflow: 2,
      hourlyCostKrw: 12000,
      selectedTierMonthlyKrw: 1490000
    });

    expect(result.closeSignal).toBe("보류");
    expect(result.anchorMessage).toContain("더 좁은 업무");
  });

  it("formats Korean won values for executive readouts", () => {
    expect(formatKrw(1490000)).toBe("149만");
    expect(formatKrw(125000000)).toBe("1.3억");
  });

  it("keeps the business model complete and measurable", () => {
    const result = validateBusinessModel();

    expect(result.uniqueIds).toBe(true);
    expect(result.pricingComplete).toBe(true);
    expect(result.personasCloseable).toBe(true);
    expect(result.behavioralLeversEthical).toBe(true);
    expect(result.culturalPatternsActionable).toBe(true);
    expect(result.experimentsMeasurable).toBe(true);
  });
});
