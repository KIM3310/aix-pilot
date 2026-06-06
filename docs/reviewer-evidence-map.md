# Review Guide - AIX Pilot

Updated: 2026-05-30

Use this page as the short path through the repository. It keeps the review grounded in the code, docs, commands, and boundaries that are already present.

## Summary

| Field | Notes |
|---|---|
| Lane | B2B enterprise GenAI adoption platform |
| Core idea | Free-first RAG/Agent/security/KPI pilot that converts into governed implementation and operating support after validation. |
| Primary reader | Customer support, internal knowledge, IT governance, and AI adoption leaders. |
| Stack | TypeScript/JavaScript, Cloudflare |

## Open First

1. Start with the README fast path and architecture section.
2. Open `docs/service-launch-playbook.md` only when reviewing the product or service angle.
3. Check the commands below before making claims about quality.
4. Skim the CI workflows and fixture data before deeper implementation review.
5. Read the boundaries section before presenting the project externally.

## Checks

| Purpose | Command |
|---|---|
| Full local gate | `npm run qa` |
| Test suite | `npm test` |
| Lint | `npm run lint` |
| Production build | `npm run build` |

## CI

- .github/workflows/cloudflare-pages.yml
- .github/workflows/qa.yml

## Evidence

- package scripts and web/runtime checks
- edge deployment configuration
- npm run qa passes
- Live Cloudflare demo works
- Evaluation lab and DLP posture visible

## Service Notes

| Possible offer | Working scope assumption |
|---|---|
| Free proof-of-value demo | Synthetic-data walkthrough |
| Secure knowledge onboarding setup | Buyer-approved implementation diagnostic |
| Monthly KPI and governance reporting | Operating support and review cadence |

## Boundaries

- Customer data needs approved storage
- AI drafts require review
- No unsupported automation claims

## Useful Metrics

- Deflection rate
- Citation coverage
- Time saved per ticket
