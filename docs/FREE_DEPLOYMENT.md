# Free Deployment Guide

## 1. 정적 데모

```bash
npm run build
```

`dist/` 폴더를 GitHub Pages, Cloudflare Pages, Netlify free tier에 배포할 수 있습니다. 현재 앱은 API 키 없이 브라우저 안에서 동작합니다.

Cloudflare Pages 직접 배포:

```bash
npx --yes wrangler@4 pages deploy dist --project-name aix-pilot
```

`wrangler.toml`에는 Pages build output directory를 `dist`로 고정했습니다.

GitHub Actions에서 수동 배포하려면 저장소 Secrets에 아래 값을 넣고 `Cloudflare Pages` workflow를 실행합니다.

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

배포 workflow는 `npm run qa`를 먼저 통과한 뒤 Cloudflare Pages에 업로드합니다.

## 2. 로컬 LLM 연결

무료 로컬 LLM을 붙일 때는 Ollama를 가장 단순한 시작점으로 둡니다.

```bash
ollama pull llama3.1
ollama serve
```

운영 전에는 다음 정책을 먼저 넣어야 합니다.

- 프롬프트/응답 로그
- 민감정보 마스킹
- 근거 없는 답변 차단
- 휴먼 승인 대상 분리
- 골든 질문셋 기반 회귀 평가

## 3. 벡터DB 연결

무료 PoC에서는 Qdrant 또는 Chroma를 로컬 Docker로 띄우면 충분합니다.

```bash
docker run -p 6333:6333 qdrant/qdrant
```

문서 메타데이터 필드는 최소한 아래를 유지합니다.

- `doc_id`
- `title`
- `owner`
- `updated_at`
- `sensitivity`
- `allowed_roles`
- `source`

## 4. 운영 전 체크리스트

- SSO/RBAC 설계
- DLP 정책
- 감사 로그 보관 기간
- 승인 대상 업무 정의
- 모델/검색 품질 평가셋
- CI에서 `npm run qa` 통과
- 파일럿 KPI와 종료 기준
