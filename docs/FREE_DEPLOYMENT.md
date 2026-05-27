# Free Deployment Guide

## 1. 무료 LLM: Ollama

```bash
mkdir -p ~/.local/aix-pilot-tools ~/.local/bin
curl -L https://ollama.com/download/Ollama-darwin.zip -o /tmp/Ollama-darwin.zip
unzip -q /tmp/Ollama-darwin.zip -d ~/.local/aix-pilot-tools
ln -sf ~/.local/aix-pilot-tools/Ollama.app/Contents/Resources/ollama ~/.local/bin/ollama
open ~/.local/aix-pilot-tools/Ollama.app --args hidden
ollama pull qwen2.5:1.5b
```

앱의 `무료 기준 스택` 섹션에서 endpoint는 `http://127.0.0.1:11434`, model은 `qwen2.5:1.5b`를 사용합니다. 연결되지 않아도 규칙 기반 RAG/Agent는 그대로 동작합니다.

배포된 HTTPS 사이트에서 브라우저가 로컬 Ollama 호출을 막는 환경을 위해 `/api/llm` Pages Function은 Cloudflare Workers AI binding `AI`를 fallback으로 사용합니다. Workers AI는 Free plan에서 일일 무료 할당량 안에서 사용할 수 있습니다.

## 2. 무료 배포: Cloudflare Pages

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

## 3. 무료 데이터베이스: Cloudflare D1

Cloudflare 로그인이 필요합니다.

```bash
npx --yes wrangler@4 login
npx --yes wrangler@4 d1 create aix-pilot-db
```

생성 결과에 나온 `[[d1_databases]]` 블록을 `wrangler.toml`에 추가하되 binding 이름은 `AIX_DB`로 둡니다.

```toml
[[d1_databases]]
binding = "AIX_DB"
database_name = "aix-pilot-db"
database_id = "<Cloudflare가 발급한 database_id>"
```

Pages Function `/api/workspace`는 D1 바인딩이 있으면 문서와 감사 로그를 저장하고, 바인딩이 없으면 앱이 브라우저 로컬 저장소 fallback으로 계속 동작합니다.

`wrangler.toml`에는 D1 binding `AIX_DB`와 Workers AI binding `AI`가 함께 들어갑니다.

## 4. 벡터DB 연결

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

## 5. 운영 전 체크리스트

- SSO/RBAC 설계
- DLP 정책
- 감사 로그 보관 기간
- 승인 대상 업무 정의
- 모델/검색 품질 평가셋
- CI에서 `npm run qa` 통과
- 파일럿 KPI와 종료 기준
