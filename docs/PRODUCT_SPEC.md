# AIX Pilot Product Spec

## 1. 제품 정의

AIX Pilot은 기업이 GenAI를 실제 업무에 도입하기 전에 무료 기준으로 RAG, Agent, 보안, KPI를 함께 검증하는 파일럿 운영 플랫폼입니다. 목표는 단순 챗봇 시연이 아니라 운영자가 도입 여부를 판단할 수 있는 근거, 승인 흐름, 보안 증적, KPI, 비용 경로를 한 번에 제시하는 것입니다.

## 2. 대상 사용자

- AI PMO: 파일럿 범위, KPI, Go/No-Go 기준 관리
- 고객센터/IT/영업 운영자: 업무 질문, 응답 초안, 보고서 초안 생성
- 보안/컴플라이언스 담당자: DLP, RBAC, 감사 로그, 승인 게이트 검토
- 인프라 담당자: 무료 PoC에서 운영 스택으로의 전환 경로 검토

## 3. 핵심 스펙

| 영역 | 파일럿 스펙 | 운영 전환 기준 |
|---|---|---|
| RAG | 로컬 문서 청크화, 검색, 중복 근거 제거, Citation 표시 | 권한 필터, hybrid search, reranker, 평가셋 |
| Agent | FAQ, 이메일, 보고서, 자동화 초안과 승인 단계 | 워크플로우 엔진, 승인자 라우팅, 실패 재시도 |
| Security | 전화번호, 이메일, 주민번호 패턴, 민감 키워드 탐지/마스킹 | OPA, Presidio, SIEM/DLP 연동 |
| Audit | 질의, 시나리오, 문서 색인, 리포트 다운로드 이력 | 불변 로그, 보관 정책, 감사 리포팅 |
| Service Trust | 운영 준비도 점수, launch blocker, trust control, SLO, maturity track | 운영 소유자, SLO, incident runbook, 릴리스 게이트 |
| Value Readiness | 회수 시간, 승인 단계, 서비스 패키지, regulated contact center 타깃, 리소스 확장 경로 | CRM, 결제, 사용량 미터링, BPO/OEM 채널 |
| KPI | RAG 성공률, 자동화율, 보안 차단, 회수 시간 | BI 데이터마트, SLA, 부서별 운영 지표 |
| Evaluation | 골든 질문셋으로 검색 정확도, Citation 포함률, 안전성 검증 | 오프라인 평가 파이프라인, SME 라벨링, 릴리스 게이트 |
| Deployment | Vite 정적 배포와 로컬 실행 | SSO/RBAC, 백업, 관측, 승인 워크플로우 |

## 4. 인수 기준

- RAG 답변은 근거 문서명, 출처, 소유자, 최신일, 점수를 표시해야 합니다.
- 동일 문서의 여러 청크가 검색되어도 Citation은 문서 기준으로 중복 제거되어야 합니다.
- Agent 초안과 리포트 다운로드 내용에는 원문 전화번호, 이메일, 주민번호 패턴이 남지 않아야 합니다.
- 외부 발송, 환불, 권한 변경, 보안 예외는 휴먼 승인 대상으로 표시되어야 합니다.
- 운영 준비도는 Evaluation, Security, Spec, Approval, Knowledge depth를 반영하고 고위험 탐지 시 launch blocker를 표시해야 합니다.
- Value Readiness 화면은 회수 시간, 승인 단계, 권장 서비스 범위, 확장 리소스, 검토자별 반론 처리를 보여야 합니다.
- 골든 질문셋은 검색 정확도, 근거 포함, DLP 안전성, 평균 신뢰도를 점수화해야 합니다.
- 데스크톱과 모바일에서 가로 오버플로우 없이 주요 대시보드가 렌더링되어야 합니다.
- `npm run qa`는 TypeScript, Vitest, production build를 모두 통과해야 합니다.

## 5. 평가 계획

| 게이트 | 지표 | 통과 기준 | 증적 |
|---|---|---|---|
| Grounded Answer | 근거 포함률 | 90% 이상 | RAG Citation UI, rag.test.ts |
| DLP Masking | 원문 PII 미노출 | 100% | security.test.ts, report.test.ts |
| Golden Eval | 검색/근거/안전 회귀 | Overall 85+ | Evaluation Lab, evaluation.test.ts |
| Agent Approval | 고위험 작업 승인 | 100% | Agent Studio approval badge |
| Service Readiness | 운영 전환 준비도 | Launch Ready or blocker 표시 | Service Trust Model, serviceReadiness.test.ts |
| Value Fit | 서비스 전환 가능성 | 약한 케이스는 보류, 강한 케이스는 운영 준비 | Value Readiness, valueModel.test.ts |
| UX Stability | 콘솔 에러/오버플로우 | 0건 | Browser QA screenshots |

## 6. 무료 기준 운영 경로

1. 로컬 또는 정적 호스팅으로 UI를 배포합니다.
2. 사내 문서 샘플을 정리하고 소유자, 최신일, 민감도, 업무 태그를 표준화합니다.
3. 로컬 검색을 Qdrant 또는 Chroma로 교체합니다.
4. Ollama 또는 사내 승인 LLM 게이트웨이를 연결합니다.
5. DLP, RBAC, 감사 로그, 휴먼 승인 정책을 먼저 고정합니다.
6. 6주 파일럿 후 KPI와 보안 게이트를 기준으로 Go/No-Go를 결정합니다.

## 7. 현재 검증 상태

- TypeScript 검사 통과
- Vitest 자동 테스트 통과
- Production build 통과
- 데스크톱/모바일 Browser QA 통과
- Golden Evaluation Suite 통과
- Service Trust Model 무결성 테스트 통과
- Value Readiness/서비스 범위/문화 도입 모델 테스트 통과
- 개인정보 마스킹 리포트 테스트 통과
