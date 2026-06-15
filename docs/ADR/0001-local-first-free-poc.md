# ADR 0001: Local-first Free PoC

## Status

Accepted

## Context

The project must be impressive as a portfolio artifact while remaining free to run. Requiring external APIs, cloud accounts, or private credentials would make the technical reader experience fragile and harder to reproduce.

## Decision

Build the pilot as a local-first React/Vite app with deterministic RAG and agent logic in TypeScript. Keep the production path explicit through documentation and the Enterprise Spec Pack instead of hiding missing infrastructure.

## Consequences

- Technical readers can run the project with `npm install` and `npm run dev`.
- Tests can validate AI-adjacent behavior deterministically.
- The prototype cannot claim production-grade identity, authorization, or audit storage.
- The docs must clearly define the upgrade path to vector DB, model gateway, RBAC, and server-side logs.
