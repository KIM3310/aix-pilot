# Cloud + AI Architecture Blueprint: aix-pilot

This blueprint is a neutral technical operating model for AIX Pilot. It describes the cloud architecture surface, AI engineering controls, and validation path without making external production or certification claims.

## Operating Model

- **Domain:** enterprise GenAI pilot operations
- **Current proof surface:** Browser-first React/Vite console with local RAG fixtures, agent draft generation, DLP masking, KPI dashboards, evaluation tests, and Cloudflare Pages deployment path.
- **Status:** active
- **Primary stack:** React, Vite, TypeScript, Vitest, Cloudflare Pages, Cloudflare Functions
- **Architecture axes:** cloud architecture, AI engineering, governance, evaluation, security, operator experience

## Cloud Architecture

Operating model: static-first enterprise pilot console with optional Cloudflare runtime edges for API adapters, workspace state, and controlled service expansion.

### Deployment and control patterns

- Static frontend deployment with runtime adapters isolated behind Cloudflare Functions.
- Local deterministic fallback for demo data, RAG retrieval, agent drafts, DLP masking, and reporting.
- Manual Cloudflare Pages deployment workflow that re-runs QA before publishing.

### Landing-zone controls

- identity boundary and least-privilege service access
- environment separation for local, preview, and managed deployment paths
- secret storage outside source and deterministic fallback for missing credentials
- audit-friendly workspace events for user actions, generated drafts, and report exports
- rollback path through static build artifacts and GitHub Actions deployment history

### Reliability controls

- deterministic QA command covering typecheck, tests, and production build
- model-free fallback paths for demo operation when external providers are unavailable
- explicit service-readiness scoring before pilot claims are trusted
- bounded browser-local state with reset and report export controls

## AI Engineering

Operating model: retrieval-backed knowledge answers, agent drafts, safety checks, evaluation scorecards, and revenue-readiness signals that stay inspectable without external credentials.

### Engineering patterns

- Keep source documents, retrieval scores, owners, recency, and answer evidence visible beside generated output.
- Separate deterministic DLP/security checks from agent draft text so the system remains testable.
- Treat generated emails, reports, and automation drafts as human-reviewed artifacts.
- Preserve evaluation fixtures and golden questions as CI-safe regression gates.
- Keep ROI and revenue signals tied to explicit assumptions instead of hidden model output.

### Evaluation controls

- Vitest coverage for RAG ranking, agent drafting, DLP masking, revenue calculations, and service-readiness scoring.
- Golden question fixtures for retrieval quality and citation behavior.
- Content and build checks in `npm run qa` before deploy.
- Production dependency audit in GitHub Actions.

### Model risk controls

- stale knowledge source metadata
- unsafe automation without approval
- private data leakage in reports or screenshots
- overconfident ROI or adoption claims
- external provider outage or quota exhaustion

## Architecture Map

| Layer | What must be explicit | Evidence to keep current |
| --- | --- | --- |
| Runtime | frontend entrypoint, Cloudflare Functions, local fallback | QA workflow, build output, runtime docs |
| Data | sample documents, owner metadata, recency, workspace state | fixtures, reset flow, report output |
| AI | retrieval, agent drafts, DLP, evaluation | golden questions, Vitest suites, scorecards |
| Cloud | Pages deployment, secrets, preview boundaries | workflow logs, `wrangler.toml`, deployment notes |
| Operations | pilot readiness, KPI assumptions, governance handoff | service model, revenue model, docs/ADR |

## Research Grounding

The repository is aligned with these research directions as design references, not as claims of equivalence:

- [Hidden Technical Debt in Machine Learning Systems](https://papers.nips.cc/paper_files/paper/2015/hash/86df7dcfd896fcaf2674f757a2463eba-Abstract.html)
- [Guidelines for Human-AI Interaction](https://doi.org/10.1145/3290605.3300233)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)

## Validation

Run the repository-local architecture guard:

```bash
python3 scripts/validate_architecture_blueprint.py
```

The CI workflow `.github/workflows/architecture-blueprint.yml` runs the same check when the blueprint, validation script, or workflow changes.

## Extension Backlog

- Keep Cloudflare Functions documented when API adapters change.
- Add new evaluation fixtures before expanding agent draft behavior.
- Keep revenue assumptions and ROI calculations bounded by explicit input data.
- Update deployment notes whenever Pages, D1, Workers AI, or local fallback behavior changes.
