import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "../src/App";

const root = new URL("../", import.meta.url);
const inquiryUrl =
  "https://kim3310-doeon-kim-portfolio.pages.dev/?offer=aix-pilot&inquiry=private-ai-readiness-sprint#private-inquiry";
const description =
  "AIX Pilot is a browser-based enterprise AI readiness demo for local document retrieval, cited drafts, PII masking, golden-set evaluation, and pilot reporting.";

function read(path) {
  return readFileSync(new URL(path, root), "utf8");
}

function extractJsonLd(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  expect(match).not.toBeNull();
  return JSON.parse(match[1]);
}

describe("public product surface", () => {
  it("publishes complete, capability-bounded metadata and structured data", () => {
    const html = read("index.html");
    const structuredData = extractJsonLd(html);

    expect(html).toContain(`content="${description}"`);
    expect(html).not.toContain("Paid path: paid pilot workspace with.");
    expect(structuredData.description).toBe(description);
    expect(structuredData.operatingSystem).toBe("Web browser");
    expect(structuredData.featureList).toEqual(
      expect.arrayContaining([
        "Local document retrieval with citations",
        "PII and secret-pattern masking",
        "Golden-set retrieval and safety evaluation"
      ])
    );
    expect(structuredData.offers[1]).toMatchObject({
      name: "Private AI Readiness Sprint",
      url: inquiryUrl
    });
  });

  it("keeps the machine-readable offer, llms guide, and visible CTA on the same lane", () => {
    const offer = JSON.parse(read("public/service-offer.json"));
    const docsOffer = JSON.parse(read("docs/service-offer.json"));
    const llms = read("public/llms.txt");
    const renderedApp = renderToStaticMarkup(createElement(App));

    expect(offer).toEqual(docsOffer);
    expect(offer.commerce.lane_id).toBe("private-ai-readiness-sprint");
    expect(offer.lead_capture_url).toBe(inquiryUrl);
    expect(offer.productized_offer).toContain("browser-based enterprise AI readiness workbench");
    expect(offer.first_paid_sku).toContain("Private AI Readiness Sprint");
    expect(llms).toContain("Browser-local proof boundary:");
    expect(llms).toContain(inquiryUrl);
    expect(renderedApp).toContain("AI 준비도 진단 문의");
    expect(renderedApp).toContain(inquiryUrl.replaceAll("&", "&amp;"));
    expect(renderedApp).toContain("기업 지식 검색과 업무 초안을 한 흐름에서 검증합니다");
  });
});
