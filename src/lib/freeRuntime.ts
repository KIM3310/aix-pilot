import type { RagAnswer } from "./rag";

export const OLLAMA_DEFAULT_ENDPOINT = "http://127.0.0.1:11434";
export const OLLAMA_DEFAULT_MODEL = "qwen2.5:1.5b";

export type FreeRuntimeCard = {
  label: string;
  value: string;
  detail: string;
  status: "준비" | "연결" | "대기";
};

export type OllamaPromptInput = {
  query: string;
  answer: RagAnswer;
};

export function normalizeEndpoint(endpoint: string) {
  const trimmed = endpoint.trim();
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function buildOllamaPrompt({ query, answer }: OllamaPromptInput) {
  const citations = answer.citations
    .map((item, index) => `${index + 1}. ${item.title} / ${item.source} / score ${item.score}`)
    .join("\n");

  return [
    "너는 기업용 GenAI 파일럿의 한국어 운영 보조자다.",
    "아래 RAG 결과만 근거로 삼아 5문장 이하로 요약하고, 보안/승인 리스크가 있으면 마지막 줄에 표시한다.",
    "",
    `질문: ${query}`,
    "",
    `RAG 답변: ${answer.answer}`,
    "",
    `근거:\n${citations || "근거 없음"}`
  ].join("\n");
}

export function createOllamaGenerateRequest(model: string, prompt: string) {
  return {
    model,
    prompt,
    stream: false,
    options: {
      temperature: 0.2,
      num_predict: 360
    }
  };
}

export function getFreeRuntimeCards({
  llmConnected,
  databaseConnected,
  deploymentReady
}: {
  llmConnected: boolean;
  databaseConnected: boolean;
  deploymentReady: boolean;
}): FreeRuntimeCard[] {
  return [
    {
      label: "LLM",
      value: llmConnected ? "Ollama 연결" : "Ollama 대기",
      detail: "로컬 모델, API 비용 0원",
      status: llmConnected ? "연결" : "대기"
    },
    {
      label: "배포",
      value: deploymentReady ? "Cloudflare Pages" : "로그인 대기",
      detail: "정적 배포 + Functions",
      status: deploymentReady ? "준비" : "대기"
    },
    {
      label: "DB",
      value: databaseConnected ? "Cloudflare D1" : "로컬 저장소",
      detail: "D1 바인딩 전에도 fallback 유지",
      status: databaseConnected ? "연결" : "준비"
    }
  ];
}
