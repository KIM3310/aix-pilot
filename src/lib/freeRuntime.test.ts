import { describe, expect, it } from "vitest";
import { buildOllamaPrompt, createOllamaGenerateRequest, getFreeRuntimeCards, normalizeEndpoint } from "./freeRuntime";

describe("free runtime integration", () => {
  it("normalizes local Ollama endpoints", () => {
    expect(normalizeEndpoint("http://127.0.0.1:11434/")).toBe("http://127.0.0.1:11434");
  });

  it("builds a grounded Korean prompt for Ollama", () => {
    const prompt = buildOllamaPrompt({
      query: "배송 지연 안내",
      answer: {
        answer: "배송 지연은 보상 기준에 따라 안내해야 합니다.",
        confidence: 91,
        followUps: ["보상 기준 확인"],
        citations: [
          {
            id: "doc-1::0",
            docId: "doc-1",
            title: "배송 정책",
            source: "고객센터",
            owner: "CX",
            updatedAt: "2026-05-01",
            sensitivity: "Internal",
            tags: ["배송"],
            text: "배송 지연 보상 기준",
            terms: ["배송", "지연"],
            score: 87,
            highlights: ["배송 지연 보상 기준"]
          }
        ]
      }
    });

    expect(prompt).toContain("RAG 결과만 근거");
    expect(prompt).toContain("배송 정책");
  });

  it("creates deterministic non-streaming Ollama requests", () => {
    expect(createOllamaGenerateRequest("qwen2.5:1.5b", "hello")).toEqual({
      model: "qwen2.5:1.5b",
      prompt: "hello",
      stream: false,
      options: {
        temperature: 0.2,
        num_predict: 360
      }
    });
  });

  it("summarizes the three free runtime layers", () => {
    const cards = getFreeRuntimeCards({ llmConnected: true, databaseConnected: false, deploymentReady: true });

    expect(cards.map((card) => card.label)).toEqual(["LLM", "배포", "DB"]);
    expect(cards[0].status).toBe("연결");
    expect(cards[2].value).toBe("로컬 저장소");
  });
});
