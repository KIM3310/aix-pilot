# ADR 0002: Human-in-the-loop For Risky Agent Actions

## Status

Accepted

## Context

Enterprise Agent features often fail trust architecture when they jump directly from generated text to external actions. Emails, refunds, permission changes, and security exceptions can cause customer, financial, or compliance impact.

## Decision

Represent Agent output as a draft with explicit steps and approval status. The demo always marks external email generation as approval-required, and the Enterprise Spec Pack requires HITL for high-risk actions before production.

## Consequences

- The demo feels operationally realistic instead of overclaiming automation.
- Security and business stakeholders have a visible control point.
- Full automation is still possible later for low-risk workflows with clear policy boundaries.
