import { describe, expect, it } from "vitest";
import { runAgent } from "./agent";
import type { RagAnswer } from "./rag";

const answer: RagAnswer = {
  answer: "배송 지연 문의에는 주문번호 확인, 현재 배송 상태, 예상 도착일을 안내한다.",
  confidence: 92,
  citations: [
    {
      id: "c1",
      docId: "d1",
      title: "배송 지연 FAQ 응답 기준",
      source: "고객센터",
      owner: "CX 운영팀",
      updatedAt: "2026-05-10",
      sensitivity: "Internal",
      tags: ["배송"],
      text: "배송 지연 문의에는 주문번호 확인, 현재 배송 상태, 예상 도착일을 안내한다.",
      terms: [],
      score: 20,
      highlights: []
    }
  ],
  followUps: []
};

describe("agent playbooks", () => {
  it("requires approval for generated outbound email", () => {
    const draft = runAgent("이메일 생성", "배송 지연 답변", answer);
    expect(draft.requiresApproval).toBe(true);
    expect(draft.output).toContain("안녕하세요");
    expect(draft.steps.some((step) => step.label === "발송 승인")).toBe(true);
  });

  it("keeps sensitive request data masked in agent drafts", () => {
    const draft = runAgent("이메일 생성", "연락처 010-0000-0000로 배송 지연 답변", answer);
    expect(draft.output).toContain("010-****-0000");
    expect(draft.output).not.toContain("010-0000-0000");
    expect(draft.output).toContain("내부 보안 메모");
  });

  it("creates a report draft with citations", () => {
    const draft = runAgent("보고서 생성", "배송 지연 답변", answer);
    expect(draft.output).toContain("배송 지연 FAQ 응답 기준");
  });
});
