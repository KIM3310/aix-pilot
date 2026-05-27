import type { AgentDraft } from "./agent";
import type { RagAnswer } from "./rag";
import { maskSensitive, type RiskFinding } from "./security";

export type PilotReportInput = {
  query: string;
  answer: RagAnswer;
  agentDraft: AgentDraft;
  riskFindings: RiskFinding[];
  documentCount: number;
  chunkCount: number;
  readinessScore: number;
};

export function formatRiskFindings(riskFindings: RiskFinding[]) {
  return (
    riskFindings
      .map((item) => {
        const maskedMatch = item.match ? ` (${maskSensitive(item.match)})` : "";
        return `- [${item.severity}] ${item.type}: ${item.message}${maskedMatch}`;
      })
      .join("\n") || "- 탐지 없음"
  );
}

export function buildPilotReport({
  query,
  answer,
  agentDraft,
  riskFindings,
  documentCount,
  chunkCount,
  readinessScore
}: PilotReportInput) {
  return `# AIX Pilot 파일럿 리포트

## 현재 질의
${maskSensitive(query)}

## 근거 기반 답변
${maskSensitive(answer.answer)}

## Agent 초안
${maskSensitive(agentDraft.output)}

## 근거 문서
${answer.citations.map((item, index) => `${index + 1}. ${item.title} (${item.source}, score ${item.score})`).join("\n") || "근거 없음"}

## 보안 탐지
${formatRiskFindings(riskFindings)}

## 파일럿 상태
- 문서 수: ${documentCount}
- 청크 수: ${chunkCount}
- 신뢰도: ${answer.confidence}%
- 준비도: ${readinessScore}%
`;
}
