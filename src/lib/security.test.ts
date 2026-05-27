import { describe, expect, it } from "vitest";
import { maskSensitive, scanRisk } from "./security";

describe("security guard", () => {
  it("detects and masks common personal data", () => {
    const text = "고객 연락처는 010-0000-0000이고 이메일은 user@example.com입니다.";
    const risks = scanRisk(text);

    expect(risks.some((risk) => risk.type === "휴대전화")).toBe(true);
    expect(risks.some((risk) => risk.type === "이메일")).toBe(true);
    expect(maskSensitive(text)).toContain("010-****-0000");
    expect(maskSensitive(text)).toContain("***@example.com");
  });

  it("flags resident registration number patterns as high risk", () => {
    const risks = scanRisk("식별번호 000101-3123456 검토 요청");
    expect(risks[0].severity).toBe("높음");
  });
});
