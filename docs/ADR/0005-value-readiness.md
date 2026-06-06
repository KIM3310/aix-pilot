# ADR 0005: Value Readiness Model

## Status

Accepted

## Context

The product already demonstrates RAG, Agent workflows, security, evaluation, and service readiness. To look like a service instead of a technical demo, it needs a clear answer to why a buyer should continue the conversation, what operational scope is appropriate, and which cloud or governance resources are required next.

Public repository docs should not include public financial forecasts, scope assumptions, or contract assumptions. Those belong in private planning, CRM, or buyer-specific proposal artifacts.

## Decision

Add a Value Readiness model for regulated contact-center enterprise adoption that includes:

- Recovered workflow time based on team size, monthly repeated workflows, and minutes saved.
- Service packages for Diagnostic, Operations, and Enterprise scopes without public financial assumptions.
- Expansion paths based on operating teams, workflow footprint, channel, and resource focus.
- Target verticals for financial, insurance, telecom, commerce, and BPO contact centers.
- Buyer personas with pains, objections, proof, and internal approval messages.
- Behavioral economics levers with explicit ethical usage.
- Culture-aware adoption patterns for hierarchical, regulated, speed-driven, and learning-oriented organizations.
- Validation experiments with measurable success metrics.

## Consequences

- The UI now connects AI capability to operational value and buying behavior without exposing public financial assumptions.
- The service is positioned around a narrow high-governance workflow instead of a broad chatbot market.
- Weak adoption cases produce a "보류" signal and recommend narrowing the workflow before expanding.
- The business model remains testable through `valueModel.test.ts`.
- The project gives a clearer product signal: commercial judgment, responsible service design, cloud readiness, and measurable validation assumptions.
