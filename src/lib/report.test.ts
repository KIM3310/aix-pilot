import { describe, expect, it } from "vitest";
import type { AgentDraft } from "./agent";
import { buildPilotReport, formatRiskFindings } from "./report";
import type { RagAnswer } from "./rag";
import type { RiskFinding } from "./security";

const answer: RagAnswer = {
  answer: "데모 연락처 010-0000-0000은 외부 발송 전 제외한다.",
  confidence: 91,
  citations: [
    {
      id: "c1",
      docId: "d1",
      title: "생성형 AI 사용 보안 정책",
      source: "보안정책",
      owner: "정보보호팀",
      updatedAt: "2026-05-22",
      sensitivity: "Confidential",
      tags: ["DLP"],
      text: "민감정보 탐지 시 답변 생성 전에 마스킹하고 보안 알림을 남긴다.",
      terms: [],
      score: 18,
      highlights: []
    }
  ],
  followUps: []
};

const agentDraft: AgentDraft = {
  mode: "보고서 생성",
  title: "테스트 리포트",
  output: "담당자 이메일 user@example.com 및 연락처 010-0000-0000은 마스킹한다.",
  steps: [],
  requiresApproval: true
};

const risks: RiskFinding[] = [
  {
    type: "휴대전화",
    severity: "중간",
    message: "전화번호가 포함되어 있습니다. 외부 발송 전 마스킹을 권장합니다.",
    match: "010-0000-0000"
  },
  {
    type: "이메일",
    severity: "낮음",
    message: "이메일 주소가 포함되어 있습니다.",
    match: "user@example.com"
  }
];

describe("pilot report", () => {
  it("formats findings with masked matches", () => {
    const lines = formatRiskFindings(risks);
    expect(lines).toContain("010-****-0000");
    expect(lines).toContain("***@example.com");
    expect(lines).not.toContain("010-0000-0000");
    expect(lines).not.toContain("user@example.com");
  });

  it("does not leak raw sensitive data in downloaded report content", () => {
    const report = buildPilotReport({
      query: "연락처 010-0000-0000와 이메일 user@example.com을 리포트로 정리",
      answer,
      agentDraft,
      riskFindings: risks,
      documentCount: 8,
      chunkCount: 14,
      readinessScore: 89
    });

    expect(report).toContain("010-****-0000");
    expect(report).toContain("***@example.com");
    expect(report).not.toContain("010-0000-0000");
    expect(report).not.toContain("user@example.com");
  });
});
