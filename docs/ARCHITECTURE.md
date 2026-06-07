# AIX Pilot Architecture

## 목표

AIX Pilot은 기업용 GenAI 도입 전 단계에서 무료 기준으로 PoC 가치를 검증하는 파일럿 워크스페이스입니다. 핵심은 “그럴듯한 챗봇”이 아니라 운영자가 확인해야 하는 RAG 근거, Agent 승인 흐름, 보안 탐지, KPI를 한 화면에서 보여주는 것입니다.

## 현재 구현

```text
Browser
  React UI
    RAG Console
    Agent Studio
    Security Guard
    Service Trust Model
    Value Readiness
    KPI Dashboard
    Evaluation Lab
    Readiness Board
    Enterprise Spec Pack
    Audit Trail

Local Runtime
  sampleDocs.ts
  rag.ts
    tokenize
    chunkDocuments
    searchKnowledge
    generateRagAnswer
    unique citation selection
  agent.ts
    runAgent
  security.ts
    scanRisk
    maskSensitive
  report.ts
    buildPilotReport
  evaluation.ts
    runEvaluationSuite
    evaluateGoldenCase
  serviceReadiness.ts
    calculateServiceReadiness
    validateServiceOperatingModel
  valueModel.ts
    calculateValueReadiness
    validateBusinessModel
  spec.ts
    validateSpecPack
    specCoverageScore
  data/evaluation.ts
    golden evaluation cases
  serviceModel.ts
    service pillars
    trust controls
    SLOs
  businessModel.ts
    service packages
    reviewer personas
    behavioral levers
    cultural adoption patterns
  enterpriseSpec.ts
    requirements
    rollout phases
    evaluation gates
    security gates
```

## 무료 확장 경로

| 현재 | 파일럿 확장 | 운영 확장 |
|---|---|---|
| Local TF-IDF | Qdrant/Chroma | Hybrid search + reranker |
| 규칙 기반 답변 | Ollama local LLM | 사내 승인 LLM gateway |
| localStorage | SQLite/Postgres | 데이터 거버넌스 저장소 |
| 패턴 DLP | Presidio/OPA | SIEM/DLP 연동 |
| 골든 질문셋 | Promptfoo/Ragas | CI release gate + SME review |
| 브라우저 감사 로그 | 서버 감사 로그 | 장기 보관/감사 리포팅 |

## 보안 원칙

- 문서 검색은 사용자 권한으로 필터링해야 합니다.
- 민감정보는 답변 생성 전후 모두 스캔해야 합니다.
- 다운로드 리포트와 Agent 출력에는 원문 식별값을 남기지 않습니다.
- 외부 발송, 환불, 권한 변경, 보안 예외는 휴먼 승인 대상입니다.
- 프롬프트, 근거 문서, Agent 단계, 승인자를 감사 로그에 남깁니다.
- 근거가 부족하면 답을 지어내지 않고 문서 추가 또는 재질문을 유도합니다.

## KPI

- RAG: 검색 성공률, 근거 포함률, 무응답률, 재질문율
- Agent: 자동화 완료율, 승인 대기율, 실패 사유, 처리 시간
- 보안: DLP 차단, 권한 위반 시도, 민감 문서 접근
- 비용: 업무 1건당 비용, 절감 시간, 무료/유료 전환 기준
- 평가: 검색 정확도, Citation 포함률, 안전 통과율, 평균 신뢰도

## Service Trust Model

`src/data/serviceModel.ts` and `src/lib/serviceReadiness.ts` add an operating layer above the demo features. The readiness score combines Evaluation Lab score, security readiness, Spec Pack coverage, workspace readiness, Agent approval readiness, and knowledge depth. High-risk security findings apply a launch penalty, so the product can communicate a realistic Go/No-Go posture instead of treating every demo state as safe.

The Trust section also lists controls, SLOs, launch blockers, and maturity stages. This is intentionally separate from the RAG and Agent code so the project reads like a service with owners, evidence, and release gates.

## Value Readiness

`src/data/businessModel.ts` and `src/lib/valueModel.ts` add a service launch layer above the product. The Value Readiness model calculates monthly recovered workflow time, weekly review load, recommended service scope, and operating transition signal. It also models reviewer personas, behavioral economics, culture-aware rollout patterns, resource-focused expansion paths, and measurable validation experiments.

The design intentionally avoids dark patterns. Weak adoption cases produce a "보류" signal and recommend narrowing the workflow before expanding scope.

## Spec Pack

- 요구사항 추적: 파일럿 구현, 운영 전환 경로, 오너, 증적을 한 행으로 연결합니다.
- 도입 로드맵: Discovery, Pilot Build, Business Trial, Go/No-Go 4단계로 구성합니다.
- 평가 게이트: Grounding, DLP, Agent Approval, UX Stability를 최소 통과 기준으로 둡니다.
- 보안 게이트: PII Redaction, Access Boundary, Audit Retention, Human In The Loop를 운영 전 필수 조건으로 둡니다.

## Evaluation Lab

- `src/data/evaluation.ts`는 업무별 골든 질문, 기대 문서, 인수 기준, DLP probe를 정의합니다.
- `src/lib/evaluation.ts`는 검색 Top 문서, Citation 포함, 안전 마스킹, 신뢰도를 점수화합니다.
- `src/lib/evaluation.test.ts`는 데모가 파일럿 수용 기준 아래로 떨어지는 회귀를 막습니다.
