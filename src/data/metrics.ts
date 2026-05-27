export const kpiTrend = [
  { week: "W1", automation: 18, rag: 52, risk: 9, satisfaction: 68 },
  { week: "W2", automation: 24, rag: 61, risk: 7, satisfaction: 72 },
  { week: "W3", automation: 31, rag: 68, risk: 8, satisfaction: 78 },
  { week: "W4", automation: 37, rag: 74, risk: 5, satisfaction: 81 },
  { week: "W5", automation: 43, rag: 79, risk: 4, satisfaction: 84 },
  { week: "W6", automation: 48, rag: 83, risk: 3, satisfaction: 87 }
];

export const costProfile = [
  { name: "로컬 RAG", value: 0 },
  { name: "오픈소스 LLM", value: 0 },
  { name: "호스팅 옵션", value: 12 },
  { name: "관측/로그", value: 0 }
];

export const workflowEvents = [
  { id: 1, actor: "CX Agent", action: "환불 문의 요약", status: "완료", time: "09:12", risk: "낮음" },
  { id: 2, actor: "RAG Core", action: "정책 문서 4건 검색", status: "완료", time: "09:14", risk: "낮음" },
  { id: 3, actor: "Security Guard", action: "전화번호 마스킹", status: "검토", time: "09:17", risk: "중간" },
  { id: 4, actor: "Report Agent", action: "주간 KPI 보고서 초안", status: "대기", time: "09:25", risk: "낮음" }
];

export const departmentAdoption = [
  { team: "고객센터", usage: 84, saved: 142 },
  { team: "IT", usage: 67, saved: 86 },
  { team: "영업", usage: 58, saved: 64 },
  { team: "보안", usage: 42, saved: 38 }
];
