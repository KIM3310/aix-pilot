import { goldenEvaluationSuite, type GoldenEvaluationCase } from "../data/evaluation";
import type { KnowledgeDocument } from "../data/sampleDocs";
import { chunkDocuments, generateRagAnswer, searchKnowledge, type Chunk } from "./rag";
import { maskSensitive, scanRisk } from "./security";

export type EvalVerdict = "pass" | "needs_attention" | "fail";

export type EvaluationResult = {
  id: string;
  persona: string;
  question: string;
  expectedTitle: string;
  retrievedTitle: string;
  acceptance: string;
  confidence: number;
  retrievalPass: boolean;
  citationPass: boolean;
  safetyPass: boolean;
  score: number;
  verdict: EvalVerdict;
  riskTypes: string[];
  maskedProbe: string;
};

export type EvaluationSummary = {
  results: EvaluationResult[];
  overallScore: number;
  retrievalAccuracy: number;
  citationCoverage: number;
  safetyPassRate: number;
  averageConfidence: number;
  passCount: number;
  attentionCount: number;
  failCount: number;
};

function percent(passCount: number, total: number) {
  return total ? Math.round((passCount / total) * 100) : 0;
}

function verdictFor(score: number, safetyPass: boolean): EvalVerdict {
  if (score >= 85 && safetyPass) return "pass";
  if (score >= 70 && safetyPass) return "needs_attention";
  return "fail";
}

export function evaluateGoldenCase(testCase: GoldenEvaluationCase, documents: KnowledgeDocument[], chunks = chunkDocuments(documents)): EvaluationResult {
  const expectedDoc = documents.find((doc) => doc.id === testCase.expectedDocId);
  const results = searchKnowledge(testCase.question, chunks);
  const answer = generateRagAnswer(testCase.question, results);
  const retrievedDocId = results[0]?.docId ?? "";
  const retrievedTitle = results[0]?.title ?? "검색 결과 없음";
  const citationDocIds = answer.citations.map((citation) => citation.docId);
  const rawProbe = `${testCase.question}\n${answer.answer}`;
  const maskedProbe = maskSensitive(rawProbe);
  const risks = scanRisk(rawProbe);

  const retrievalPass = retrievedDocId === testCase.expectedDocId;
  const citationPass = citationDocIds.includes(testCase.expectedDocId);
  const confidencePass = answer.confidence >= (testCase.minConfidence ?? 65);
  const expectedRiskPass =
    !testCase.riskProbe || testCase.riskProbe.expectedFindingTypes.every((type) => risks.some((risk) => risk.type === type));
  const maskingPass = !testCase.riskProbe || testCase.riskProbe.rawValues.every((value) => !maskedProbe.includes(value));
  const safetyPass = expectedRiskPass && maskingPass;
  const score =
    (retrievalPass ? 35 : 0) +
    (citationPass ? 30 : 0) +
    (confidencePass ? 20 : Math.round(answer.confidence * 0.2)) +
    (safetyPass ? 15 : 0);

  return {
    id: testCase.id,
    persona: testCase.persona,
    question: testCase.question,
    expectedTitle: expectedDoc?.title ?? testCase.expectedDocId,
    retrievedTitle,
    acceptance: testCase.acceptance,
    confidence: answer.confidence,
    retrievalPass,
    citationPass,
    safetyPass,
    score,
    verdict: verdictFor(score, safetyPass),
    riskTypes: Array.from(new Set(risks.map((risk) => risk.type))),
    maskedProbe
  };
}

export function runEvaluationSuite(testCases: GoldenEvaluationCase[] = goldenEvaluationSuite, documents: KnowledgeDocument[]): EvaluationSummary {
  const chunks: Chunk[] = chunkDocuments(documents);
  const results = testCases.map((testCase) => evaluateGoldenCase(testCase, documents, chunks));
  const total = results.length;
  const passCount = results.filter((result) => result.verdict === "pass").length;
  const attentionCount = results.filter((result) => result.verdict === "needs_attention").length;
  const failCount = results.filter((result) => result.verdict === "fail").length;
  const overallScore = total ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / total) : 0;
  const averageConfidence = total ? Math.round(results.reduce((sum, result) => sum + result.confidence, 0) / total) : 0;

  return {
    results,
    overallScore,
    retrievalAccuracy: percent(results.filter((result) => result.retrievalPass).length, total),
    citationCoverage: percent(results.filter((result) => result.citationPass).length, total),
    safetyPassRate: percent(results.filter((result) => result.safetyPass).length, total),
    averageConfidence,
    passCount,
    attentionCount,
    failCount
  };
}
