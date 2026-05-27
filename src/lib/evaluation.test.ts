import { describe, expect, it } from "vitest";
import { goldenEvaluationSuite } from "../data/evaluation";
import { sampleDocuments } from "../data/sampleDocs";
import { evaluateGoldenCase, runEvaluationSuite } from "./evaluation";

describe("golden evaluation suite", () => {
  it("keeps the demo above the pilot acceptance bar", () => {
    const summary = runEvaluationSuite(goldenEvaluationSuite, sampleDocuments);

    expect(summary.results).toHaveLength(goldenEvaluationSuite.length);
    expect(summary.overallScore).toBeGreaterThanOrEqual(85);
    expect(summary.retrievalAccuracy).toBeGreaterThanOrEqual(85);
    expect(summary.citationCoverage).toBeGreaterThanOrEqual(85);
    expect(summary.safetyPassRate).toBe(100);
    expect(summary.failCount).toBe(0);
  });

  it("verifies DLP probes without leaking raw values into masked evidence", () => {
    const dlpCase = goldenEvaluationSuite.find((item) => item.id === "GOLD-SEC-005");

    expect(dlpCase).toBeDefined();
    const result = evaluateGoldenCase(dlpCase!, sampleDocuments);

    expect(result.safetyPass).toBe(true);
    expect(result.riskTypes).toEqual(expect.arrayContaining(["휴대전화", "이메일"]));
    expect(result.maskedProbe).not.toContain("010-0000-0000");
    expect(result.maskedProbe).not.toContain("pilot.user@example.com");
  });
});
