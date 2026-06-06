# AIX Pilot

[![QA](https://github.com/KIM3310/aix-pilot/actions/workflows/qa.yml/badge.svg)](https://github.com/KIM3310/aix-pilot/actions/workflows/qa.yml)

기업용 GenAI 도입을 위한 무료 기준 RAG, Agent, 보안, KPI 대시보드 통합 플랫폼 프로토타입입니다.

## Product and Review Surface

AIX Pilot is a free-first enterprise GenAI pilot console that can become a governed implementation, secure knowledge onboarding, and monthly operating support service after buyer-specific validation.

| Lens | Definition |
|---|---|
| Buyer or user | Customer-center leaders, internal knowledge owners, IT governance teams, and AI adoption leads. |
| Commercial route | Start with a free proof-of-value demo, then sell implementation setup, secure knowledge onboarding, evaluation tuning, and monthly KPI reporting. |
| Review signal | RAG, Agent drafts, DLP masking, evaluation lab, KPI dashboard, value readiness model, presentation pack, and Cloudflare-ready deployment. |
| Safety boundary | Demo data is local and controlled; paid deployments should use approved customer storage, access control, audit logs, and model routing. |
| Fast proof | `npm run verify` runs TypeScript checks, tests, production build, and content verification. |

## Reviewer Fast Path

- **First minute:** Open the value readiness model, service trust model, and evaluation lab before reading implementation details.
- **Local demo:** Run `npm install && npm run dev`, then open `http://localhost:5173`.
- **Verification:** Run `npm run verify`; it covers TypeScript, tests, production build, and content verification.
- **Commercial read:** Sell the pilot as a free proof-of-value that upgrades into knowledge onboarding, governance, and monthly KPI reporting.

## Service Launch Playbook

- [Service launch playbook](docs/service-launch-playbook.md) maps the repository to buyer segments, offer ladder, proof gates, proof gates, and risk boundaries.

## Review Notes

- [Review guide](docs/reviewer-evidence-map.md) summarizes the project angle, first files to inspect, verification commands, and known boundaries.
- [Quality notes](docs/quality-gate.md) lists the local checks, CI surface, and release expectations for this repository.
- [Service growth model](docs/service-growth-model.md) maps the project to an ethical service path, activation loop, scope logic, and growth experiments.
- [Enterprise readiness notes](docs/enterprise-readiness.md) outlines security, data, operations, integration, and handoff expectations.
- [Conversion UX model](docs/conversion-ux-model.md) maps the buyer path, behavioral design, UI/UX direction, service scope frame, and ethical conversion guardrails.
- [Commercial offer](docs/commercial-offer.md) packages the repository into a buyer-ready offer ladder, proof gate, outreach angle, and close path.
- [Cloud + AI architecture blueprint](docs/cloud-ai-architecture.md) records the deployment, runtime, AI evaluation, and risk-control surface.
- [Machine-readable architecture manifest](docs/architecture/blueprint.json) keeps the blueprint reviewable in CI.

## 핵심 기능

- 고객센터/사내 지식 문서를 로컬에서 청크화하고 검색하는 RAG 콘솔
- 근거 문서, 점수, 출처, 소유자, 최신성 표시
- FAQ 응답, 이메일 생성, 보고서 생성, 업무 자동화 Agent 초안
- 전화번호, 이메일, 주민등록번호 패턴, 민감 키워드 DLP 스캔
- RAG 성공률, 자동화율, 보안 차단, 부서별 도입률 KPI 대시보드
- 지식, 근거, 보안, 승인 준비도 보드
- Service Trust Model: 서비스 운영 준비도, 운영 전환 리스크, trust control, SLO, maturity track
- Value Readiness: 반복 업무 회수 시간, 규제 산업 고객센터 타깃, 승인자 지도, 운영 리소스, 구매자 심리/조직 문화별 도입 전략
- Evaluation Lab: 골든 질문셋 기반 검색 정확도, Citation 포함률, DLP 안전성 회귀 검증
- Enterprise Spec Pack: 요구사항 추적, 6주 도입 로드맵, 평가/보안 게이트, 무료 스택 의사결정
- 유료 API 없이 동작하는 브라우저 기반 데모
- 감사 로그, 로컬 저장, 개인정보 마스킹 리포트 다운로드, 데모 시나리오 실행/초기화
- 중복 근거 제거와 민감정보 마스킹을 포함한 데모 품질 보정
- RAG/Agent/Security/Evaluation 핵심 로직 자동 테스트

## 포트폴리오 임팩트

- 단순 챗봇이 아니라 RAG, Agent, 보안, 감사, KPI, 평가를 한 화면에서 운영하는 제품형 데모입니다.
- `public/brand`의 자체 제작 이미지와 GIF 모션 자산으로 저작권 리스크 없이 제품 첫인상을 제공합니다.
- `무료 기준 스택`에서 Ollama 로컬 LLM, Cloudflare Workers AI fallback, Cloudflare Pages, Cloudflare D1 저장 상태를 바로 확인할 수 있습니다.
- `Service Trust Model`은 보안 탐지, 승인 흐름, 평가 점수, 스펙 커버리지를 합산해 운영 전환 준비도를 계산합니다.
- `Value Readiness`는 반복 업무 회수 시간, 승인 단계, 권장 서비스 범위, 운영 리소스, 구매자 반론 처리를 연결해 공개 추정치 없이 서비스 전환 가능성을 보여줍니다.
- `Evaluation Lab`과 `evaluation.test.ts`로 AI 기능을 골든 질문셋 기준으로 회귀 검증합니다.
- `docs/THREAT_MODEL.md`, `docs/ADR/`, `docs/PORTFOLIO_CASE_STUDY.md`까지 포함해 제품 판단, 보안 사고, 엔지니어링 의사결정을 같이 보여줍니다.
- `npm run verify` 하나로 TypeScript, 테스트, 빌드를 재현할 수 있어 CI에 바로 연결할 수 있습니다.
- GitHub Actions QA, Dependabot, 수동 Cloudflare Pages 배포 워크플로까지 포함해 공개 저장소에서도 유지보수 신뢰도를 확인할 수 있습니다.

## 무료 기준 스택

| 영역 | 기본 구현 | 확장 옵션 |
|---|---|---|
| UI | React, Vite, TypeScript | Next.js, Remix |
| RAG 검색 | 로컬 TF-IDF/BM25 유사 검색 | Qdrant, Chroma, LanceDB |
| LLM | Ollama `qwen2.5:1.5b` + Workers AI free allocation + 규칙 기반 fallback | 사내 승인 LLM gateway |
| Agent | Playbook 기반 오케스트레이션 | LangGraph, CrewAI, n8n |
| 보안 | DLP 패턴 탐지, 마스킹, 승인 플래그 | OPA, Keycloak, Authentik |
| 평가 | Golden set + Vitest | Promptfoo, Ragas, LangSmith |
| 운영 준비도 | Service readiness scoring | SLO, incident runbook, SIEM |
| 서비스 런칭 | Value readiness + service packages | CRM, billing, usage metering |
| KPI | Recharts | Metabase, Superset |
| 배포 | Cloudflare Pages free tier | WAF, custom domain, SSO |
| DB | Cloudflare D1 + localStorage fallback | Governed Postgres/D1 |

## 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속합니다.

## 빌드

```bash
npm run build
```

## 전체 QA

```bash
npm run verify
```

`qa`는 TypeScript 검사, Vitest 자동 테스트, 프로덕션 빌드를 순서대로 실행합니다.
GitHub Actions에서도 모든 push와 pull request마다 같은 검증을 실행합니다.

## 운영 품질 게이트

- `QA` workflow: TypeScript, 30개 Vitest 테스트, 프로덕션 빌드, production dependency audit
- `Repository Surface` workflow: README, local docs, architecture blueprint, and neutral positioning guard
- `Architecture Blueprint` workflow: machine-readable cloud/AI architecture manifest validation
- `scripts/validate_architecture_blueprint.py`: local architecture manifest guard used by CI
- `Cloudflare Pages` workflow: 릴리스 후보를 다시 검증한 뒤 `dist/`를 Cloudflare Pages에 수동 배포
- `Dependabot`: npm 패키지와 GitHub Actions 버전을 주 1회 점검
- 배포 전 로컬 명령: `npm run verify && npm audit --omit=dev`

## 파일 구조

```text
src/
  App.tsx                # 대시보드 UI와 상호작용
  data/
    businessModel.ts     # 서비스 패키지, 구매자 심리, 문화 도입, 검증 실험 데이터
    sampleDocs.ts        # 고객센터/사내지식 샘플 문서
    metrics.ts           # KPI와 운영 이벤트 샘플 데이터
    enterpriseSpec.ts    # 요구사항/로드맵/평가/보안 게이트 스펙 데이터
    serviceModel.ts      # 서비스 운영 모델, trust control, SLO, maturity 데이터
  lib/
    rag.ts               # 로컬 문서 청크화, 검색, 근거 답변 생성
    rag.test.ts          # RAG 랭킹과 fallback 테스트
    agent.ts             # Agent 초안 생성과 승인 단계
    agent.test.ts        # Agent 플레이북 테스트
    report.ts            # Markdown 파일럿 리포트 생성과 마스킹
    report.test.ts       # 리포트 개인정보 미노출 테스트
    valueModel.ts        # 회수 시간, 승인 단계, 운영 전환 신호 계산
    valueModel.test.ts   # 가치 검증 모델과 과장 포지셔닝 방지 테스트
    evaluation.ts        # 골든 질문셋 기반 RAG/보안 평가
    evaluation.test.ts   # 평가 점수와 DLP 회귀 테스트
    serviceReadiness.ts  # 운영 준비도 계산과 서비스 모델 무결성 검증
    serviceReadiness.test.ts # 운영 준비도와 trust model 테스트
    spec.ts              # 스펙팩 완성도와 ID 무결성 검증
    spec.test.ts         # 스펙팩 요구사항/게이트 테스트
    security.ts          # DLP 탐지와 마스킹
    security.test.ts     # DLP 탐지/마스킹 테스트
  styles.css             # 반응형 엔터프라이즈 UI
public/
  brand/
    aix-hero-generated.png  # 저작권 안전 제품 비주얼 백업 자산
    aix-hero-generated.webp # 브라우저용 최적화 백업 이미지
    aix-hero-4k.png         # 로컬 제작 4K 비주얼
    aix-motion.gif          # 로컬 제작 운영 흐름 GIF
```

## 데모 시나리오

상단 `실행` 버튼은 배송 지연 고객 응대 시나리오를 실행합니다. 전화번호가 포함된 요청을 넣어 RAG 답변, 이메일 Agent 초안, DLP 마스킹, 감사 로그가 함께 움직이는 것을 확인할 수 있습니다.

`리포트` 버튼은 현재 질의, 답변, 근거 문서, 보안 탐지, 파일럿 상태를 Markdown 리포트로 다운로드합니다.
리포트에는 감지된 전화번호, 이메일, 주민등록번호 패턴이 마스킹된 값으로 기록됩니다.

`초기화` 버튼은 업로드 문서와 감사 로그를 초기 샘플 상태로 되돌립니다.

## 실제 기업 파일럿으로 확장하는 순서

1. 사내 문서 원천을 정리합니다: Google Drive, Confluence, SharePoint, Notion, Zendesk, GitHub Wiki.
2. 문서 메타데이터를 통일합니다: 소유자, 최신일, 민감도, 접근 권한, 업무 태그.
3. 로컬 검색을 Qdrant 또는 Chroma로 교체합니다.
4. Ollama 같은 로컬 LLM을 연결하고 근거 없는 답변은 차단합니다.
5. SSO/RBAC, DLP, 감사 로그를 먼저 붙이고 외부 발송 Agent는 휴먼 승인으로 제한합니다.
6. 파일럿 KPI를 정합니다: 검색 성공률, 근거 포함률, 상담 처리 시간, 자동화 완료율, 보안 차단 건수.

상세 제품 스펙은 [docs/PRODUCT_SPEC.md](docs/PRODUCT_SPEC.md)에 정리되어 있습니다.
서비스 운영 모델은 [docs/SERVICE_OPERATING_MODEL.md](docs/SERVICE_OPERATING_MODEL.md), 서비스 런칭 전략은 [docs/SERVICE_LAUNCH_STRATEGY.md](docs/SERVICE_LAUNCH_STRATEGY.md), 기술 리뷰용 케이스 스터디는 [docs/PORTFOLIO_CASE_STUDY.md](docs/PORTFOLIO_CASE_STUDY.md), 위협 모델은 [docs/THREAT_MODEL.md](docs/THREAT_MODEL.md), 주요 의사결정은 [docs/ADR](docs/ADR)에 정리되어 있습니다.
클라우드와 AI 운영 경계는 [docs/cloud-ai-architecture.md](docs/cloud-ai-architecture.md)와 [docs/architecture/blueprint.json](docs/architecture/blueprint.json)에 정리되어 있습니다.

## 무료 배포 옵션

- 로컬 데모: Vite dev server
- 정적 배포: GitHub Pages, Cloudflare Pages, Netlify free tier
- 사내 PoC: Docker + Nginx, 또는 사내 VM
- 로컬 LLM 확장: Ollama 서버를 같은 네트워크에 두고 API 프록시로 연결

이 프로젝트는 무료 기준의 설득력 있는 파일럿 데모를 목표로 합니다. 실제 개인정보나 고객 데이터를 넣기 전에는 반드시 접근 권한, 로그 보관, DLP 정책을 먼저 확정하세요.

## Enterprise Productization

- [Product operating model](docs/product-operating-model.md) defines the buyer, paid wedge, trust boundary, operating checks, and service path for this repository.

## Service Architecture

- [Service architecture](docs/service-architecture.md) defines the cloud resources, account information, cost controls, and production guardrails needed to turn this repo into a scoped service without publishing public financial assumptions.
