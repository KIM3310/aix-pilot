import { describe, expect, it } from "vitest";
import { sampleDocuments } from "../data/sampleDocs";
import { chunkDocuments, createDocumentFromUpload, generateRagAnswer, searchKnowledge } from "./rag";

describe("local RAG engine", () => {
  it("retrieves the most relevant source for a shipping delay question", () => {
    const chunks = chunkDocuments(sampleDocuments);
    const results = searchKnowledge("배송 지연 고객에게 보상 안내를 어떻게 해야 해?", chunks);
    expect(results[0].title).toBe("배송 지연 FAQ 응답 기준");

    const answer = generateRagAnswer("배송 지연 고객에게 보상 안내를 어떻게 해야 해?", results);
    expect(answer.answer).toContain("배송 지연 문의");
    expect(answer.citations[0].title).toBe("배송 지연 FAQ 응답 기준");
  });

  it("prioritizes a newly uploaded document when the query has an exact phrase match", () => {
    const uploaded = createDocumentFromUpload(
      "테스트 장애 공지",
      "장애 공지는 영향 범위, 시작 시간, 우회 방법, 다음 업데이트 시간을 포함한다."
    );
    const chunks = chunkDocuments([uploaded, ...sampleDocuments]);
    const results = searchKnowledge("장애 공지에는 무엇을 포함해야 해?", chunks);
    expect(results[0].title).toBe("테스트 장애 공지");

    const answer = generateRagAnswer("장애 공지에는 무엇을 포함해야 해?", results);
    expect(answer.answer).toContain("영향 범위");
    expect(answer.citations).toHaveLength(1);
  });

  it("deduplicates citations that come from the same source document", () => {
    const chunks = chunkDocuments(sampleDocuments);
    const results = searchKnowledge("GenAI 파일럿 KPI는 어떤 축으로 관리해야 해?", chunks);
    const answer = generateRagAnswer("GenAI 파일럿 KPI는 어떤 축으로 관리해야 해?", results);
    const citationDocIds = answer.citations.map((citation) => citation.docId);

    expect(new Set(citationDocIds).size).toBe(citationDocIds.length);
  });

  it("returns a low-confidence fallback when there is no usable query term", () => {
    const chunks = chunkDocuments(sampleDocuments);
    const results = searchKnowledge("?", chunks);
    const answer = generateRagAnswer("?", results);
    expect(results).toHaveLength(0);
    expect(answer.confidence).toBeLessThan(30);
  });
});
