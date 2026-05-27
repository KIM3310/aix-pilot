# ADR 0005: Revenue Engine

## Status

Accepted

## Context

The product already demonstrates RAG, Agent workflows, security, evaluation, and service readiness. To look like a business instead of a technical demo, it needs a clear answer to why a buyer would pay, which package they should buy, and whether the value is strong enough to sell ethically.

## Decision

Add a Revenue Engine that includes:

- ROI calculator based on team size, monthly repeated workflows, time saved, and labor cost.
- Pricing tiers for Pilot, Ops, and Enterprise.
- Buyer personas with pains, objections, proof, and closing messages.
- Behavioral economics levers with explicit ethical usage.
- Culture-aware adoption patterns for hierarchical, regulated, speed-driven, and learning-oriented organizations.
- Revenue experiments with measurable success metrics.

## Consequences

- The UI now connects AI capability to business value and buying behavior.
- Weak ROI cases are not over-sold; they produce a "보류" signal and recommend narrowing the workflow.
- The business model becomes testable through `revenue.test.ts`.
- The project sends a stronger hiring signal for product thinking, commercial judgment, and responsible go-to-market design.
