# Search Growth Implementation - AIX Pilot

This repository now exposes a search-readable service surface in addition to the system architecture. The implementation is designed to support organic discovery, AI answer surfaces, and a free-to-paid service path without committing to paid infrastructure first.

## Implemented Surface

| Surface | Path |
| --- | --- |
| Machine-readable offer | [docs/service-offer.json](./service-offer.json) |
| Revenue architecture | [docs/revenue-architecture.md](./revenue-architecture.md) |
| System architecture | [docs/system-architecture.md](./system-architecture.md) |
| Public canonical URL | https://aix-pilot.pages.dev/ |
| Lead capture URL | mailto:ehdjs1351@gmail.com?subject=AIX%20Pilot%20private%20workspace&body=I%20am%20interested%20in%20paid%20pilot%20workspace%20with%20private%20docs%2C%20provider%20keys%2C%20KPI%20dashboards%2C%20and%20exportable%20business%20case%20for%20AIX%20Pilot. |

## Search Positioning

- Primary query: AIX Pilot enterprise GenAI console
- Secondary queries: AIX Pilot demo; AIX Pilot system architecture; AIX Pilot business tool; enterprise GenAI pilot console with RAG fixtures, DLP masking, KPI views, and evaluation flows service
- Public entry point: public Cloudflare Pages demo with synthetic fixtures
- Paid boundary: paid pilot workspace with private docs, provider keys, KPI dashboards, and exportable business case

## Conversion Boundary

The public surface stays crawlable and free. Paid value starts when a visitor wants private data, saved history, branded export packs, customer-specific connectors, recurring reports, or implementation support.

## Deployment Notes

- Keep the sitemap and robots file aligned with the final production domain.
- Submit the canonical URL and sitemap in Google Search Console after the domain is connected.
- Use a real checkout or lead-capture endpoint only after the free demo shows repeated intent.
- Keep exact free-tier quotas out of public promises because provider limits change.
