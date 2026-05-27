#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const runtimeNodeModules =
  process.env.CODEX_NODE_MODULES ||
  path.join(
    process.env.HOME || "",
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
  );
const requireFromRuntime = createRequire(path.join(runtimeNodeModules, "__capture_service__.cjs"));
const { chromium } = requireFromRuntime("playwright");

const url = process.argv[2] || "https://aix-pilot.pages.dev";
const outDir = path.resolve(process.argv[3] || "outputs/aix-pilot-presentation/assets/service-screens");
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const sections = [
  { id: "home", label: "실서비스 히어로", selector: "body", y: 0 },
  { id: "trust", label: "서비스 신뢰 모델", selector: "#trust" },
  { id: "revenue", label: "수익화 엔진", selector: "#revenue" },
  { id: "command", label: "운영 KPI 대시보드", selector: "#command" },
  { id: "rag", label: "RAG 콘솔", selector: "#rag" },
  { id: "stack", label: "무료 런타임 스택", selector: "#stack" },
  { id: "eval", label: "평가 게이트", selector: "#eval" },
  { id: "spec", label: "엔터프라이즈 스펙팩", selector: "#spec" }
];

async function waitForStableUi(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });
}

async function scrollToSection(page, section) {
  if (typeof section.y === "number") {
    await page.evaluate((y) => window.scrollTo(0, y), section.y);
  } else {
    await page.locator(section.selector).scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -24));
  }
  await page.waitForTimeout(650);
}

async function captureViewport(page, filename) {
  const target = path.join(outDir, filename);
  await page.screenshot({ path: target, fullPage: false, animations: "disabled" });
  return target;
}

async function run() {
  await fs.mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
    args: ["--no-sandbox", "--disable-gpu", "--force-color-profile=srgb"]
  });

  const consoleErrors = [];
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await waitForStableUi(page);

  const captures = [];
  for (const section of sections) {
    await scrollToSection(page, section);
    const file = await captureViewport(page, `desktop-${section.id}.png`);
    captures.push({ ...section, viewport: "desktop", file });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
  captures.push({
    id: "mobile-home",
    label: "모바일 히어로",
    selector: "body",
    viewport: "mobile",
    file: await captureViewport(page, "mobile-home.png")
  });

  const metrics = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    return {
      title: document.title,
      scrollHeight: Math.max(body.scrollHeight, html.scrollHeight),
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
  });

  await browser.close();

  const manifest = {
    url,
    capturedAt: new Date().toISOString(),
    metrics,
    consoleErrors,
    captures
  };
  const manifestPath = path.join(outDir, "capture-manifest.json");
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ manifestPath, captures: captures.length, consoleErrors }, null, 2));
}

run().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
