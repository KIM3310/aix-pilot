export type SpecStatus = "완료" | "검증" | "확장";

export type CapabilityRequirement = {
  id: string;
  area: string;
  requirement: string;
  pilot: string;
  production: string;
  owner: string;
  evidence: string;
  status: SpecStatus;
};

export type RolloutPhase = {
  id: string;
  phase: string;
  window: string;
  outcome: string;
  gates: string[];
};

export type EvaluationGate = {
  id: string;
  name: string;
  metric: string;
  pass: string;
  evidence: string;
  owner: string;
};

export type SecurityGate = {
  id: string;
  name: string;
  severity: "낮음" | "중간" | "높음";
  control: string;
  evidence: string;
};

export type StackDecision = {
  id: string;
  layer: string;
  freeOption: string;
  enterprisePath: string;
  constraint: string;
};

export const capabilityRequirements: CapabilityRequirement[] = [
  {
    id: "REQ-RAG-001",
    area: "RAG",
    requirement: "문서 근거, 소유자, 최신일, 점수를 답변과 함께 표시",
    pilot: "로컬 청크 검색과 중복 근거 제거",
    production: "권한 필터 + 하이브리드 검색 + reranker",
    owner: "AI Platform",
    evidence: "rag.test.ts / 화면 Citation rows",
    status: "완료"
  },
  {
    id: "REQ-AGT-002",
    area: "Agent",
    requirement: "FAQ, 이메일, 보고서, 자동화 초안을 업무 모드별 생성",
    pilot: "Playbook 기반 초안과 승인 단계",
    production: "워크플로우 엔진 + 승인자 라우팅 + 실패 복구",
    owner: "Business Ops",
    evidence: "agent.test.ts / Agent Studio",
    status: "완료"
  },
  {
    id: "REQ-SEC-003",
    area: "Security",
    requirement: "PII/DLP 탐지, 마스킹, 휴먼 승인 게이트",
    pilot: "전화번호/이메일/주민번호/민감 키워드 탐지",
    production: "OPA/Presidio/SIEM 연동",
    owner: "Security",
    evidence: "security.test.ts / Security Guard",
    status: "완료"
  },
  {
    id: "REQ-KPI-004",
    area: "KPI",
    requirement: "도입 성과와 운영 리스크를 파일럿 KPI로 표시",
    pilot: "RAG, 자동화, 보안 차단, 절감 시간 대시보드",
    production: "BI 데이터마트 + 팀별 SLA 리포트",
    owner: "AI PMO",
    evidence: "KPI Dashboard / Recharts",
    status: "검증"
  },
  {
    id: "REQ-AUD-005",
    area: "Audit",
    requirement: "질의, Agent 실행, 리포트 다운로드 이력 보존",
    pilot: "localStorage 감사 로그와 실행 이력",
    production: "불변 감사 저장소 + 보관 정책",
    owner: "Compliance",
    evidence: "Audit Trail / report.test.ts",
    status: "검증"
  },
  {
    id: "REQ-EVAL-006",
    area: "Evaluation",
    requirement: "골든 질문셋으로 검색 정확도, 근거 포함, 안전성 회귀 검증",
    pilot: "Evaluation Lab + Vitest golden suite",
    production: "오프라인 평가 파이프라인 + SME 라벨링 + 릴리스 게이트",
    owner: "AI Quality",
    evidence: "evaluation.test.ts / Evaluation Lab",
    status: "완료"
  },
  {
    id: "REQ-OPS-007",
    area: "Deployment",
    requirement: "무료 기준 PoC에서 운영 확장 경로 제시",
    pilot: "Vite 정적 배포 + 로컬 LLM/Vector DB 확장 문서",
    production: "SSO, RBAC, observability, backup",
    owner: "Infra",
    evidence: "FREE_DEPLOYMENT.md / Spec Pack",
    status: "확장"
  }
];

export const rolloutPhases: RolloutPhase[] = [
  {
    id: "P0",
    phase: "Discovery",
    window: "Week 0",
    outcome: "문서 원천, 민감도, 사용자 그룹, KPI 기준선 확정",
    gates: ["데이터 소유자 지정", "민감정보 샘플 제거", "성공 지표 합의"]
  },
  {
    id: "P1",
    phase: "Pilot Build",
    window: "Week 1-2",
    outcome: "RAG 검색, Agent 초안, DLP, 감사 로그를 무료 스택으로 연결",
    gates: ["근거 표시 90%+", "PII 마스킹 100%", "외부 발송 승인 게이트"]
  },
  {
    id: "P2",
    phase: "Business Trial",
    window: "Week 3-5",
    outcome: "고객센터/IT/영업 업무별 실제 질문셋으로 효과 측정",
    gates: ["만족도 80%+", "무응답률 12% 이하", "처리 시간 25% 단축"]
  },
  {
    id: "P3",
    phase: "Go / No-Go",
    window: "Week 6",
    outcome: "운영 전환 범위, 비용, 보안 예외, 소유권 결정",
    gates: ["감사 로그 검토", "보안 승인", "운영비 상한 합의"]
  }
];

export const evaluationGates: EvaluationGate[] = [
  {
    id: "EVAL-GRD",
    name: "Grounded Answer",
    metric: "근거 포함률",
    pass: "90% 이상",
    evidence: "답변마다 Citation과 문서 소유자 표시",
    owner: "AI PMO"
  },
  {
    id: "EVAL-DLP",
    name: "DLP Masking",
    metric: "원문 PII 미노출",
    pass: "100%",
    evidence: "Agent/Report 테스트에서 원문 전화번호와 이메일 차단",
    owner: "Security"
  },
  {
    id: "EVAL-AGT",
    name: "Agent Approval",
    metric: "고위험 작업 승인 게이트",
    pass: "외부 발송/환불/권한 변경 100%",
    evidence: "Agent 단계에 휴먼 승인 표시",
    owner: "Business Ops"
  },
  {
    id: "EVAL-UX",
    name: "Pilot Usability",
    metric: "반응형/오버플로우/콘솔 에러",
    pass: "Desktop/Mobile 에러 0",
    evidence: "Browser QA screenshots",
    owner: "Product"
  }
];

export const securityGates: SecurityGate[] = [
  {
    id: "SEC-PII",
    name: "PII Redaction",
    severity: "높음",
    control: "답변, Agent 초안, 리포트 다운로드 전 마스킹",
    evidence: "report.test.ts / security.test.ts"
  },
  {
    id: "SEC-RBAC",
    name: "Access Boundary",
    severity: "높음",
    control: "운영 전 문서별 allowed_roles 메타데이터 필수",
    evidence: "ARCHITECTURE.md 권한 필터링 원칙"
  },
  {
    id: "SEC-AUD",
    name: "Audit Retention",
    severity: "중간",
    control: "질의, 근거 문서, Agent 단계, 승인 이력 보관",
    evidence: "Audit Trail + Retention control"
  },
  {
    id: "SEC-HITL",
    name: "Human In The Loop",
    severity: "중간",
    control: "외부 발송, 환불 승인, 권한 변경은 자동 처리 금지",
    evidence: "Agent Studio approval badge"
  }
];

export const stackDecisions: StackDecision[] = [
  {
    id: "STK-UI",
    layer: "Frontend",
    freeOption: "React + Vite + Recharts",
    enterprisePath: "Next.js or internal portal shell",
    constraint: "정적 배포 가능, 서버 권한 검사는 별도 API 필요"
  },
  {
    id: "STK-RAG",
    layer: "Retrieval",
    freeOption: "Local TF-IDF",
    enterprisePath: "Qdrant/Chroma + reranker",
    constraint: "대용량 문서와 권한 필터는 서버 색인으로 전환"
  },
  {
    id: "STK-LLM",
    layer: "LLM",
    freeOption: "Rule-based demo / Ollama",
    enterprisePath: "Approved model gateway",
    constraint: "모델 로그, 데이터 보존, 학습 제외 조건 확인"
  },
  {
    id: "STK-GRC",
    layer: "Governance",
    freeOption: "Pattern DLP + local audit",
    enterprisePath: "OPA + SIEM + DLP suite",
    constraint: "실제 고객 데이터 투입 전 보안 승인 필수"
  }
];
