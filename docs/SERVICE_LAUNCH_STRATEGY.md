# AIX Pilot Service Launch Strategy

## Positioning

AIX Pilot is a compliance-safe AI Knowledge and Agent Ops layer for regulated contact centers. The public repository should show why the product is useful, what cloud resources are needed, what must be approved, and which operational risks remain. Workflow-specific assumptions belong in private planning artifacts, not in this repo.

## Highest-Probability Target

The first wedge should be large regulated contact centers:

- Card, insurance, brokerage, telecom, subscription commerce, and BPO contact centers.
- Teams with frequent policy/script changes, sensitive customer data, QA burden, and strict approval culture.
- Approval is shared across CX, AI PMO, CISO/compliance, and operations innovation.

This is a better target than generic SMB knowledge search because the pain is measurable, risk is expensive, and the implementation path can be clearly governed.

## Public Service Packages

| Package | Reviewer-facing scope | Required resources | Activation gate |
|---|---|---|---|
| Diagnostic | One workflow, one knowledge source, read-only pilot | Cloudflare Pages, local fixtures, Ollama or approved LLM gateway | Document owner, security owner, and operations owner agree on Go/No-Go criteria |
| Operations | Department rollout with approval routing and QA review | Cloudflare D1 or managed Postgres, vector database, audit log storage, Sentry | Shared release checklist approved by operations and security |
| Enterprise | SSO/RBAC, SIEM/DLP, long-term audit retention, release gates | Managed Postgres, private model gateway, SSO, SIEM/DLP, backup storage | CISO, AI PMO, and operations leadership approve production boundaries |

## Value Readiness Model

The strongest buying trigger is not model novelty. It is the moment an operator sees that repeated work, security review, and answer quality can be governed.

| Value lever | Reviewer language | Proof in product |
|---|---|---|
| Time recovery | "We are searching and rewriting the same answers." | Value Readiness controls |
| Risk reduction | "AI adoption cannot leak PII or bypass approval." | Trust controls and DLP tests |
| Faster onboarding | "New staff need consistent answers faster." | RAG citations and Agent drafts |
| Governance | "Leadership needs a Go/No-Go basis." | Spec Pack, Evaluation Lab, SLOs |
| Expansion path | "Start small, then scale safely." | Service packages and maturity track |

## Cloud And Resource Sequence

1. Keep the public demo static-first on Cloudflare Pages.
2. Add Cloudflare D1 or managed Postgres only after workspace persistence is needed.
3. Add vector search when real knowledge sources exceed the local fixture path.
4. Add Sentry once preview and production environments are separated.
5. Add SSO/RBAC before any customer data or protected internal document source is connected.
6. Add SIEM/DLP integration only for Enterprise lanes with named security owners.

## Ethical Behavioral Design

| Principle | Use |
|---|---|
| Loss aversion | Show time and risk already being lost, without exaggerating fear or publishing financial claims. |
| Endowment effect | Let teams upload their own approved documents so the demo feels like their operating system. |
| Commitment device | Use a 6-week pilot with weekly KPI reviews and an explicit Go/No-Go gate. |
| Social proof | Use real department adoption and workflow success metrics, not fabricated testimonials. |

## Culture-Aware Selling

| Organization type | Service move |
|---|---|
| Hierarchical | Secure an executive sponsor and team lead approval path first. |
| Regulated | Lead with DLP, audit, access boundaries, and launch blockers. |
| Speed-driven | Pick one repeated workflow and prove operational improvement inside two weeks. |
| Learning-oriented | Use golden questions and evaluation gates to compare experiments. |

## Launch Motion

1. Wedge: choose a workflow where repetition, regulation, and sensitive data overlap.
2. Champion: give center leadership recovery-time evidence, security DLP/Audit, and AI PMO Go/No-Go evidence.
3. Expand: clone the same knowledge pack to adjacent products, teams, and centers.
4. Retain: make QA/evaluation reports part of the operating meeting.

## Guardrails

- Do not present automation as headcount replacement.
- Do not publish public financial forecasts, customer contract values, or public scope assumptions.
- Do not use fake scarcity, fake testimonials, or hidden lock-in.
- Do not accept production customer data before access control, DLP, and audit policy are approved.
- Do not expand if the value readiness model returns a weak case; narrow the workflow first.

## Portfolio Signal

This makes the project read as a service-ready system: product value, operating risk, reviewer psychology, cultural adoption, cloud resources, and validation experiments are all connected to code and tests without exposing private financial assumptions.
