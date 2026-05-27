export type RiskFinding = {
  type: string;
  severity: "낮음" | "중간" | "높음";
  message: string;
  match?: string;
};

const patterns = [
  {
    type: "휴대전화",
    severity: "중간" as const,
    regex: /01[016789]-?\d{3,4}-?\d{4}/g,
    message: "전화번호가 포함되어 있습니다. 외부 발송 전 마스킹을 권장합니다."
  },
  {
    type: "이메일",
    severity: "낮음" as const,
    regex: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi,
    message: "이메일 주소가 포함되어 있습니다."
  },
  {
    type: "주민등록번호 패턴",
    severity: "높음" as const,
    regex: /\d{6}-?[1-4]\d{6}/g,
    message: "주민등록번호로 보이는 값이 포함되어 있어 답변 생성을 차단해야 합니다."
  },
  {
    type: "계좌번호 키워드",
    severity: "높음" as const,
    regex: /(계좌번호|입금계좌|보안취약점|비밀번호|access token|secret key)/gi,
    message: "민감 키워드가 감지되었습니다. 보안 정책 검토가 필요합니다."
  }
];

export function scanRisk(text: string): RiskFinding[] {
  return patterns.flatMap((pattern) => {
    const matches = Array.from(text.matchAll(pattern.regex)).slice(0, 3);
    return matches.map((match) => ({
      type: pattern.type,
      severity: pattern.severity,
      message: pattern.message,
      match: match[0]
    }));
  });
}

export function maskSensitive(text: string) {
  return text
    .replace(/01([016789])-?(\d{3,4})-?(\d{4})/g, "01$1-****-$3")
    .replace(/[a-z0-9._%+-]+@([a-z0-9.-]+\.[a-z]{2,})/gi, "***@$1")
    .replace(/\d{6}-?[1-4]\d{6}/g, "******-*******");
}

export const securityControls = [
  { name: "SSO/RBAC", status: "설계 완료", detail: "역할별 문서 접근 필터와 감사 로그를 기본 정책으로 구성" },
  { name: "DLP Guard", status: "동작 중", detail: "전화번호, 이메일, 주민등록번호, 민감 키워드 탐지" },
  { name: "Human Approval", status: "동작 중", detail: "외부 발송, 환불 승인, 권한 변경은 승인 단계 필요" },
  { name: "Retention", status: "정책화", detail: "프롬프트와 답변 로그 1년 보관, 민감정보 마스킹" }
];
