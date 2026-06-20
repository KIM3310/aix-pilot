export type ServicePillar = {
  id: string;
  name: string;
  intent: string;
  operator: string;
  metric: string;
  evidence: string;
  score: number;
};

export type TrustControl = {
  id: string;
  name: string;
  category: "Identity" | "Data" | "Model" | "Agent" | "Audit" | "Reliability";
  severity: "낮음" | "중간" | "높음";
  status: "활성" | "설계 완료" | "운영 전환";
  objective: string;
  evidence: string;
  automation: string;
};

export type ServiceLevelObjective = {
  id: string;
  metric: string;
  target: string;
  current: string;
  owner: string;
  signal: string;
  status: "정상" | "주의" | "확장";
};

export type MaturityStage = {
  id: string;
  stage: string;
  promise: string;
  gate: string;
};

export const servicePillars: ServicePillar[] = [
  {
    id: "SRV-UX",
    name: "Executive UX",
    intent: "파일럿 의사결정자가 3분 안에 가치, 리스크, 다음 행동을 이해",
    operator: "Product",
    metric: "핵심 상태 카드와 근거 노출률",
    evidence: "Hero proof row / Command dashboard",
    score: 94
  },
  {
    id: "SRV-RAG",
    name: "Retrieval Quality",
    intent: "답변마다 출처, 소유자, 최신일, 점수를 노출해 근거 없는 응답을 억제",
    operator: "AI Platform",
    metric: "Citation coverage 90%+",
    evidence: "Evaluation Lab / rag.test.ts",
    score: 92
  },
  {
    id: "SRV-AGT",
    name: "Agent Control",
    intent: "외부 발송과 권한성 작업은 자동 실행 대신 승인 흐름에 묶음",
    operator: "Business Ops",
    metric: "High-risk action approval 100%",
    evidence: "Agent Studio / agent.test.ts",
    score: 90
  },
  {
    id: "SRV-SEC",
    name: "Security Governance",
    intent: "PII, 비밀값, 프롬프트 인젝션을 탐지하고 산출물에는 마스킹 적용",
    operator: "Security",
    metric: "DLP safety pass 100%",
    evidence: "Security Guard / security.test.ts",
    score: 93
  },
  {
    id: "SRV-OPS",
    name: "Operating Evidence",
    intent: "품질, 보안, 비용, 도입률 지표를 운영 전환 판단 근거로 유지",
    operator: "AI PMO",
    metric: "Spec coverage 90%+",
    evidence: "Spec Pack / serviceReadiness.test.ts",
    score: 91
  },
  {
    id: "SRV-DEP",
    name: "Free Deployment Path",
    intent: "Ollama, Cloudflare Pages, D1로 무료 LLM/배포/DB 경로를 실행 가능하게 유지",
    operator: "Infra",
    metric: "Zero external API baseline + CI green",
    evidence: "FREE_DEPLOYMENT.md / GitHub Actions / Free runtime panel",
    score: 91
  }
];

export const trustControls: TrustControl[] = [
  {
    id: "TRUST-ID",
    name: "Access Boundary",
    category: "Identity",
    severity: "높음",
    status: "설계 완료",
    objective: "문서별 allowed_roles와 사용자 역할을 검색 전에 교차 검증",
    evidence: "Enterprise Spec Pack / THREAT_MODEL.md",
    automation: "Production API에서 retrieval pre-filter로 전환"
  },
  {
    id: "TRUST-DLP",
    name: "PII & Secret DLP",
    category: "Data",
    severity: "높음",
    status: "활성",
    objective: "전화번호, 이메일, 주민번호 패턴, 토큰형 비밀값을 탐지하고 산출물 마스킹",
    evidence: "security.test.ts / report.test.ts",
    automation: "입력, 모델 출력, 다운로드 직전 3중 스캔"
  },
  {
    id: "TRUST-INJ",
    name: "Prompt Injection Guard",
    category: "Model",
    severity: "높음",
    status: "활성",
    objective: "시스템 프롬프트 유출, 이전 지시 무시, 정책 우회 요청을 고위험으로 분류",
    evidence: "Security Guard / service readiness penalty",
    automation: "고위험 탐지 시 외부 발송 Agent 승인 필수"
  },
  {
    id: "TRUST-HITL",
    name: "Human Approval",
    category: "Agent",
    severity: "중간",
    status: "활성",
    objective: "고객 발송, 환불, 권한 변경, 보안 예외는 사람 승인 없이는 완료하지 않음",
    evidence: "Agent Studio approval badge",
    automation: "워크플로우 엔진 연결 시 승인자 라우팅"
  },
  {
    id: "TRUST-AUD",
    name: "Tamper-Evident Audit",
    category: "Audit",
    severity: "중간",
    status: "운영 전환",
    objective: "질의, 근거, Agent 단계, 리포트 다운로드 이력을 추적 가능하게 보존",
    evidence: "Audit Trail / report export",
    automation: "서버 측 append-only 로그와 SIEM 연동"
  },
  {
    id: "TRUST-REL",
    name: "Quality Release Gate",
    category: "Reliability",
    severity: "중간",
    status: "활성",
    objective: "골든 질문셋 점수와 스펙 커버리지가 기준 이하이면 운영 전환을 보류",
    evidence: "Evaluation Lab / npm run qa",
    automation: "CI에서 Vitest와 build gate 실행"
  }
];

export const serviceSlos: ServiceLevelObjective[] = [
  {
    id: "SLO-ANS",
    metric: "Grounded answer rate",
    target: "90%+",
    current: "92%",
    owner: "AI Quality",
    signal: "Citation과 Top retrieval 일치",
    status: "정상"
  },
  {
    id: "SLO-DLP",
    metric: "Raw PII exposure",
    target: "0건",
    current: "0건",
    owner: "Security",
    signal: "Agent preview와 report export 마스킹",
    status: "정상"
  },
  {
    id: "SLO-HITL",
    metric: "High-risk auto-send",
    target: "0건",
    current: "0건",
    owner: "Business Ops",
    signal: "승인 필요 작업 자동 완료 금지",
    status: "정상"
  },
  {
    id: "SLO-OBS",
    metric: "Audit completeness",
    target: "95%+",
    current: "Local proof",
    owner: "Compliance",
    signal: "운영 전 서버 로그 전환 필요",
    status: "확장"
  }
];

export const launchMaturity: MaturityStage[] = [
  {
    id: "L0",
    stage: "Prototype",
    promise: "무료 기준 UI, RAG, Agent, DLP, KPI가 하나의 흐름으로 동작",
    gate: "로컬 QA 통과"
  },
  {
    id: "L1",
    stage: "Pilot Hardened",
    promise: "골든 질문셋, 승인 게이트, 보안 통제가 반복 운영 가능",
    gate: "Eval 85+, Spec 90+, PII raw exposure 0"
  },
  {
    id: "L2",
    stage: "Enterprise Ready",
    promise: "SSO/RBAC, SIEM, 승인 라우팅, 관측성을 실제 시스템에 연결",
    gate: "보안 승인과 운영 소유자 지정"
  }
];
