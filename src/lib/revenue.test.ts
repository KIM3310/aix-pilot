import { describe, expect, it } from "vitest";
import { scaleScenarios } from "../data/businessModel";
import { calculateRevenueBusinessCase, calculateScaleScenario, formatKrw, validateBusinessModel } from "./revenue";

describe("revenue engine", () => {
  it("calculates a monetizable business case from workflow savings", () => {
    const result = calculateRevenueBusinessCase({
      teamMembers: 450,
      monthlyWorkflows: 120000,
      minutesSavedPerWorkflow: 7,
      hourlyCostKrw: 38000,
      selectedTierMonthlyKrw: 29000000
    });

    expect(result.monthlySavedHours).toBe(14000);
    expect(result.monthlySavingsKrw).toBe(532000000);
    expect(result.paybackMultiple).toBeGreaterThan(10);
    expect(result.closeSignal).toBe("강함");
    expect(result.recommendedTier).toBe("Enterprise");
  });

  it("keeps weak business cases from being over-sold", () => {
    const result = calculateRevenueBusinessCase({
      teamMembers: 3,
      monthlyWorkflows: 300,
      minutesSavedPerWorkflow: 2,
      hourlyCostKrw: 12000,
      selectedTierMonthlyKrw: 9900000
    });

    expect(result.closeSignal).toBe("보류");
    expect(result.anchorMessage).toContain("더 좁은 업무");
  });

  it("formats Korean won values for executive readouts", () => {
    expect(formatKrw(9900000)).toBe("990만");
    expect(formatKrw(125000000)).toBe("1.3억");
  });

  it("models a monthly hundred-million scale scenario", () => {
    const scenario = calculateScaleScenario(scaleScenarios[0]);

    expect(scenario.mrrKrw).toBeGreaterThanOrEqual(200000000);
    expect(scenario.annualRunRateKrw).toBeGreaterThanOrEqual(2400000000);
    expect(scenario.setupPipelineKrw).toBeGreaterThanOrEqual(700000000);
  });

  it("keeps the business model complete and measurable", () => {
    const result = validateBusinessModel();

    expect(result.uniqueIds).toBe(true);
    expect(result.pricingComplete).toBe(true);
    expect(result.personasCloseable).toBe(true);
    expect(result.behavioralLeversEthical).toBe(true);
    expect(result.culturalPatternsActionable).toBe(true);
    expect(result.experimentsMeasurable).toBe(true);
    expect(result.targetVerticalsFocused).toBe(true);
    expect(result.scaleScenariosReachHundredMillion).toBe(true);
    expect(result.salesMotionMeasurable).toBe(true);
  });
});
