# ADR 0004: Service Trust Model

## Status

Accepted

## Context

Enterprise GenAI pilots are often judged by a polished chatbot demo, but real adoption depends on whether the team can operate the system safely. The project already has RAG, Agent, DLP, KPI, Evaluation, and Spec Pack surfaces. It still needs a visible operating layer that answers: is this safe enough to expand, what blocks launch, who owns each control, and what evidence proves readiness?

## Decision

Add a Service Trust Model with:

- Service pillars for UX, retrieval quality, Agent control, security governance, operating evidence, and free deployment path.
- Trust controls for access boundaries, PII/secret DLP, prompt injection, human approval, audit, and release gates.
- SLO and maturity data for pilot-to-enterprise handoff.
- `calculateServiceReadiness` to combine evaluation, security, spec, workspace, approval, and knowledge depth into a launch score.
- High-risk security findings as readiness penalties and launch blockers.

## Consequences

- The UI now behaves more like an operating console than a static demo.
- Product, security, infra, and quality ownership are visible in the same workflow.
- Tests can verify not only feature behavior, but also service model completeness.
- The prototype remains free and local-first while showing a credible path to enterprise controls.
