# Ad-Supported Resource and Aggregate Data Architecture

Repository: `aix-pilot`

## Public Resource Model

Free enterprise GenAI readiness scorecard for RAG, agent, DLP, eval, and KPI controls.

- Audience: enterprise AI leaders and platform teams
- Central resource: https://kim3310-doeon-kim-portfolio.pages.dev/resources/aix-pilot/
- Live system: https://aix-pilot.pages.dev/
- Advertising boundary: ads allowed only on public GenAI readiness resources; console, RAG, DLP, eval, KPI, and dashboard flows are ad-free
- Current ad state: code-ready on the central resource; serving depends on Google AdSense site approval and consent policy.

## Readiness Utility

The central resource turns the repository architecture into a practical review checklist:

- **Architecture Summary:** Browser-first GenAI pilot console with local RAG fixtures, agent drafts, DLP masking, KPI dashboards, evaluation tests, and Cloudflare deployment path.
- **Runtime And Data Flow:** Primary domain: enterprise GenAI pilot operations.
- **Cloud Or Local Deployment Boundary:** Operating model: static-first enterprise pilot console with optional Cloudflare runtime edges for API adapters, workspace state, and controlled service expansion
- **Deployment patterns:** Static frontend with runtime adapters isolated behind Cloudflare Functions Manual Cloudflare Pages deployment workflow that re-runs QA before publishing Local deterministic fallback for RAG, agent draft, DLP, KPI, and report demos
- **Control boundaries:** identity boundary and least-privilege service access environment separation for local, preview, and managed deployment paths secret storage outside source and deterministic fallback for missing credentials audit-friendly workspace events for generated drafts and report exports...

The checklist state remains in the visitor's browser and is not transmitted.

## Aggregate Data Boundary

- Data asset: anonymous aggregate enterprise AI readiness topic interest and scorecard-open counts
- Sensitivity class: high-trust-b2b
- Allowed events: `resource_view`, `resource_cta_click`, `architecture_doc_open`, `privacy_support_open`
- Prohibited fields: `raw_input`, `prompt`, `url`, `referrer`, `title`, `user_id`, `session_id`, `ip_address`, `payment_detail`
- Consent defaults to off.
- DNT and Global Privacy Control fail closed.
- Events are reduced to repository, allowlisted event, public surface, and consent-policy version.
- Personal, sensitive, raw, event-level, or re-identifiable data is never offered for sale.

## Storage Path

```text
Public resource
  -> consent and privacy-signal gate
  -> Cloudflare Pages event API
  -> rate-limited daily aggregate counter
  -> public benchmark response
```

Cloudflare D1 holds aggregate counters and expiring abuse-control counters. Private inquiries remain isolated from telemetry.
