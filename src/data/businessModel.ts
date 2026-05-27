export type PricingTier = {
  id: string;
  name: string;
  monthlyKrw: number;
  setupKrw: number;
  buyer: string;
  promise: string;
  usage: string;
  features: string[];
  conversionTrigger: string;
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

export type RevenueExperiment = {
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
  budgetOwner: string;
  buyingTrigger: string;
};

export type ScaleScenario = {
  id: string;
  name: string;
  targetAccounts: number;
  monthlyKrw: number;
  setupKrw: number;
  channel: string;
  wedge: string;
  whyItCanReach: string;
};

export type SalesMotion = {
  id: string;
  stage: string;
  action: string;
  metric: string;
};

export const pricingTiers: PricingTier[] = [
  {
    id: "PRICE-PILOT",
    name: "Pilot",
    monthlyKrw: 2900000,
    setupKrw: 15000000,
    buyer: "고객센터 1개 핵심 업무",
    promise: "2주 안에 한 업무의 상담 초안, 근거 검색, QA 시간을 돈으로 환산합니다.",
    usage: "월 30,000 질의 / 문서 5,000개 / 관리자 5명",
    features: ["RAG 콘솔", "Agent 초안", "DLP 마스킹", "기본 KPI", "파일럿 리포트", "현장 온보딩"],
    conversionTrigger: "현재 업무 기준 ROI가 월 구독료 3배 이상이면 결제 전환",
    riskReversal: "2주 내 기준 지표가 보이지 않으면 범위를 좁혀 재검증"
  },
  {
    id: "PRICE-OPS",
    name: "Ops",
    monthlyKrw: 9900000,
    setupKrw: 35000000,
    buyer: "100~300석 regulated ops",
    promise: "보안 승인, QA 리포트, 상담 지식 표준화를 묶어 현장 확산을 만듭니다.",
    usage: "월 150,000 질의 / 문서 50,000개 / 관리자 20명",
    features: ["부서별 권한 설계", "승인 워크플로우", "평가 게이트", "SLO 리포트", "도입 코칭", "QA 샘플링"],
    conversionTrigger: "보안 담당자와 운영 오너가 동시에 승인하면 연간 계약 제안",
    riskReversal: "파일럿 종료 전 Go/No-Go 리포트와 전환 로드맵 제공"
  },
  {
    id: "PRICE-ENT",
    name: "Enterprise",
    monthlyKrw: 29000000,
    setupKrw: 90000000,
    buyer: "대형 금융/보험/통신 컨택센터",
    promise: "수백 석 상담 조직의 지식, Agent, QA, 보안 감사까지 운영형 AI 레이어로 묶습니다.",
    usage: "월 600,000 질의 / 전사 문서 / 고급 감사 로그 / 전담 CSM",
    features: ["SSO/RBAC 설계", "SIEM/DLP 연동", "전사 KPI", "릴리스 게이트", "보안 리뷰 패키지", "전담 운영 리포트"],
    conversionTrigger: "리스크 비용과 시간 절감액이 연간 계약액 5배 이상이면 예산화",
    riskReversal: "보안 예외와 운영 범위를 계약 전 명시",
    recommended: true
  }
];

export const buyerPersonas: BuyerPersona[] = [
  {
    id: "BUY-PMO",
    role: "AI PMO",
    pain: "여러 부서의 AI PoC가 산발적으로 끝나고 운영 전환 기준이 없습니다.",
    desiredOutcome: "Go/No-Go를 숫자, 리스크, 스펙으로 설명",
    proof: "Spec Coverage, Evaluation Lab, Service Trust Model",
    objection: "우리 조직에 맞게 확장 가능한가?",
    closeMessage: "파일럿은 무료 기준으로 시작하고, 운영 전환이 보일 때만 유료 확장합니다."
  },
  {
    id: "BUY-OPS",
    role: "고객센터/IT 운영 리더",
    pain: "상담원과 운영자가 같은 답을 반복해서 찾고 초안을 매번 새로 씁니다.",
    desiredOutcome: "응답 시간 단축, 초안 품질 표준화, 신규 인력 온보딩 단축",
    proof: "RAG Citation, Agent Studio, KPI Dashboard",
    objection: "현장 직원이 실제로 쓸까?",
    closeMessage: "자기 문서로 첫 성공 경험을 만들고, 팀 리더가 매주 절감 시간을 확인합니다."
  },
  {
    id: "BUY-SEC",
    role: "보안/컴플라이언스",
    pain: "AI 도입은 빠른데 로그, 권한, DLP, 승인 통제가 뒤따르지 않습니다.",
    desiredOutcome: "민감정보 노출과 무단 발송 리스크 차단",
    proof: "DLP Guard, Prompt Injection Guard, Audit Trail",
    objection: "AI가 통제를 우회하면 어떻게 하나?",
    closeMessage: "고위험 탐지는 launch blocker로 격상하고 외부 발송은 휴먼 승인에 묶습니다."
  }
];

export const behavioralLevers: BehavioralLever[] = [
  {
    id: "BEH-LOSS",
    principle: "Loss Aversion",
    ethicalUse: "잃고 있는 시간과 리스크 비용을 숫자로 보여주되 공포 과장은 피합니다.",
    productMove: "월 절감액, 리스크 회피액, 회수 기간을 첫 화면에서 계산",
    metric: "ROI multiple / payback months"
  },
  {
    id: "BEH-ENDOW",
    principle: "Endowment Effect",
    ethicalUse: "고객의 실제 문서와 업무 언어로 데모를 개인화합니다.",
    productMove: "문서 업로드 후 자기 팀 기준 리포트 생성",
    metric: "uploaded docs / return sessions"
  },
  {
    id: "BEH-COMMIT",
    principle: "Commitment Device",
    ethicalUse: "작은 실행 약속을 명확히 하되 해지와 보류 선택권을 유지합니다.",
    productMove: "6주 파일럿, 주간 KPI 리뷰, Go/No-Go 기준",
    metric: "weekly active teams / review completion"
  },
  {
    id: "BEH-SOCIAL",
    principle: "Social Proof",
    ethicalUse: "허위 후기 대신 부서별 사용률과 절감 시간을 투명하게 보여줍니다.",
    productMove: "도입률, 재사용률, 성공 workflow 공개",
    metric: "department adoption / expansion rate"
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
    friction: "보안팀이 막으면 구매 논의가 멈춥니다.",
    rolloutMove: "Trust Control, DLP, Audit Trail을 영업 첫 단계에서 보여줍니다.",
    message: "AI 기능보다 통제 가능한 운영 모델을 먼저 검증합니다."
  },
  {
    id: "CUL-SPEED",
    culture: "성과 압박이 큰 조직",
    friction: "도구가 좋아도 ROI가 늦으면 밀립니다.",
    rolloutMove: "2주 안에 반복 업무 하나를 절감 지표로 고정합니다.",
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

export const revenueExperiments: RevenueExperiment[] = [
  {
    id: "EXP-ROI",
    hypothesis: "월 절감액이 가격의 3배 이상으로 보이면 Pilot 전환율이 오른다.",
    test: "가격표 앞에 ROI calculator를 배치",
    successMetric: "demo-to-pilot conversion 18%+"
  },
  {
    id: "EXP-TRUST",
    hypothesis: "보안 통제와 blocker를 먼저 보여주면 엔터프라이즈 구매 저항이 낮아진다.",
    test: "Trust section을 가격 설명 전에 노출",
    successMetric: "security review pass 70%+"
  },
  {
    id: "EXP-CHAMPION",
    hypothesis: "팀 리더용 주간 리포트를 제공하면 내부 champion이 생긴다.",
    test: "리포트 다운로드와 주간 KPI 템플릿 제공",
    successMetric: "2nd meeting booked 45%+"
  }
];

export const targetVerticals: TargetVertical[] = [
  {
    id: "TV-FIN",
    market: "카드/보험/증권 고객센터",
    whyNow: "상담량, 규제, 민감정보, QA 부담이 모두 커서 AI를 써도 통제 증적이 필요합니다.",
    wedgeWorkflow: "분실/청구/민원/상품설명 FAQ와 상담 후처리",
    budgetOwner: "고객센터장 + CISO + AI PMO",
    buyingTrigger: "상담 시간 15% 절감 또는 QA 샘플링 비용 30% 절감"
  },
  {
    id: "TV-TELCO",
    market: "통신/구독/커머스 대형 CS",
    whyNow: "요금제, 환불, 배송, 장애 응대 지식이 자주 바뀌고 상담 스크립트 표준화가 어렵습니다.",
    wedgeWorkflow: "요금제 변경, 장애 안내, 환불 예외 승인",
    budgetOwner: "CX 본부 + 운영혁신 + 정보보안",
    buyingTrigger: "1차 응답 시간과 상담 후처리 시간을 동시에 절감"
  },
  {
    id: "TV-BPO",
    market: "BPO/컨택센터 아웃소싱사",
    whyNow: "한 번 팔면 여러 고객사 센터로 확장 가능한 채널 레버리지가 있습니다.",
    wedgeWorkflow: "신규 프로젝트 상담원 온보딩과 고객사별 지식팩",
    budgetOwner: "BPO 대표/사업본부 + 고객사 운영 책임자",
    buyingTrigger: "신규 센터 런칭 기간 단축과 agent productivity 증명"
  }
];

export const scaleScenarios: ScaleScenario[] = [
  {
    id: "SCALE-WHALE",
    name: "8개 대형 regulated center",
    targetAccounts: 8,
    monthlyKrw: 29000000,
    setupKrw: 90000000,
    channel: "직판 + 보안/AI PMO 동시 설득",
    wedge: "민감정보 많은 고객센터 QA/RAG/Agent 운영",
    whyItCanReach: "8개 엔터프라이즈만 확보해도 월 반복매출 2.3억 이상"
  },
  {
    id: "SCALE-BPO",
    name: "BPO 파트너 3곳, 고객사 18센터",
    targetAccounts: 18,
    monthlyKrw: 9900000,
    setupKrw: 35000000,
    channel: "BPO/OEM 파트너십",
    wedge: "고객사별 지식팩과 상담원 온보딩",
    whyItCanReach: "직판보다 빠른 다중 센터 확장으로 월 1.7억 MRR"
  },
  {
    id: "SCALE-MIXED",
    name: "Enterprise 5곳 + Ops 10곳",
    targetAccounts: 15,
    monthlyKrw: 0,
    setupKrw: 0,
    channel: "상위 계정 직판, 중견 계정 파트너",
    wedge: "고위험 업무는 Enterprise, 반복 업무는 Ops로 분리",
    whyItCanReach: "혼합 포트폴리오로 월 2.4억 이상과 셋업 매출을 동시에 확보"
  }
];

export const salesMotions: SalesMotion[] = [
  {
    id: "MOTION-WEDGE",
    stage: "01 Wedge",
    action: "보험금 청구, 카드 분실, 환불 예외처럼 반복·규제·민감정보가 겹친 업무 하나를 고릅니다.",
    metric: "2주 안에 10,000건 기준 ROI 산출"
  },
  {
    id: "MOTION-CHAMPION",
    stage: "02 Champion",
    action: "센터장에게 절감 시간, 보안팀에게 DLP/Audit, AI PMO에게 Go/No-Go 리포트를 각각 제공합니다.",
    metric: "3자 승인 회의 확보"
  },
  {
    id: "MOTION-EXPAND",
    stage: "03 Expand",
    action: "같은 지식팩을 다른 팀, 다른 상품, 다른 고객사 센터로 복제합니다.",
    metric: "90일 내 3개 workflow 확장"
  },
  {
    id: "MOTION-LOCK",
    stage: "04 Retain",
    action: "월간 QA 리포트와 평가 게이트를 운영 회의에 박아 churn을 낮춥니다.",
    metric: "연간 계약 전환 70%+"
  }
];
