# ADR 0003: Golden Evaluation Suite

## Status

Accepted

## Context

RAG and Agent demos can look correct for one hand-picked prompt while regressing silently when documents, ranking, or prompt logic changes. A portfolio project should show how AI behavior will be evaluated, not only how it is rendered.

## Decision

Maintain a small golden evaluation suite covering shipping, refund, VPN, KPI, security, and Agent approval questions. Score retrieval accuracy, citation coverage, safety masking, and confidence. Surface the result in both UI and Vitest.

## Consequences

- AI quality has concrete acceptance criteria.
- The same evaluation story appears in product UI, tests, docs, and CI.
- The current suite is intentionally compact; production should add SME-labeled cases, adversarial prompts, and per-department thresholds.
