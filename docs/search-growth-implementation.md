# Search Growth Implementation - AIX Pilot

This repository now exposes a search-readable service surface in addition to the system architecture. The implementation is designed to support organic discovery, AI answer surfaces, and a free-to-paid service path without committing to paid infrastructure first.

## Implemented Surface

| Surface | Path |
| --- | --- |
| Machine-readable offer | [docs/service-offer.json](./service-offer.json) |
| Revenue architecture | [docs/revenue-architecture.md](./revenue-architecture.md) |
| System architecture | [docs/system-architecture.md](./system-architecture.md) |
| Public canonical URL | https://aix-pilot.pages.dev/ |
| Lead capture URL | https://kim3310-doeon-kim-portfolio.pages.dev/?offer=aix-pilot&inquiry=private-ai-readiness-sprint#private-inquiry |
| Repository resource route | https://kim3310-doeon-kim-portfolio.pages.dev/resources/aix-pilot/ |
| Commercial route | https://kim3310-doeon-kim-portfolio.pages.dev/?offer=aix-pilot#service-offers |

## Search Positioning

- Primary query: enterprise AI readiness assessment RAG evaluation
- Secondary queries: enterprise RAG evaluation demo; AI pilot PII masking; golden set retrieval evaluation; private AI readiness sprint
- Public entry point: interactive browser demo using synthetic documents and local state
- Paid boundary: fixed-scope Private AI Readiness Sprint; private data onboarding and production implementation require separate approval

## Conversion Boundary

The public surface stays crawlable and free. Paid value starts when a visitor wants private data, saved history, branded export packs, customer-specific connectors, recurring reports, or implementation support.

## Deployment Notes

- Keep the sitemap and robots file aligned with the final production domain.
- Submit the canonical URL and sitemap in Google Search Console after the domain is connected.
- The lead-capture path is the central private inquiry form. Public GitHub issues are not used for confidential scoping.
- Keep exact free-tier quotas out of public promises because provider limits change.
