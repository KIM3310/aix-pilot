export type ServicePackage = {
  id: string;
  name: string;
  reviewer: string;
  promise: string;
  usage: string;
  resources: string[];
  activationGate: string;
  riskReversal: string;
  recommended?: boolean;
};

export type BuyerPersona = {
  id: string;
  role: string;
  pain: string;
  desiredOutcome: string;
  proof: string;
  objection: string;
  closeMessage: string;
};

export type BehavioralLever = {
  id: string;
  principle: string;
  ethicalUse: string;
  productMove: string;
  metric: string;
};

export type CulturalAdoptionPattern = {
  id: string;
  culture: string;
  friction: string;
  rolloutMove: string;
  message: string;
};

export type ValidationExperiment = {
  id: string;
  hypothesis: string;
  test: string;
  successMetric: string;
};

export type TargetVertical = {
  id: string;
  market: string;
  whyNow: string;
  wedgeWorkflow: string;
  approvalOwner: string;
  buyingTrigger: string;
};

export type ExpansionPath = {
  id: string;
  name: string;
  targetTeams: number;
  representativeWorkflows: number;
  channel: string;
  wedge: string;
  whyItCanReach: string;
  resourceFocus: string;
};

export type SalesMotion = {
  id: string;
  stage: string;
  action: string;
  metric: string;
};

export const servicePackages: ServicePackage[] = [
  {
    id: "PKG-DIAGNOSTIC",
    name: "Diagnostic",
    reviewer: "고객센터 1개 핵심 업무",
    promise: "2주 안에 한 업무의 검색 근거, 상담 초안, QA 기준선을 검증합니다.",
    usage: "문서 원천 1~2개, 관리자 1개 팀, 읽기 전용 파일럿",
    resources: ["Cloudflare Pages", "Ollama or approved LLM gateway", "localStorage or D1"],
    activationGate: "문서 소유자, 보안 담당자, 운영 리더가 Go/No-Go 기준을 합의",
    riskReversal: "지표가 불명확하면 업무 범위를 좁혀 재검증"
  },
  {
    id: "PKG-OPERATIONS",
    name: "Operations",
    reviewer: "규제 산업 운영 조직",
    promise: "보안 승인, QA 리포트, 상담 지식 표준화를 묶어 현장 확산을 준비합니다.",
    usage: "부서별 권한, 승인 워크플로우, 평가 게이트, SLO 리포트",
    resources: ["Cloudflare D1 or Postgres", "vector database", "audit log storage", "Sentry"],
    activationGate: "운영 오너와 보안 오너가 같은 릴리스 체크리스트를 승인",
    riskReversal: "운영 전환 전 보안 예외와 데이터 경계를 문서화",
    recommended: true
  },
  {
    id: "PKG-ENTERPRISE",
    name: "Enterprise",
    reviewer: "대형 금융/보험/통신 컨택센터",
    promise: "지식, Agent, QA, 보안 감사까지 운영형 AI 레이어로 묶습니다.",
    usage: "SSO/RBAC, SIEM/DLP 연동, 고급 감사 로그, 릴리스 게이트",
    resources: ["managed Postgres", "private model gateway", "SIEM/DLP", "SSO", "backup storage"],
    activationGate: "CISO, AI PMO, 운영 책임자가 운영 전환 리스크를 공동 승인",
    riskReversal: "고객 데이터 투입 전 접근 권한, 로그 보관, 승인 정책을 먼저 확정"
  }
];

export const buyerPersonas: BuyerPersona[] = [
  {
    id: "BUY-PMO",
    role: "AI PMO",
    pain: "여러 부서의 AI PoC가 산발적으로 끝나고 운영 전환 기준이 없습니다.",
    desiredOutcome: "Go/No-Go를 지표, 리스크, 스펙으로 설명",
    proof: "Spec Coverage, Evaluation Lab, Service Trust Model",
    objection: "우리 조직에 맞게 확장 가능한가?",
    closeMessage: "파일럿은 작은 업무로 시작하고, 운영 전환 근거가 보일 때만 범위를 넓힙니다."
  },
  {
    id: "BUY-OPS",
    role: "고객센터/IT 운영 리더",
    pain: "상담원과 운영자가 같은 답을 반복해서 찾고 초안을 매번 새로 씁니다.",
    desiredOutcome: "응답 시간 단축, 초안 품질 표준화, 신규 인력 온보딩 단축",
    proof: "RAG Citation, Agent Studio, KPI Dashboard",
    objection: "현장 직원이 실제로 쓸까?",
    closeMessage: "자기 문서로 첫 성공 경험을 만들고, 팀 리더가 매주 회수 시간을 확인합니다."
  },
  {
    id: "BUY-SEC",
    role: "보안/컴플라이언스",
    pain: "AI 도입은 빠른데 로그, 권한, DLP, 승인 통제가 뒤따르지 않습니다.",
    desiredOutcome: "민감정보 노출과 무단 발송 리스크 차단",
    proof: "DLP Guard, Prompt Injection Guard, Audit Trail",
    objection: "AI가 통제를 우회하면 어떻게 하나?",
    closeMessage: "고위험 탐지는 운영 전환 리스크로 격상하고 외부 발송은 휴먼 승인에 묶습니다."
  }
];

export const behavioralLevers: BehavioralLever[] = [
  {
    id: "BEH-LOSS",
    principle: "손실 회피",
    ethicalUse: "놓치고 있는 시간과 리스크를 보여주되 공포 과장은 피합니다.",
    productMove: "회수 시간, 지연 업무, 보안 승인 리스크를 한 화면에서 설명",
    metric: "saved hours / open blockers"
  },
  {
    id: "BEH-ENDOW",
    principle: "자기 문서 효과",
    ethicalUse: "고객의 실제 문서와 업무 언어로 데모를 개인화합니다.",
    productMove: "문서 업로드 후 자기 팀 기준 리포트 생성",
    metric: "uploaded docs / return sessions"
  },
  {
    id: "BEH-COMMIT",
    principle: "실행 약속",
    ethicalUse: "작은 실행 약속을 명확히 하되 해지와 보류 선택권을 유지합니다.",
    productMove: "6주 파일럿, 주간 KPI 리뷰, Go/No-Go 기준",
    metric: "weekly active teams / review completion"
  },
  {
    id: "BEH-SOCIAL",
    principle: "사용 증거",
    ethicalUse: "허위 후기 대신 부서별 사용률과 회수 시간을 투명하게 보여줍니다.",
    productMove: "도입률, 재사용률, 성공 workflow 공개",
    metric: "department adoption / expansion request"
  }
];

export const culturalAdoptionPatterns: CulturalAdoptionPattern[] = [
  {
    id: "CUL-HIER",
    culture: "위계가 강한 조직",
    friction: "실무자는 새 도구를 써도 되는지 확신하지 못합니다.",
    rolloutMove: "임원 스폰서 메시지와 팀장 승인 워크플로우를 먼저 둡니다.",
    message: "AI가 사람을 대체하는 것이 아니라 승인된 업무 표준을 빠르게 적용합니다."
  },
  {
    id: "CUL-RISK",
    culture: "보수적/규제 민감 조직",
    friction: "보안팀이 막으면 도입 논의가 멈춥니다.",
    rolloutMove: "Trust Control, DLP, Audit Trail을 첫 단계에서 보여줍니다.",
    message: "AI 기능보다 통제 가능한 운영 모델을 먼저 검증합니다."
  },
  {
    id: "CUL-SPEED",
    culture: "성과 압박이 큰 조직",
    friction: "도구가 좋아도 운영 효과가 늦으면 밀립니다.",
    rolloutMove: "2주 안에 반복 업무 하나를 회수 시간 지표로 고정합니다.",
    message: "긴 전환 프로젝트가 아니라 지금 새는 시간을 먼저 회수합니다."
  },
  {
    id: "CUL-LEARN",
    culture: "학습 지향 조직",
    friction: "팀별 실험이 많아 기준이 흩어집니다.",
    rolloutMove: "골든 질문셋과 평가 게이트로 실험 결과를 비교 가능하게 만듭니다.",
    message: "각 팀의 실험을 하나의 운영 자산으로 축적합니다."
  }
];

export const validationExperiments: ValidationExperiment[] = [
  {
    id: "EXP-VALUE",
    hypothesis: "반복 업무의 회수 시간과 승인 리스크를 같이 보여주면 파일럿 승인 가능성이 높아진다.",
    test: "Value Readiness를 Trust section 뒤에 배치",
    successMetric: "second meeting booked / stakeholder map completed"
  },
  {
    id: "EXP-TRUST",
    hypothesis: "보안 통제와 운영 전환 리스크를 먼저 보여주면 엔터프라이즈 구매 저항이 낮아진다.",
    test: "Trust section을 서비스 범위 설명 전에 노출",
    successMetric: "security review checklist accepted"
  },
  {
    id: "EXP-CHAMPION",
    hypothesis: "팀 리더용 주간 리포트를 제공하면 내부 champion이 생긴다.",
    test: "리포트 다운로드와 주간 KPI 템플릿 제공",
    successMetric: "weekly review cadence created"
  }
];

export const targetVerticals: TargetVertical[] = [
  {
    id: "TV-FIN",
    market: "카드/보험/증권 고객센터",
    whyNow: "상담량, 규제, 민감정보, QA 부담이 모두 커서 AI를 써도 통제 증적이 필요합니다.",
    wedgeWorkflow: "분실/청구/민원/상품설명 FAQ와 상담 후처리",
    approvalOwner: "고객센터장 + CISO + AI PMO",
    buyingTrigger: "상담 시간 단축 또는 QA 샘플링 부담 완화"
  },
  {
    id: "TV-TELCO",
    market: "통신/구독/커머스 대형 CS",
    whyNow: "요금제, 환불, 배송, 장애 응대 지식이 자주 바뀌고 상담 스크립트 표준화가 어렵습니다.",
    wedgeWorkflow: "요금제 변경, 장애 안내, 환불 예외 승인",
    approvalOwner: "CX 본부 + 운영혁신 + 정보보안",
    buyingTrigger: "1차 응답 시간과 상담 후처리 시간을 동시에 줄여야 하는 시점"
  },
  {
    id: "TV-BPO",
    market: "BPO/컨택센터 아웃소싱사",
    whyNow: "한 번 검증하면 여러 고객사 센터로 확장 가능한 채널 레버리지가 있습니다.",
    wedgeWorkflow: "신규 프로젝트 상담원 온보딩과 고객사별 지식팩",
    approvalOwner: "BPO 대표/사업본부 + 고객사 운영 책임자",
    buyingTrigger: "신규 센터 런칭 기간 단축과 agent productivity 증명"
  }
];

export const expansionPaths: ExpansionPath[] = [
  {
    id: "EXPAND-REGULATED",
    name: "규제 산업 센터 확장",
    targetTeams: 8,
    representativeWorkflows: 12,
    channel: "직접 도입 + 보안/AI PMO 동시 설득",
    wedge: "민감정보 많은 고객센터 QA/RAG/Agent 운영",
    whyItCanReach: "같은 보안 게이트와 평가셋을 반복 적용할 수 있어 계정별 운영 리스크를 낮출 수 있습니다.",
    resourceFocus: "SSO, audit retention, vector search, DLP policy"
  },
  {
    id: "EXPAND-BPO",
    name: "BPO 파트너 확장",
    targetTeams: 18,
    representativeWorkflows: 8,
    channel: "BPO/OEM 파트너십",
    wedge: "고객사별 지식팩과 상담원 온보딩",
    whyItCanReach: "파트너 채널은 같은 워크스페이스를 고객사별 템플릿으로 복제하기 좋습니다.",
    resourceFocus: "tenant isolation, workspace templates, usage logging"
  },
  {
    id: "EXPAND-MIXED",
    name: "상위 계정 + 중견 운영 혼합",
    targetTeams: 15,
    representativeWorkflows: 10,
    channel: "상위 계정 직접 도입, 중견 계정 파트너 운영",
    wedge: "고위험 업무는 Enterprise, 반복 업무는 Operations로 분리",
    whyItCanReach: "서비스 범위를 업무 위험도별로 분리해 운영 부담을 통제할 수 있습니다.",
    resourceFocus: "deployment lanes, customer success playbook, release gates"
  }
];

export const salesMotions: SalesMotion[] = [
  {
    id: "MOTION-WEDGE",
    stage: "01 Wedge",
    action: "보험금 청구, 카드 분실, 환불 예외처럼 반복·규제·민감정보가 겹친 업무 하나를 고릅니다.",
    metric: "2주 안에 기준선과 Go/No-Go 조건 확보"
  },
  {
    id: "MOTION-CHAMPION",
    stage: "02 Champion",
    action: "센터장에게 회수 시간, 보안팀에게 DLP/Audit, AI PMO에게 Go/No-Go 리포트를 각각 제공합니다.",
    metric: "3자 승인 회의 확보"
  },
  {
    id: "MOTION-EXPAND",
    stage: "03 Expand",
    action: "같은 지식팩을 다른 팀, 다른 상품, 다른 고객사 센터로 복제합니다.",
    metric: "90일 내 3개 workflow 확장 검토"
  },
  {
    id: "MOTION-RETAIN",
    stage: "04 Retain",
    action: "월간 QA 리포트와 평가 게이트를 운영 회의에 연결해 지속 사용 근거를 남깁니다.",
    metric: "월간 운영 리뷰 유지"
  }
];
