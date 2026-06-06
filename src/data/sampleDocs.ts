export type SourceType = "고객센터" | "사내지식" | "보안정책" | "운영지표" | "영업지원";

export type KnowledgeDocument = {
  id: string;
  title: string;
  source: SourceType;
  owner: string;
  updatedAt: string;
  sensitivity: "Public" | "Internal" | "Confidential" | "Restricted";
  tags: string[];
  content: string;
};

export const sampleDocuments: KnowledgeDocument[] = [
  {
    id: "cs-refund-policy",
    title: "고객센터 환불 및 교환 정책",
    source: "고객센터",
    owner: "CX 운영팀",
    updatedAt: "2026-05-20",
    sensitivity: "Internal",
    tags: ["환불", "교환", "고객응대", "SLA"],
    content:
      "고객 환불 요청은 구매일로부터 14일 이내 접수된 경우 표준 환불 절차로 처리한다. 단, 디지털 상품의 다운로드 또는 서비스 사용 이력이 확인되면 부분 환불 검토가 필요하다. 상담원은 주문번호, 결제수단, 요청 사유를 확인하고 CRM 티켓에 근거를 남긴다. 고가 상품 또는 반복 환불 요청은 리스크 큐로 이관한다. 처리 SLA는 일반 환불 1영업일, 카드 취소 반영 안내 3~5영업일이다. 고객 안내 문구는 사과, 처리 일정, 추가 문의 채널 순서로 구성한다."
  },
  {
    id: "internal-vpn-guide",
    title: "사내 VPN 장애 대응 가이드",
    source: "사내지식",
    owner: "IT 헬프데스크",
    updatedAt: "2026-05-18",
    sensitivity: "Internal",
    tags: ["VPN", "IT", "장애", "계정"],
    content:
      "VPN 접속 실패가 발생하면 먼저 MFA 인증 시간 만료 여부와 계정 잠금 상태를 확인한다. 비밀번호 변경 후 15분 이내에는 동기화 지연으로 접속이 실패할 수 있다. 동일 사용자의 5회 이상 실패 로그가 있으면 임시 잠금 해제 후 단말 보안 에이전트 상태를 점검한다. 해외 IP 접속은 보안팀 승인 티켓이 필요하다. 긴급 업무자는 임시 우회 권한을 4시간 단위로 발급하고 감사 로그에 사유를 남긴다."
  },
  {
    id: "security-ai-policy",
    title: "생성형 AI 사용 보안 정책",
    source: "보안정책",
    owner: "정보보호팀",
    updatedAt: "2026-05-22",
    sensitivity: "Confidential",
    tags: ["GenAI", "보안", "DLP", "권한"],
    content:
      "생성형 AI 서비스에는 주민등록번호, 계좌번호, 미공개 계약서, 고객 식별정보, 보안 취약점 세부 정보를 입력할 수 없다. 사내 승인된 AI 업무공간은 SSO와 역할 기반 접근제어를 적용해야 하며, 모든 프롬프트와 답변은 감사 로그로 1년간 보관한다. RAG 검색 결과는 사용자의 문서 접근 권한을 기준으로 필터링한다. 외부 모델 API를 사용할 경우 데이터 보존 옵션과 학습 제외 약관을 확인한다. 민감정보 탐지 시 답변 생성 전에 마스킹하고 보안 알림을 남긴다."
  },
  {
    id: "sales-proposal-template",
    title: "B2B 제안서 작성 체크리스트",
    source: "영업지원",
    owner: "세일즈 엔지니어링",
    updatedAt: "2026-05-12",
    sensitivity: "Internal",
    tags: ["제안서", "RFP", "영업", "가치검증"],
    content:
      "제안서는 고객의 현재 문제, 도입 목표, 기대 효과, 일정, 리스크 관리, 운영 범위 순서로 작성한다. Enterprise GenAI 제안의 경우 PoC 범위는 4~6주로 제한하고, 성공 기준은 검색 정확도, 상담 처리 시간, 자동화 완료율, 사용자 만족도 중 3개 이상으로 정의한다. 무료 또는 오픈소스 기반 파일럿은 로컬 LLM, 브라우저 기반 검색, 오픈소스 벡터DB, 사내 SSO 연계 전 단계 모의 권한 정책으로 구성할 수 있다."
  },
  {
    id: "kpi-framework",
    title: "GenAI 파일럿 KPI 프레임워크",
    source: "운영지표",
    owner: "AI PMO",
    updatedAt: "2026-05-24",
    sensitivity: "Internal",
    tags: ["KPI", "가치검증", "대시보드", "품질"],
    content:
      "GenAI 파일럿 KPI는 사용성, 품질, 비용, 리스크 네 축으로 관리한다. 사용성 지표는 주간 활성 사용자, 재사용률, 업무별 호출량이다. 품질 지표는 근거 포함률, 답변 만족도, 무응답률, 재질문율이다. 비용 지표는 업무 1건당 처리 비용과 자동화 절감 시간이다. 리스크 지표는 민감정보 차단 건수, 권한 위반 시도, 휴먼 승인율이다. 파일럿 종료 시 기준선 대비 상담 처리 시간 25% 단축 또는 문서 탐색 시간 40% 단축을 목표로 삼는다."
  },
  {
    id: "agent-playbook",
    title: "업무 자동화 Agent 플레이북",
    source: "사내지식",
    owner: "업무혁신팀",
    updatedAt: "2026-05-21",
    sensitivity: "Internal",
    tags: ["Agent", "자동화", "이메일", "보고서"],
    content:
      "Agent는 사용자의 요청을 분류하고 필요한 문서를 검색한 뒤 업무 초안을 생성한다. 고객센터 Agent는 FAQ 답변, 환불 안내, 장애 접수 요약을 우선 지원한다. 내부 업무 Agent는 회의록 요약, 보고서 초안, 이메일 작성, 정책 질의 응답을 수행한다. 외부 발송 이메일, 환불 승인, 권한 변경, 보안 예외 처리는 반드시 휴먼 승인 단계를 거친다. Agent 실행 로그에는 입력 요약, 참조 문서, 수행 단계, 승인자, 실패 사유를 남긴다."
  },
  {
    id: "faq-shipping",
    title: "배송 지연 FAQ 응답 기준",
    source: "고객센터",
    owner: "CX 운영팀",
    updatedAt: "2026-05-10",
    sensitivity: "Internal",
    tags: ["FAQ", "배송", "고객응대"],
    content:
      "배송 지연 문의에는 주문번호 확인, 현재 배송 상태, 예상 도착일, 보상 가능 여부 순서로 안내한다. 천재지변 또는 택배사 물량 증가로 인한 지연은 배송사 공지 링크를 함께 제공한다. 프리미엄 고객의 72시간 이상 지연 건은 쿠폰 보상 검토 대상이다. 상담원은 고객 불편에 대한 공감 문장을 먼저 작성하고, 확인 가능한 사실과 다음 조치를 분리해서 안내한다."
  },
  {
    id: "rag-ops",
    title: "RAG 운영 품질 관리 원칙",
    source: "사내지식",
    owner: "AI 플랫폼팀",
    updatedAt: "2026-05-25",
    sensitivity: "Confidential",
    tags: ["RAG", "검색", "품질", "운영"],
    content:
      "RAG 시스템은 문서 수집, 정제, 청크 분할, 색인, 검색, 재랭킹, 답변 생성, 피드백 수집 단계로 운영한다. 문서는 소유자, 최신성, 민감도, 접근 권한 메타데이터를 포함해야 한다. 검색 결과는 최소 3개 근거를 표시하고, 답변에 근거가 부족하면 모른다고 답한다. 오래된 문서는 자동으로 품질 점수를 낮추며, 사용자 피드백이 낮은 답변은 검수 큐에 적재한다. 대시보드에는 검색 성공률, 근거 포함률, 무응답률, 보안 차단 건수를 함께 표시한다."
  }
];

export const starterQuestions = [
  "VPN 접속 실패가 반복될 때 상담원이 먼저 확인할 것은?",
  "GenAI 파일럿 KPI는 어떤 축으로 관리해야 해?",
  "고객 환불 요청을 처리할 때 필요한 정보와 SLA를 알려줘",
  "보안 정책상 생성형 AI에 입력하면 안 되는 정보는?",
  "배송 지연 고객에게 보낼 답변 초안을 만들어줘"
];
