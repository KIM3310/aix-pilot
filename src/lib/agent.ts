import type { RagAnswer, SearchResult } from "./rag";
import { maskSensitive, scanRisk } from "./security";

export type AgentMode = "FAQ 응답" | "이메일 생성" | "보고서 생성" | "업무 자동화";

export type AgentStep = {
  label: string;
  status: "done" | "review" | "waiting";
  detail: string;
};

export type AgentDraft = {
  mode: AgentMode;
  title: string;
  output: string;
  steps: AgentStep[];
  requiresApproval: boolean;
};

function citationLine(citations: SearchResult[]) {
  return citations.length ? citations.map((item) => item.title).join(", ") : "근거 문서 없음";
}

function securityNote(risk: ReturnType<typeof scanRisk>) {
  const maskedItems = risk
    .filter((finding) => finding.match)
    .map((finding) => `${finding.type} ${maskSensitive(finding.match ?? "")}`);

  if (!maskedItems.length) return "";

  return `\n\n[내부 보안 메모]\n요청 내 ${Array.from(new Set(maskedItems)).join(", ")} 감지. 외부 발송 전 원문 값은 제외하고 마스킹 상태로 승인해야 합니다.`;
}

export function runAgent(mode: AgentMode, query: string, ragAnswer: RagAnswer): AgentDraft {
  const risk = scanRisk(`${query}\n${ragAnswer.answer}`);
  const hasHighRisk = risk.some((finding) => finding.severity === "높음");
  const safeAnswer = maskSensitive(ragAnswer.answer);
  const safeSecurityNote = securityNote(risk);
  const baseSteps: AgentStep[] = [
    { label: "요청 분류", status: "done", detail: `${mode} 업무로 분류` },
    { label: "RAG 검색", status: ragAnswer.citations.length ? "done" : "review", detail: citationLine(ragAnswer.citations) },
    {
      label: "보안 점검",
      status: risk.length ? "review" : "done",
      detail: risk.length ? `${risk.length}개 리스크 발견` : "민감정보 없음"
    }
  ];

  if (mode === "이메일 생성") {
    return {
      mode,
      title: "고객/임직원 안내 메일 초안",
      output: `안녕하세요.\n\n문의하신 내용에 대해 확인한 결과는 아래와 같습니다.\n\n${safeAnswer}\n\n추가 확인이 필요한 경우 담당자가 후속 조치하겠습니다.\n감사합니다.${safeSecurityNote}`,
      steps: [...baseSteps, { label: "발송 승인", status: "waiting", detail: "외부 발송 전 담당자 승인 필요" }],
      requiresApproval: true
    };
  }

  if (mode === "보고서 생성") {
    return {
      mode,
      title: "AI 파일럿 보고서 요약",
      output: `핵심 질의: ${maskSensitive(query)}\n\n요약:\n${safeAnswer}\n\n근거:\n${citationLine(ragAnswer.citations)}\n\n권장 후속 조치:\n1. 근거 문서 최신성 확인\n2. 사용자 피드백 수집\n3. 보안 리스크 항목 검토${safeSecurityNote}`,
      steps: [...baseSteps, { label: "보고서 초안", status: "done", detail: "근거 포함 요약 생성" }],
      requiresApproval: hasHighRisk
    };
  }

  if (mode === "업무 자동화") {
    return {
      mode,
      title: "업무 자동화 실행 계획",
      output: `업무 요청을 처리하기 위한 자동화 플로우입니다.\n\n1. 요청 내용을 티켓으로 등록\n2. 관련 문서 검색 및 근거 연결\n3. 담당 부서 큐에 배정\n4. 승인 필요 작업은 휴먼 승인 대기\n5. 처리 결과와 근거 문서를 감사 로그에 저장\n\n현재 추천 답변:\n${safeAnswer}${safeSecurityNote}`,
      steps: [
        ...baseSteps,
        { label: "티켓 생성", status: "done", detail: "업무 큐에 등록 가능" },
        { label: "휴먼 승인", status: "waiting", detail: "환불/권한/외부발송이면 승인 필요" }
      ],
      requiresApproval: true
    };
  }

  return {
    mode,
    title: "FAQ 응답 초안",
    output: `${safeAnswer}${safeSecurityNote}`,
    steps: [...baseSteps, { label: "FAQ 게시", status: "review", detail: "정책 소유자 검토 후 게시 권장" }],
    requiresApproval: hasHighRisk
  };
}
