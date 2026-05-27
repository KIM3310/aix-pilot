import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  ClipboardList,
  Database,
  DollarSign,
  Download,
  Eye,
  FileCheck2,
  FlaskConical,
  Gauge,
  GitBranch,
  Layers3,
  ListChecks,
  LockKeyhole,
  Mail,
  Network,
  Play,
  Plus,
  RotateCcw,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UploadCloud,
  Users,
  Workflow
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  behavioralLevers,
  buyerPersonas,
  culturalAdoptionPatterns,
  pricingTiers,
  revenueExperiments,
  salesMotions,
  scaleScenarios,
  targetVerticals
} from "./data/businessModel";
import { goldenEvaluationSuite } from "./data/evaluation";
import { costProfile, departmentAdoption, kpiTrend, workflowEvents } from "./data/metrics";
import { launchMaturity, servicePillars, serviceSlos, trustControls } from "./data/serviceModel";
import {
  capabilityRequirements,
  evaluationGates,
  rolloutPhases,
  securityGates,
  stackDecisions
} from "./data/enterpriseSpec";
import { sampleDocuments, starterQuestions, type KnowledgeDocument } from "./data/sampleDocs";
import { runAgent, type AgentMode } from "./lib/agent";
import { chunkDocuments, createDocumentFromUpload, generateRagAnswer, searchKnowledge } from "./lib/rag";
import { buildPilotReport } from "./lib/report";
import { maskSensitive, scanRisk, securityControls } from "./lib/security";
import { calculateServiceReadiness } from "./lib/serviceReadiness";
import { specCoverageScore } from "./lib/spec";
import { runEvaluationSuite, type EvalVerdict } from "./lib/evaluation";
import { calculateRevenueBusinessCase, calculateScaleScenario, formatKrw } from "./lib/revenue";

const sourceOrder = ["고객센터", "사내지식", "보안정책", "운영지표", "영업지원"];
const agentModes: AgentMode[] = ["FAQ 응답", "이메일 생성", "보고서 생성", "업무 자동화"];
const pieColors = ["#11A7A2", "#F36B4F", "#F6B53C", "#6C8FF6"];
const demoScenario =
  "고객이 배송 지연으로 불만을 제기했습니다. 보상 가능 여부와 안내 메일 초안을 만들어줘. 데모 연락처 010-0000-0000은 외부 발송 전에 마스킹해줘.";
const storageKeys = {
  documents: "aix-pilot.documents",
  query: "aix-pilot.query",
  audit: "aix-pilot.audit"
};
const initialAuditLog: AuditEvent[] = [
  { id: 1, time: "09:12", type: "RAG", summary: "초기 문서 8건 색인", risk: "낮음" },
  { id: 2, time: "09:14", type: "Security", summary: "DLP 정책 활성화", risk: "낮음" },
  { id: 3, time: "09:17", type: "Agent", summary: "이메일 생성 플레이북 로드", risk: "중간" }
];
const specScore = specCoverageScore();
const launchFlow = [
  { icon: Database, stage: "01", label: "Knowledge", detail: "문서 소유자, 최신일, 민감도 기준 색인", tone: "teal" },
  { icon: Search, stage: "02", label: "Grounding", detail: "Top 검색과 Citation을 별도 검증", tone: "blue" },
  { icon: ShieldCheck, stage: "03", label: "Guardrail", detail: "PII/DLP 탐지와 마스킹 게이트", tone: "gold" },
  { icon: Bot, stage: "04", label: "Agent", detail: "외부 발송은 휴먼 승인으로 제한", tone: "coral" },
  { icon: BarChart3, stage: "05", label: "Measure", detail: "KPI, Eval, 감사 증적까지 연결", tone: "violet" }
];

type AuditEvent = {
  id: number;
  time: string;
  type: string;
  summary: string;
  risk: "낮음" | "중간" | "높음";
};

function MetricCard({
  icon: Icon,
  label,
  value,
  delta,
  tone
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  delta: string;
  tone: "teal" | "coral" | "gold" | "blue";
}) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon">
        <Icon size={20} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{delta}</span>
    </article>
  );
}

function ReadinessCard({
  icon: Icon,
  label,
  value,
  meta,
  tone
}: {
  icon: typeof Gauge;
  label: string;
  value: number;
  meta: string;
  tone: "teal" | "coral" | "gold" | "blue";
}) {
  return (
    <article className={`readiness-card ${tone}`}>
      <div className="readiness-head">
        <span>
          <Icon size={17} />
          {label}
        </span>
        <strong>{value}%</strong>
      </div>
      <div className="readiness-bar" aria-hidden="true">
        <i style={{ width: `${value}%` }} />
      </div>
      <p>{meta}</p>
    </article>
  );
}

function RiskBadge({ value }: { value: "낮음" | "중간" | "높음" }) {
  return <span className={`risk-badge risk-${value}`}>{value}</span>;
}

function SourceBadge({ source }: { source: string }) {
  return <span className="source-badge">{source}</span>;
}

function StepStatus({ status }: { status: "done" | "review" | "waiting" }) {
  const label = status === "done" ? "완료" : status === "review" ? "검토" : "대기";
  return <span className={`step-status ${status}`}>{label}</span>;
}

function SpecStatus({ value }: { value: "완료" | "검증" | "확장" }) {
  return <span className={`spec-status spec-${value}`}>{value}</span>;
}

function EvalVerdictBadge({ value }: { value: EvalVerdict }) {
  const label = value === "pass" ? "통과" : value === "review" ? "검토" : "실패";
  return <span className={`eval-badge eval-${value}`}>{label}</span>;
}

function NumberControl({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  function commit(nextValue: number) {
    onChange(Math.min(max, Math.max(min, nextValue)));
  }

  return (
    <label className="number-control">
      <span>{label}</span>
      <div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => commit(Number(event.target.value))}
          aria-label={`${label} 슬라이더`}
        />
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => commit(Number(event.target.value || min))}
          aria-label={`${label} 직접 입력`}
        />
        <em>{suffix}</em>
      </div>
    </label>
  );
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage can be disabled in hardened browsers; the app still works in-memory.
  }
}

function App() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(() => readStoredValue(storageKeys.documents, sampleDocuments));
  const [query, setQuery] = useState(() => readStoredValue(storageKeys.query, starterQuestions[1]));
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [agentMode, setAgentMode] = useState<AgentMode>("이메일 생성");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadText, setUploadText] = useState("");
  const [activeView, setActiveView] = useState("command");
  const [toast, setToast] = useState("파일럿 워크스페이스 준비 완료");
  const [auditLog, setAuditLog] = useState<AuditEvent[]>(() => readStoredValue(storageKeys.audit, initialAuditLog));
  const [teamMembers, setTeamMembers] = useState(450);
  const [monthlyWorkflows, setMonthlyWorkflows] = useState(120000);
  const [minutesSavedPerWorkflow, setMinutesSavedPerWorkflow] = useState(7);
  const [hourlyCostKrw, setHourlyCostKrw] = useState(38000);
  const [selectedTierId, setSelectedTierId] = useState("PRICE-ENT");

  const chunks = useMemo(() => chunkDocuments(documents), [documents]);
  const results = useMemo(() => searchKnowledge(query, chunks, selectedSources), [query, chunks, selectedSources]);
  const answer = useMemo(() => generateRagAnswer(query, results), [query, results]);
  const agentDraft = useMemo(() => runAgent(agentMode, query, answer), [agentMode, query, answer]);
  const riskFindings = useMemo(() => scanRisk(`${query}\n${answer.answer}\n${agentDraft.output}`), [query, answer, agentDraft]);
  const maskedPreview = useMemo(() => maskSensitive(agentDraft.output), [agentDraft.output]);
  const latestRisk = riskFindings.some((finding) => finding.severity === "높음")
    ? "높음"
    : riskFindings.some((finding) => finding.severity === "중간")
      ? "중간"
      : "낮음";
  const maskedQuery = useMemo(() => maskSensitive(query), [query]);
  const evaluationRun = useMemo(() => runEvaluationSuite(goldenEvaluationSuite, documents), [documents]);

  const docsBySource = useMemo(
    () =>
      sourceOrder.map((source) => ({
        source,
        count: documents.filter((doc) => doc.source === source).length
      })),
    [documents]
  );

  const confidenceTone = answer.confidence >= 75 ? "good" : answer.confidence >= 45 ? "warn" : "bad";
  const readinessScore = Math.min(
    99,
    54 + Math.round(answer.confidence * 0.18) + Math.min(16, documents.length) + (riskFindings.some((finding) => finding.severity === "높음") ? -12 : 10)
  );
  const securityReadiness = latestRisk === "높음" ? 62 : latestRisk === "중간" ? 82 : 96;
  const approvalReadiness = agentDraft.requiresApproval ? 84 : 92;
  const serviceReadiness = useMemo(
    () =>
      calculateServiceReadiness({
        evaluationScore: evaluationRun.overallScore,
        specScore,
        readinessScore,
        securityReadiness,
        approvalReadiness,
        riskFindings,
        documentCount: documents.length,
        chunkCount: chunks.length
      }),
    [
      approvalReadiness,
      chunks.length,
      documents.length,
      evaluationRun.overallScore,
      readinessScore,
      riskFindings,
      securityReadiness
    ]
  );
  const selectedTier = pricingTiers.find((tier) => tier.id === selectedTierId) ?? pricingTiers[1];
  const revenueCase = useMemo(
    () =>
      calculateRevenueBusinessCase({
        teamMembers,
        monthlyWorkflows,
        minutesSavedPerWorkflow,
        hourlyCostKrw,
        selectedTierMonthlyKrw: selectedTier.monthlyKrw
      }),
    [hourlyCostKrw, minutesSavedPerWorkflow, monthlyWorkflows, selectedTier.monthlyKrw, teamMembers]
  );
  const scaleResults = useMemo(() => scaleScenarios.map((scenario) => ({ ...scenario, result: calculateScaleScenario(scenario) })), []);
  const primaryScale = scaleResults[0];
  const readinessCards = [
    {
      icon: Database,
      label: "지식",
      value: Math.min(98, 66 + documents.length * 4),
      meta: `문서 ${documents.length}건 / 청크 ${chunks.length}개`,
      tone: "teal" as const
    },
    {
      icon: Search,
      label: "근거",
      value: answer.confidence,
      meta: `근거 문서 ${answer.citations.length}개`,
      tone: "blue" as const
    },
    {
      icon: ShieldCheck,
      label: "보안",
      value: securityReadiness,
      meta: `탐지 ${riskFindings.length}건 / 위험 ${latestRisk}`,
      tone: "gold" as const
    },
    {
      icon: Workflow,
      label: "승인",
      value: approvalReadiness,
      meta: agentDraft.requiresApproval ? "휴먼 승인 활성" : "자동 처리 가능",
      tone: "coral" as const
    }
  ];
  const proofCards = [
    {
      icon: FlaskConical,
      label: "Eval Score",
      value: `${evaluationRun.overallScore}`,
      detail: `${evaluationRun.passCount} 통과 / ${evaluationRun.failCount} 실패`,
      tone: "teal" as const
    },
    {
      icon: ShieldCheck,
      label: "PII Safety",
      value: `${evaluationRun.safetyPassRate}%`,
      detail: `위험 ${latestRisk} / 원문 마스킹`,
      tone: "gold" as const
    },
    {
      icon: FileCheck2,
      label: "Spec Coverage",
      value: `${specScore}%`,
      detail: `${capabilityRequirements.length}개 요구사항 추적`,
      tone: "blue" as const
    },
    {
      icon: Rocket,
      label: "Service Score",
      value: `${serviceReadiness.score}`,
      detail: `${serviceReadiness.tier} / ${serviceReadiness.posture}`,
      tone: "coral" as const
    }
  ];

  useEffect(() => {
    writeStoredValue(storageKeys.documents, documents);
  }, [documents]);

  useEffect(() => {
    writeStoredValue(storageKeys.query, query);
  }, [query]);

  useEffect(() => {
    writeStoredValue(storageKeys.audit, auditLog);
  }, [auditLog]);
  const pilotReport = useMemo(
    () =>
      buildPilotReport({
        query,
        answer,
        agentDraft,
        riskFindings,
        documentCount: documents.length,
        chunkCount: chunks.length,
        readinessScore
      }),
    [answer, agentDraft, chunks.length, documents.length, query, readinessScore, riskFindings]
  );

  function toggleSource(source: string) {
    setSelectedSources((current) => (current.includes(source) ? current.filter((item) => item !== source) : [...current, source]));
  }

  function submitQuery() {
    if (!query.trim()) {
      setToast("질문을 입력하면 RAG 근거를 갱신합니다");
      return;
    }
    pushAudit("RAG", `질의 실행: ${maskedQuery.slice(0, 34)}`, latestRisk);
    setToast("RAG 질의를 실행하고 근거를 갱신했습니다");
  }

  function pushAudit(type: string, summary: string, risk: AuditEvent["risk"] = latestRisk) {
    const now = new Date();
    setAuditLog((current) => [
      {
        id: now.getTime(),
        time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
        type,
        summary,
        risk
      },
      ...current.slice(0, 5)
    ]);
  }

  function ingestDocument() {
    if (!uploadText.trim()) return;
    setDocuments((current) => [createDocumentFromUpload(uploadTitle, uploadText), ...current]);
    pushAudit("Knowledge", `${uploadTitle || "업로드 문서"} 색인 완료`, "낮음");
    setToast(`문서 "${uploadTitle || "업로드 문서"}" 색인 완료`);
    setUploadTitle("");
    setUploadText("");
  }

  function runDemoScenario() {
    setQuery(demoScenario);
    setAgentMode("이메일 생성");
    setSelectedSources([]);
    pushAudit("Scenario", "배송 지연 고객 응대 데모 실행", "중간");
    setToast("배송 지연 고객 응대 시나리오를 실행했습니다");
  }

  function exportReport() {
    downloadTextFile(`aix-pilot-report-${new Date().toISOString().slice(0, 10)}.md`, pilotReport);
    pushAudit("Report", "파일럿 리포트 다운로드", latestRisk);
    setToast("파일럿 리포트를 다운로드했습니다");
  }

  function resetWorkspace() {
    setDocuments(sampleDocuments);
    setQuery(starterQuestions[1]);
    setSelectedSources([]);
    setAgentMode("이메일 생성");
    setUploadTitle("");
    setUploadText("");
    setAuditLog(initialAuditLog);
    setToast("파일럿 워크스페이스를 초기화했습니다");
  }

  function scrollToSection(key: string) {
    setActiveView(key);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(key)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="app-shell">
      <aside className="side-nav" aria-label="AIX Pilot navigation">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Sparkles size={22} />
          </div>
          <div>
            <strong>AIX Pilot</strong>
            <span>무료 GenAI 운영</span>
          </div>
        </div>
        <nav>
          {[
            ["command", Gauge, "Command"],
            ["trust", LockKeyhole, "Trust"],
            ["revenue", DollarSign, "Revenue"],
            ["rag", Search, "RAG"],
            ["agent", Bot, "Agent"],
            ["security", ShieldCheck, "Security"],
            ["kpi", BarChart3, "KPI"],
            ["eval", FlaskConical, "Eval"],
            ["spec", FileCheck2, "Spec"],
            ["stack", Layers3, "Stack"]
          ].map(([key, Icon, label]) => (
            <button
              type="button"
              className={activeView === key ? "nav-button active" : "nav-button"}
              key={String(key)}
              onClick={() => scrollToSection(String(key))}
              title={`${label} 보기`}
              aria-current={activeView === key ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{String(label)}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="workspace" id="main-content">
        <header className="product-hero">
          <div className="hero-copy">
            <div className="hero-kicker">
              <Sparkles size={16} />
              Enterprise GenAI Pilot Workspace
            </div>
            <h1>근거, 보안, Agent, KPI까지 운영 가능한 GenAI 파일럿</h1>
            <p className="hero-subcopy">
              흩어진 사내 지식을 RAG로 묶고, 업무 초안 Agent와 DLP 마스킹, 평가 게이트, 운영 리포트까지 하나의 고급 콘솔에서 검증합니다.
            </p>
            <div className="top-actions">
              <button type="button" className="icon-button" title="파일럿 실행" onClick={runDemoScenario}>
                <Play size={18} />
                <span>실행</span>
              </button>
              <button type="button" className="icon-button ghost" title="보고서 생성" onClick={exportReport}>
                <Download size={18} />
                <span>리포트</span>
              </button>
              <button type="button" className="icon-button ghost" title="초기화" onClick={resetWorkspace}>
                <RotateCcw size={18} />
                <span>초기화</span>
              </button>
            </div>
            <div className="hero-proof-row" aria-label="pilot proof summary">
              <span>Eval {evaluationRun.overallScore}</span>
              <span>Spec {specScore}%</span>
              <span>Service {serviceReadiness.score}</span>
              <span>ROI {revenueCase.paybackMultiple}x</span>
              <span>문서 {documents.length}건</span>
              <span>위험 {latestRisk}</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="AIX Pilot product visual">
            <picture>
              <source srcSet="/brand/aix-hero-generated.webp" type="image/webp" />
              <img
                src="/brand/aix-hero-generated.png"
                width={1536}
                height={1024}
                decoding="async"
                fetchPriority="high"
                alt="기업용 GenAI 운영 콘솔을 표현한 추상 제품 비주얼"
              />
            </picture>
            <div className="visual-glass-card visual-score">
              <span>Evaluation</span>
              <strong>{evaluationRun.overallScore}</strong>
              <small>{evaluationRun.passCount} 통과 / {evaluationRun.failCount} 실패</small>
            </div>
            <div className="visual-glass-card visual-motion">
              <img src="/brand/aix-motion.gif" width={1280} height={720} decoding="async" alt="AIX Pilot 운영 흐름 애니메이션" />
              <span>Live operating flow</span>
            </div>
          </div>
        </header>

        <section className="signal-grid" aria-label="pilot signals">
          <article>
            <span>로컬 데모</span>
            <strong>무료 기준 운영 준비도 {readinessScore}%</strong>
          </article>
          <article>
            <span>지식 베이스</span>
            <strong>문서 {documents.length}건 / 청크 {chunks.length}개</strong>
          </article>
          <article>
            <span>시스템</span>
            <strong aria-live="polite" role="status">{toast}</strong>
          </article>
          {readinessCards.map((item) => (
            <ReadinessCard key={item.label} {...item} />
          ))}
        </section>

        <section className="launch-proof" aria-label="launch proof">
          <div className="proof-hero">
            <div>
              <p className="eyebrow">Launch Proof</p>
              <h2>제품처럼 보이는 데모를 넘어, 실제 운영 전환 기준까지 증명합니다</h2>
            </div>
            <div className="proof-orbit" style={{ "--score": `${evaluationRun.overallScore * 3.6}deg` } as CSSProperties}>
              <strong>{evaluationRun.overallScore}</strong>
              <span>Eval</span>
            </div>
          </div>

          <div className="proof-flow" aria-label="AI operating flow">
            {launchFlow.map(({ icon: Icon, stage, label, detail, tone }) => (
              <article className={`proof-node ${tone}`} key={stage}>
                <span>{stage}</span>
                <div>
                  <Icon size={18} />
                  <strong>{label}</strong>
                </div>
                <p>{detail}</p>
              </article>
            ))}
          </div>

          <div className="proof-card-grid">
            {proofCards.map(({ icon: Icon, label, value, detail, tone }) => (
              <article className={`proof-card ${tone}`} key={label}>
                <Icon size={18} />
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{detail}</p>
              </article>
            ))}
          </div>

          <div className="proof-ribbon">
            <span>
              <Network size={16} />
              Local-first
            </span>
            <span>
              <Eye size={16} />
              Evidence-led
            </span>
            <span>
              <LockKeyhole size={16} />
              Privacy-safe
            </span>
            <span>
              <GitBranch size={16} />
              CI-ready
            </span>
          </div>
        </section>

        <section className="trust-section" id="trust">
          <div className="section-heading trust-heading">
            <div>
              <p className="eyebrow">Service Trust Model</p>
              <h2>서비스로 운영될 때 필요한 품질, 보안, 승인, 감사 기준을 한 화면에서 관리합니다</h2>
            </div>
            <div className="trust-score" aria-label="서비스 운영 준비도">
              <LockKeyhole size={20} />
              <strong>{serviceReadiness.score}</strong>
              <span>{serviceReadiness.tier}</span>
            </div>
          </div>

          <div className="trust-command">
            <article className="trust-posture">
              <span>현재 판단</span>
              <strong>{serviceReadiness.posture}</strong>
              <p>
                Eval, Spec, 보안 탐지, 승인 흐름, 지식 베이스 깊이를 가중 합산하고 고위험 탐지 항목은 자동 감점합니다.
              </p>
              <div className="trust-weight-row">
                {Object.entries(serviceReadiness.weights).map(([label, value]) => (
                  <span key={label}>
                    {label} {value}
                  </span>
                ))}
              </div>
            </article>

            <div className="trust-blockers">
              <div className="section-heading compact">
                <h2>Launch blockers</h2>
                <AlertTriangle size={21} />
              </div>
              {serviceReadiness.blockers.length ? (
                serviceReadiness.blockers.map((blocker) => (
                  <article key={blocker}>
                    <RiskBadge value="높음" />
                    <span>{blocker}</span>
                  </article>
                ))
              ) : (
                <article className="trust-clear">
                  <CheckCircle2 size={20} />
                  <span>현재 데모 입력 기준 운영 전환을 막는 고위험 blocker가 없습니다.</span>
                </article>
              )}
            </div>
          </div>

          <div className="service-pillar-grid">
            {servicePillars.map((pillar) => (
              <article key={pillar.id}>
                <div>
                  <span>{pillar.id}</span>
                  <strong>{pillar.name}</strong>
                </div>
                <p>{pillar.intent}</p>
                <div className="pillar-meta">
                  <span>{pillar.operator}</span>
                  <span>{pillar.metric}</span>
                </div>
                <div className="pillar-score" aria-hidden="true">
                  <i style={{ width: `${pillar.score}%` }} />
                </div>
                <em>{pillar.evidence}</em>
              </article>
            ))}
          </div>

          <div className="trust-grid">
            <div className="workspace-band trust-control-panel">
              <div className="section-heading compact">
                <h2>Trust controls</h2>
                <ShieldCheck size={22} />
              </div>
              <div className="trust-control-list">
                {trustControls.map((control) => (
                  <article key={control.id}>
                    <RiskBadge value={control.severity} />
                    <div>
                      <strong>{control.name}</strong>
                      <span>{control.category} / {control.status}</span>
                      <p>{control.objective}</p>
                      <em>{control.evidence} | {control.automation}</em>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="workspace-band slo-panel">
              <div className="section-heading compact">
                <h2>SLO & maturity</h2>
                <Gauge size={22} />
              </div>
              <div className="slo-list">
                {serviceSlos.map((slo) => (
                  <article className={`slo-row slo-${slo.status}`} key={slo.id}>
                    <div>
                      <strong>{slo.metric}</strong>
                      <span>{slo.owner}</span>
                    </div>
                    <p>{slo.current} / target {slo.target}</p>
                    <em>{slo.signal}</em>
                  </article>
                ))}
              </div>
              <div className="maturity-track">
                {launchMaturity.map((stage) => (
                  <article key={stage.id}>
                    <span>{stage.id}</span>
                    <strong>{stage.stage}</strong>
                    <p>{stage.promise}</p>
                    <em>{stage.gate}</em>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="revenue-section" id="revenue">
          <div className="section-heading revenue-heading">
            <div>
              <p className="eyebrow">Revenue Engine</p>
              <h2>월 수억 매출은 대형 regulated contact center의 반복 업무와 보안 예산에서 나옵니다</h2>
            </div>
            <div className={`close-signal close-${revenueCase.closeSignal}`}>
              <DollarSign size={20} />
              <strong>{revenueCase.paybackMultiple}x</strong>
              <span>{revenueCase.closeSignal} 전환 신호</span>
            </div>
          </div>

          <div className="revenue-command">
            <article className="revenue-case">
              <span>Executive business case</span>
              <strong>월 {formatKrw(revenueCase.monthlySavingsKrw)}원 절감 가능</strong>
              <p>{revenueCase.anchorMessage}</p>
              <div className="revenue-kpi-row">
                <article>
                  <TrendingUp size={18} />
                  <strong>{formatKrw(revenueCase.annualSavingsKrw)}원</strong>
                  <span>연간 절감 근거</span>
                </article>
                <article>
                  <Gauge size={18} />
                  <strong>{revenueCase.monthlySavedHours}h</strong>
                  <span>월 회수 시간</span>
                </article>
                <article>
                  <Rocket size={18} />
                  <strong>{revenueCase.paybackMonths}</strong>
                  <span>회수 개월</span>
                </article>
                <article>
                  <Building2 size={18} />
                  <strong>{revenueCase.recommendedTier}</strong>
                  <span>추천 패키지</span>
                </article>
              </div>
            </article>

            <div className="revenue-controls">
              <NumberControl label="사용 인원" value={teamMembers} min={3} max={1200} step={5} suffix="명" onChange={setTeamMembers} />
              <NumberControl
                label="월 반복 업무"
                value={monthlyWorkflows}
                min={300}
                max={500000}
                step={1000}
                suffix="건"
                onChange={setMonthlyWorkflows}
              />
              <NumberControl
                label="건당 절감"
                value={minutesSavedPerWorkflow}
                min={1}
                max={30}
                step={1}
                suffix="분"
                onChange={setMinutesSavedPerWorkflow}
              />
              <NumberControl
                label="시간당 비용"
                value={hourlyCostKrw}
                min={12000}
                max={150000}
                step={1000}
                suffix="원"
                onChange={setHourlyCostKrw}
              />
            </div>
          </div>

          <div className="scale-board">
            <article className="scale-main">
              <span>월 수억 매출 공식</span>
              <strong>{primaryScale.targetAccounts}개 대형 계정 = 월 {formatKrw(primaryScale.result.mrrKrw)}원 MRR</strong>
              <p>{primaryScale.whyItCanReach}</p>
              <div>
                <span>셋업 파이프라인 {formatKrw(primaryScale.result.setupPipelineKrw)}원</span>
                <span>ARR {formatKrw(primaryScale.result.annualRunRateKrw)}원</span>
                <span>{primaryScale.channel}</span>
              </div>
            </article>
            <div className="target-vertical-list">
              {targetVerticals.map((vertical) => (
                <article key={vertical.id}>
                  <span>{vertical.market}</span>
                  <strong>{vertical.wedgeWorkflow}</strong>
                  <p>{vertical.whyNow}</p>
                  <em>{vertical.budgetOwner} / {vertical.buyingTrigger}</em>
                </article>
              ))}
            </div>
          </div>

          <div className="pricing-grid">
            {pricingTiers.map((tier) => (
              <article className={`pricing-card ${selectedTier.id === tier.id ? "active" : ""}`} key={tier.id}>
                <div className="pricing-head">
                  <div>
                    <span>{tier.buyer}</span>
                    <strong>{tier.name}</strong>
                  </div>
                  {tier.recommended ? <em>추천</em> : null}
                </div>
                <p>{tier.promise}</p>
                <div className="price-line">
                  <strong>월 {formatKrw(tier.monthlyKrw)}원</strong>
                  <span>초기 {formatKrw(tier.setupKrw)}원</span>
                </div>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button type="button" onClick={() => setSelectedTierId(tier.id)} title={`${tier.name} 패키지 선택`}>
                  <span>{selectedTier.id === tier.id ? "선택됨" : "선택"}</span>
                </button>
                <small>{tier.conversionTrigger}</small>
              </article>
            ))}
          </div>

          <div className="scale-scenario-grid">
            {scaleResults.map((scenario) => (
              <article key={scenario.id}>
                <span>{scenario.name}</span>
                <strong>월 {formatKrw(scenario.result.mrrKrw)}원</strong>
                <p>{scenario.wedge}</p>
                <em>셋업 {formatKrw(scenario.result.setupPipelineKrw)}원 / {scenario.channel}</em>
              </article>
            ))}
          </div>

          <div className="buyer-grid">
            <div className="workspace-band buyer-panel">
              <div className="section-heading compact">
                <h2>Buyer psychology</h2>
                <Users size={22} />
              </div>
              <div className="buyer-list">
                {buyerPersonas.map((persona) => (
                  <article key={persona.id}>
                    <span>{persona.role}</span>
                    <strong>{persona.desiredOutcome}</strong>
                    <p>{persona.pain}</p>
                    <em>{persona.objection} → {persona.closeMessage}</em>
                  </article>
                ))}
              </div>
            </div>

            <div className="workspace-band behavior-panel">
              <div className="section-heading compact">
                <h2>Behavioral economics</h2>
                <Target size={22} />
              </div>
              <div className="behavior-list">
                {behavioralLevers.map((lever) => (
                  <article key={lever.id}>
                    <strong>{lever.principle}</strong>
                    <p>{lever.productMove}</p>
                    <span>{lever.ethicalUse}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="culture-grid">
            {culturalAdoptionPatterns.map((pattern) => (
              <article key={pattern.id}>
                <span>{pattern.culture}</span>
                <strong>{pattern.rolloutMove}</strong>
                <p>{pattern.friction}</p>
                <em>{pattern.message}</em>
              </article>
            ))}
          </div>

          <div className="experiment-strip">
            {salesMotions.map((motion) => (
              <article key={motion.id}>
                <span>{motion.stage}</span>
                <strong>{motion.action}</strong>
                <p>{motion.metric}</p>
                <em>enterprise sales motion</em>
              </article>
            ))}
          </div>

          <div className="experiment-strip">
            {revenueExperiments.map((experiment) => (
              <article key={experiment.id}>
                <span>{experiment.id}</span>
                <strong>{experiment.hypothesis}</strong>
                <p>{experiment.test}</p>
                <em>{experiment.successMetric}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="metric-grid" id="command">
          <MetricCard icon={Search} label="RAG 근거 포함률" value="92%" delta="+18%p vs baseline" tone="teal" />
          <MetricCard icon={Workflow} label="자동화 완료율" value="48%" delta="6주 파일럿 기준" tone="coral" />
          <MetricCard icon={LockKeyhole} label="보안 차단" value="17건" delta="PII/DLP 탐지" tone="gold" />
          <MetricCard icon={Gauge} label="예상 절감 시간" value="330h" delta="월간 환산" tone="blue" />
        </section>

        <section className="command-grid">
          <div className="workspace-band rag-console" id="rag">
            <div className="section-heading">
              <div>
                <p className="eyebrow">RAG Command</p>
                <h2>사내 문서 검색과 근거 기반 답변</h2>
              </div>
              <span className={`confidence ${confidenceTone}`}>신뢰도 {answer.confidence}%</span>
            </div>

            <div className="query-bar">
              <Search size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") submitQuery();
                }}
                aria-label="RAG query"
              />
              <button type="button" title="질문 실행" aria-label="질문 실행" onClick={submitQuery}>
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="retrieval-meta">
              <span>검색 결과 {results.length}개</span>
              <span>근거 문서 {answer.citations.length}개</span>
              <span>마스킹 {riskFindings.length}건</span>
            </div>

            <div className="starter-row">
              {starterQuestions.map((item) => (
                <button type="button" key={item} onClick={() => setQuery(item)}>
                  {item}
                </button>
              ))}
            </div>

            <div className="source-filter" aria-label="source filters">
              {sourceOrder.map((source) => (
                <button type="button" className={selectedSources.includes(source) ? "active" : ""} key={source} onClick={() => toggleSource(source)}>
                  {source}
                </button>
              ))}
              <button type="button" className={!selectedSources.length ? "active" : ""} onClick={() => setSelectedSources([])}>
                전체
              </button>
            </div>

            <div className="answer-box">
              <div className="answer-title">
                <Sparkles size={18} />
                <strong>근거 기반 답변</strong>
              </div>
              <p>{answer.answer}</p>
            </div>

            <div className="citation-list">
              {answer.citations.map((citation) => (
                <article className="citation-row" key={citation.id}>
                  <div>
                    <SourceBadge source={citation.source} />
                    <strong>{citation.title}</strong>
                    <span>{citation.owner} | {citation.updatedAt}</span>
                  </div>
                  <p>{citation.highlights[0] || citation.text}</p>
                  <em>score {citation.score}</em>
                </article>
              ))}
            </div>
          </div>

          <div className="workspace-band agent-panel" id="agent">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Agent Studio</p>
                <h2>업무 초안 생성과 승인 흐름</h2>
              </div>
              <Bot size={24} />
            </div>

            <div className="mode-selector">
              {agentModes.map((mode) => (
                <button type="button" className={agentMode === mode ? "active" : ""} key={mode} onClick={() => setAgentMode(mode)}>
                  {mode}
                </button>
              ))}
            </div>

            <div className="agent-output">
              <div>
                <strong>{agentDraft.title}</strong>
                {agentDraft.requiresApproval ? <span className="approval">승인 필요</span> : <span className="approval ok">자동 처리 가능</span>}
              </div>
              <pre>{maskedPreview}</pre>
            </div>

            <div className="agent-steps">
              {agentDraft.steps.map((step) => (
                <div className="agent-step" key={`${step.label}-${step.status}`}>
                  <StepStatus status={step.status} />
                  <strong>{step.label}</strong>
                  <span>{step.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ops-grid">
          <div className="workspace-band upload-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Knowledge Intake</p>
                <h2>문서 추가 색인</h2>
              </div>
              <UploadCloud size={24} />
            </div>
            <input
              className="plain-input"
              placeholder="문서 제목"
              aria-label="문서 제목"
              value={uploadTitle}
              onChange={(event) => setUploadTitle(event.target.value)}
            />
            <textarea
              placeholder="여기에 정책, FAQ, 회의록, 매뉴얼 텍스트를 붙여 넣으세요."
              aria-label="문서 본문"
              value={uploadText}
              onChange={(event) => setUploadText(event.target.value)}
            />
            <button type="button" className="full-button" onClick={ingestDocument} disabled={!uploadText.trim()} title="문서 색인">
              <Plus size={18} />
              <span>문서 색인</span>
            </button>
          </div>

          <div className="workspace-band security-panel" id="security">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Security Guard</p>
                <h2>DLP, 권한, 감사 정책</h2>
              </div>
              <ShieldCheck size={24} />
            </div>

            <div className="risk-list">
              {riskFindings.length ? (
                riskFindings.slice(0, 4).map((finding, index) => (
                  <article className="risk-row" key={`${finding.type}-${index}`}>
                    <RiskBadge value={finding.severity} />
                    <div>
                      <strong>{finding.type}</strong>
                      <span>{finding.message}</span>
                    </div>
                  </article>
                ))
              ) : (
                <article className="empty-state">
                  <CheckCircle2 size={22} />
                  <span>현재 요청에서 차단 리스크가 감지되지 않았습니다.</span>
                </article>
              )}
            </div>

            <div className="control-list">
              {securityControls.map((control) => (
                <article key={control.name}>
                  <strong>{control.name}</strong>
                  <span>{control.status}</span>
                  <p>{control.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="workspace-band audit-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Audit Trail</p>
                <h2>감사 로그와 실행 이력</h2>
              </div>
              <ClipboardList size={24} />
            </div>
            <div className="audit-list">
              {auditLog.map((event) => (
                <article key={event.id}>
                  <RiskBadge value={event.risk} />
                  <div>
                    <strong>{event.type}</strong>
                    <span>{event.time} | {event.summary}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="workspace-band kpi-panel" id="kpi">
            <div className="section-heading">
              <div>
                <p className="eyebrow">KPI Dashboard</p>
                <h2>파일럿 성과와 운영 리스크</h2>
              </div>
              <BarChart3 size={24} />
            </div>
            <div className="chart-frame">
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={kpiTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke="#E7ECE9" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="rag" name="RAG 성공률" stroke="#11A7A2" fill="#BDEEEA" strokeWidth={3} />
                  <Area type="monotone" dataKey="automation" name="자동화율" stroke="#F36B4F" fill="#FFD7CB" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="analytics-grid">
          <div className="workspace-band">
            <div className="section-heading compact">
              <h2>부서별 도입률</h2>
              <Gauge size={22} />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={departmentAdoption} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="#E7ECE9" vertical={false} />
                <XAxis dataKey="team" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="usage" name="사용률" fill="#6C8FF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="saved" name="절감 시간" fill="#F6B53C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="workspace-band">
            <div className="section-heading compact">
              <h2>문서 소스 분포</h2>
              <Layers3 size={22} />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={docsBySource} dataKey="count" nameKey="source" innerRadius={58} outerRadius={92} paddingAngle={4}>
                  {docsBySource.map((_, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mini-legend">
              {docsBySource.map((item, index) => (
                <span key={item.source}>
                  <i style={{ background: pieColors[index % pieColors.length] }} />
                  {item.source} {item.count}
                </span>
              ))}
            </div>
          </div>

          <div className="workspace-band" id="stack">
            <div className="section-heading compact">
              <h2>무료 기준 스택</h2>
              <Sparkles size={22} />
            </div>
            <div className="stack-map">
              {[
                ["UI", "React + Vite"],
                ["RAG", "Local TF-IDF / Ollama 확장"],
                ["Vector DB", "Qdrant / Chroma"],
                ["Agent", "Playbook Orchestration"],
                ["Security", "DLP + RBAC policy"],
                ["BI", "Recharts + CSV export"]
              ].map(([label, value]) => (
                <article key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className="workspace-band">
            <div className="section-heading compact">
              <h2>무료 운영 비용 프로파일</h2>
              <Database size={22} />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={costProfile} dataKey="value" nameKey="name" innerRadius={52} outerRadius={88} paddingAngle={4}>
                  {costProfile.map((_, index) => (
                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="cost-note">로컬 데모는 API 비용 0원 기준이며, 호스팅은 무료 티어 또는 사내 VM 기준으로 시작합니다.</div>
          </div>
        </section>

        <section className="eval-section" id="eval">
          <div className="section-heading spec-heading">
            <div>
              <p className="eyebrow">Evaluation Lab</p>
              <h2>골든 질문셋으로 RAG 품질과 안전성을 매번 검증</h2>
            </div>
            <div className="eval-score" aria-label="평가 점수">
              <FlaskConical size={20} />
              <strong>{evaluationRun.overallScore}</strong>
              <span>Eval Score</span>
            </div>
          </div>

          <div className="eval-kpi-row">
            <article>
              <Search size={18} />
              <strong>{evaluationRun.retrievalAccuracy}%</strong>
              <span>검색 정확도</span>
            </article>
            <article>
              <FileCheck2 size={18} />
              <strong>{evaluationRun.citationCoverage}%</strong>
              <span>근거 포함</span>
            </article>
            <article>
              <ShieldCheck size={18} />
              <strong>{evaluationRun.safetyPassRate}%</strong>
              <span>안전 통과</span>
            </article>
            <article>
              <Gauge size={18} />
              <strong>{evaluationRun.averageConfidence}%</strong>
              <span>평균 신뢰도</span>
            </article>
          </div>

          <div className="eval-grid">
            <div className="workspace-band eval-case-panel">
              <div className="section-heading compact">
                <h2>Regression Golden Set</h2>
                <span className="eval-count">
                  {evaluationRun.passCount} 통과 / {evaluationRun.reviewCount} 검토 / {evaluationRun.failCount} 실패
                </span>
              </div>
              <div className="eval-case-list">
                {evaluationRun.results.map((result) => (
                  <article className={`eval-case eval-case-${result.verdict}`} key={result.id}>
                    <div className="eval-case-head">
                      <EvalVerdictBadge value={result.verdict} />
                      <div>
                        <strong>{result.id} · {result.persona}</strong>
                        <p>{result.question}</p>
                      </div>
                      <span>{result.score}</span>
                    </div>
                    <div className="eval-meter" aria-hidden="true">
                      <i style={{ width: `${result.score}%` }} />
                    </div>
                    <div className="eval-lines">
                      <span>기대 문서: {result.expectedTitle}</span>
                      <span>Top 검색: {result.retrievedTitle}</span>
                      <span>인수 기준: {result.acceptance}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="workspace-band eval-evidence-panel">
              <div className="section-heading compact">
                <h2>품질 게이트 증적</h2>
                <ListChecks size={22} />
              </div>
              <div className="eval-evidence-list">
                <article>
                  <span>Groundedness</span>
                  <strong>검색 Top 문서와 Citation 문서를 분리 검증</strong>
                  <p>첫 검색 결과가 기대 문서인지, 답변 근거에도 기대 문서가 포함되는지 별도 점수화합니다.</p>
                </article>
                <article>
                  <span>Safety Regression</span>
                  <strong>PII 탐지와 마스킹을 동일 케이스에서 검증</strong>
                  <p>전화번호와 이메일 원문이 평가 증적에 남지 않는지 테스트와 화면에서 같이 확인합니다.</p>
                </article>
                <article>
                  <span>Hiring Signal</span>
                  <strong>데모, 테스트, 문서, CI가 같은 기준을 공유</strong>
                  <p>프로덕트 감각뿐 아니라 운영 전환 기준과 회귀 방지 사고를 함께 보여줍니다.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="spec-section" id="spec">
          <div className="section-heading spec-heading">
            <div>
              <p className="eyebrow">Enterprise Spec Pack</p>
              <h2>파일럿에서 운영 전환까지 추적되는 도입 스펙</h2>
            </div>
            <div className="spec-score" aria-label="스펙 커버리지 점수">
              <FileCheck2 size={20} />
              <strong>{specScore}%</strong>
              <span>스펙 커버리지</span>
            </div>
          </div>

          <div className="spec-kpi-row">
            <article>
              <Target size={18} />
              <strong>{capabilityRequirements.length}</strong>
              <span>요구사항</span>
            </article>
            <article>
              <ListChecks size={18} />
              <strong>{evaluationGates.length}</strong>
              <span>평가 게이트</span>
            </article>
            <article>
              <ShieldCheck size={18} />
              <strong>{securityGates.length}</strong>
              <span>보안 게이트</span>
            </article>
            <article>
              <GitBranch size={18} />
              <strong>{rolloutPhases.length}</strong>
              <span>로드맵 단계</span>
            </article>
          </div>

          <div className="spec-grid">
            <div className="workspace-band spec-roadmap">
              <div className="section-heading compact">
                <h2>6주 도입 로드맵</h2>
                <GitBranch size={22} />
              </div>
              <div className="phase-track">
                {rolloutPhases.map((phase) => (
                  <article key={phase.id}>
                    <span>{phase.id} / {phase.window}</span>
                    <strong>{phase.phase}</strong>
                    <p>{phase.outcome}</p>
                    <ul>
                      {phase.gates.map((gate) => (
                        <li key={gate}>{gate}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className="workspace-band spec-evals">
              <div className="section-heading compact">
                <h2>평가 게이트</h2>
                <ListChecks size={22} />
              </div>
              <div className="eval-list">
                {evaluationGates.map((gate) => (
                  <article key={gate.id}>
                    <div>
                      <strong>{gate.name}</strong>
                      <span>{gate.owner}</span>
                    </div>
                    <p>{gate.metric} / {gate.pass}</p>
                    <em>{gate.evidence}</em>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="workspace-band requirement-panel">
            <div className="section-heading compact">
              <h2>요구사항 추적 매트릭스</h2>
              <Target size={22} />
            </div>
            <div className="requirement-table" role="table" aria-label="enterprise requirement traceability">
              <div className="requirement-row header" role="row">
                <span>요구사항</span>
                <span>Pilot</span>
                <span>운영 전환</span>
                <span>증적</span>
              </div>
              {capabilityRequirements.map((item) => (
                <div className="requirement-row" role="row" key={item.id}>
                  <div>
                    <strong>{item.id}</strong>
                    <p>{item.area} / {item.requirement}</p>
                    <SpecStatus value={item.status} />
                  </div>
                  <span>{item.pilot}</span>
                  <span>{item.production}</span>
                  <span>{item.owner} | {item.evidence}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="spec-grid bottom">
            <div className="workspace-band security-gate-panel">
              <div className="section-heading compact">
                <h2>보안 운영 게이트</h2>
                <ShieldCheck size={22} />
              </div>
              <div className="security-gate-list">
                {securityGates.map((gate) => (
                  <article key={gate.id}>
                    <RiskBadge value={gate.severity} />
                    <div>
                      <strong>{gate.name}</strong>
                      <span>{gate.control}</span>
                      <em>{gate.evidence}</em>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="workspace-band stack-decision-panel">
              <div className="section-heading compact">
                <h2>무료 스택 의사결정</h2>
                <Database size={22} />
              </div>
              <div className="stack-decision-list">
                {stackDecisions.map((decision) => (
                  <article key={decision.id}>
                    <span>{decision.layer}</span>
                    <strong>{decision.freeOption}</strong>
                    <p>{decision.enterprisePath}</p>
                    <em>{decision.constraint}</em>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="workflow-strip">
          {workflowEvents.map((event) => (
            <article key={event.id}>
              <Mail size={18} />
              <div>
                <strong>{event.action}</strong>
                <span>{event.actor} | {event.time} | {event.status}</span>
              </div>
              {event.risk === "중간" ? <AlertTriangle size={18} className="warn-icon" /> : <CheckCircle2 size={18} className="ok-icon" />}
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
