# ADR 0005: Revenue Engine

## Status

Accepted

## Context

The product already demonstrates RAG, Agent workflows, security, evaluation, and service readiness. To look like a business instead of a technical demo, it needs a clear answer to why a buyer would pay, which package they should buy, and whether the value is strong enough to sell ethically.

## Decision

Add a Revenue Engine for regulated contact-center enterprise sales that includes:

- ROI calculator based on team size, monthly repeated workflows, time saved, and labor cost.
- High-ticket pricing tiers for Pilot, Ops, and Enterprise.
- Monthly hundred-million MRR scenarios using a small number of large accounts.
- Target verticals for financial, insurance, telecom, commerce, and BPO contact centers.
- Buyer personas with pains, objections, proof, and closing messages.
- Behavioral economics levers with explicit ethical usage.
- Culture-aware adoption patterns for hierarchical, regulated, speed-driven, and learning-oriented organizations.
- Revenue experiments with measurable success metrics.

## Consequences

- The UI now connects AI capability to business value and buying behavior.
- The service is positioned around a narrow high-budget wedge instead of a broad low-price chatbot market.
- Weak ROI cases are not over-sold; they produce a "보류" signal and recommend narrowing the workflow.
- The business model becomes testable through `revenue.test.ts`.
- The project gives a clearer product signal: commercial judgment, responsible go-to-market design, and measurable revenue assumptions.
