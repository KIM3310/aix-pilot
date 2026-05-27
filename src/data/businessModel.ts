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

export const pricingTiers: PricingTier[] = [
  {
    id: "PRICE-PILOT",
    name: "Pilot",
    monthlyKrw: 490000,
    setupKrw: 1500000,
    buyer: "1개 부서 파일럿",
    promise: "6주 안에 문서 탐색 시간과 상담 초안 시간을 수치로 줄입니다.",
    usage: "월 3,000 질의 / 문서 1,000개 / 관리자 3명",
    features: ["RAG 콘솔", "Agent 초안", "DLP 마스킹", "기본 KPI", "파일럿 리포트"],
    conversionTrigger: "현재 업무 기준 ROI가 월 구독료 3배 이상이면 결제 전환",
    riskReversal: "2주 내 기준 지표가 보이지 않으면 온보딩 비용 재조정"
  },
  {
    id: "PRICE-OPS",
    name: "Ops",
    monthlyKrw: 1490000,
    setupKrw: 3500000,
    buyer: "고객센터/IT/영업 3개 부서",
    promise: "보안 승인과 운영 리포트까지 묶어 내부 확산을 빠르게 만듭니다.",
    usage: "월 15,000 질의 / 문서 10,000개 / 관리자 10명",
    features: ["부서별 권한 설계", "승인 워크플로우", "평가 게이트", "SLO 리포트", "도입 코칭"],
    conversionTrigger: "보안 담당자와 운영 오너가 동시에 승인하면 연간 계약 제안",
    riskReversal: "파일럿 종료 전 Go/No-Go 리포트와 전환 로드맵 제공",
    recommended: true
  },
  {
    id: "PRICE-ENT",
    name: "Enterprise",
    monthlyKrw: 3900000,
    setupKrw: 9000000,
    buyer: "전사 AI PMO / 보안 조직",
    promise: "SSO, RBAC, SIEM, 감사 대응까지 포함한 운영형 GenAI 레이어를 구축합니다.",
    usage: "월 60,000 질의 / 전사 문서 / 고급 감사 로그",
    features: ["SSO/RBAC 설계", "SIEM/DLP 연동", "전사 KPI", "릴리스 게이트", "보안 리뷰 패키지"],
    conversionTrigger: "리스크 비용과 시간 절감액이 연간 계약액 5배 이상이면 예산화",
    riskReversal: "보안 예외와 운영 범위를 계약 전 명시"
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
