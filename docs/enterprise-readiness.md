# Enterprise Readiness Notes - AIX Pilot

Updated: 2026-05-30

This note defines what an enterprise technical reader, public-sector operator, serious user, or technical evaluator can safely infer from this repository today. It is intentionally conservative: public proof is separated from production claims.

## Scope

| Field | Notes |
|---|---|
| Repository | `aix-pilot` |
| Lane | B2B enterprise GenAI adoption platform |
| Primary reader | Customer support, internal knowledge, IT governance, and AI adoption leaders. |
| Core wedge | Free-first RAG/Agent/security/KPI pilot that converts into governed implementation and operating support after validation. |
| Stack | TypeScript/JavaScript, Cloudflare |
| Readiness posture | Pilot-ready technical surface; production use requires customer-specific identity, monitoring, data, and support controls. |

## Enterprise Controls

| Control | Current expectation |
|---|---|
| Data boundary | Public artifacts should use demo, fixture, or synthetic data until the technical reader approves data handling, retention, and access controls. |
| Identity and access | Production pilots should add SSO/OIDC, RBAC, scoped service accounts, secret rotation, and admin-visible access architectures. |
| Auditability | Keep decision logs, generated reports, CI results, eval outputs, and operator handoff artifacts inspectable. |
| Observability | Track health checks, latency, error budget, cost, eval pass rate, audit-log completeness, and handoff/report generation status. |
| Release gate | Full local gate: npm run qa; Test suite: npm test; Lint: npm run lint; Production build: npm run build |
| Support handoff | Name the owner, escalation path, rollback path, known limits, and architecture cadence before a production testing. |

## Verification Surface

| Purpose | Command |
|---|---|
| Full local gate | `npm run qa` |
| Test suite | `npm test` |
| Lint | `npm run lint` |
| Production build | `npm run build` |

## CI Surface

- .github/workflows/cloudflare-pages.yml
- .github/workflows/qa.yml

## Acceptance Criteria

- npm run qa can be run or the equivalent CI gate is visible.
- README, architecture guide, quality notes, service model, and this readiness note agree on the same scope.
- Demo, fixture, synthetic, or public-data boundaries are explicit before a technical reader sees outputs.
- A technical reader can identify the first useful outcome without reading implementation details.
- Production claims stay behind customer-specific validation, access control, monitoring, and support handoff.

## Integration Path

- Run a synthetic-data walkthrough with the technical reader and document the acceptance criteria.
- Scope a controlled pilot using approved data, named users, secrets, and rollback paths.
- Convert the pilot into an operating handoff with monitoring, architecture cadence, support owner, and renewal metric.

## Proof Points

- npm run qa passes
- Live Cloudflare demo works
- Evaluation lab and DLP posture visible

## Operating Metrics

- Deflection rate
- Citation coverage
- Time saved per ticket

## Open Risks

- Customer data needs approved storage
- AI drafts require architecture
- No unsupported automation claims

## Finish Line

- Keep the public repository honest, runnable, and easy to architecture.
- Keep sensitive data, secrets, private tenant details, and unsupported claims out of public artifacts.
- Treat this repository as a proof surface until an approved pilot defines users, data, access, monitoring, support, and success metrics.
