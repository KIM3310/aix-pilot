# AIX Pilot Service Operating Model

## Purpose

AIX Pilot is positioned as a free, local-first Enterprise GenAI pilot that can explain not only what the AI does, but also how it would be operated safely. The service model connects UX, RAG quality, Agent approval, DLP, auditability, SLOs, and launch readiness into one visible operating layer.

## Operating Pillars

| Pillar | Owner | Production Question |
|---|---|---|
| Executive UX | Product | Can a decision maker understand value, risk, and next action in minutes? |
| Retrieval Quality | AI Platform | Does every answer expose evidence, owner, recency, and confidence? |
| Agent Control | Business Ops | Are high-risk actions routed through human approval? |
| Security Governance | Security | Are PII, secrets, prompt injection, and policy bypass attempts detected? |
| Operating Evidence | AI PMO | Can quality, adoption, cost, and risk support a Go/No-Go decision? |
| Free Deployment Path | Infra | Can the pilot start with no paid API while showing a credible enterprise path? |

## Service Readiness Score

The readiness score is computed in `src/lib/serviceReadiness.ts`.

| Input | Weight |
|---|---:|
| Evaluation score | 26% |
| Security readiness | 22% |
| Spec coverage | 18% |
| Workspace readiness | 15% |
| Agent approval readiness | 10% |
| Knowledge depth | 9% |

High-risk security findings apply a launch penalty. This makes the UI behave like a real operating console: a beautiful demo can still be blocked by unsafe input.

## Trust Controls

| Control | Status | Launch Intent |
|---|---|---|
| Access Boundary | Designed | Enforce document-level roles before retrieval in production. |
| PII & Secret DLP | Active | Scan input, generated output, and report export. |
| Prompt Injection Guard | Active | Treat policy bypass and system prompt extraction attempts as high risk. |
| Human Approval | Active | Block automatic completion for customer send, refunds, permission changes, and security exceptions. |
| Tamper-Evident Audit | Production path | Move from local proof to server-side append-only logs. |
| Quality Release Gate | Active | Require evaluation and spec gates before launch. |

## SLO Baseline

| SLO | Pilot Target |
|---|---|
| Grounded answer rate | 90%+ |
| Raw PII exposure | 0 incidents |
| High-risk auto-send | 0 incidents |
| Audit completeness | 95%+ after backend handoff |

## Portfolio Signal

This layer is designed to show a hiring reviewer that the project is not just a chatbot UI. It demonstrates product judgment, security thinking, system design, release gating, and measurable service ownership.
