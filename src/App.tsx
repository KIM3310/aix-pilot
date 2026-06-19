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
  architecturePersonas,
  culturalAdoptionPatterns,
  adoptionMotions,
  servicePackages,
  validationExperiments,
  expansionPaths,
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
import {
  buildOllamaPrompt,
  createOllamaGenerateRequest,
  getFreeRuntimeCards,
  normalizeEndpoint,
  OLLAMA_DEFAULT_ENDPOINT,
  OLLAMA_DEFAULT_MODEL
} from "./lib/freeRuntime";
import { calculateExpansionPath, calculateValueReadiness, formatCount } from "./lib/valueModel";

const sourceOrder = ["고객센터", "사내지식", "보안정책", "운영지표", "영업지원"];
const agentModes: AgentMode[] = ["FAQ 응답", "이메일 생성", "보고서 생성", "업무 자동화"];
const pieColors = ["#11A7A2", "#F36B4F", "#F6B53C", "#6C8FF6"];
const demoScenario =
  "고객이 배송 지연으로 불만을 제기했습니다. 보상 가능 여부와 안내 메일 초안을 만들어줘. 데모 연락처 010-0000-0000은 외부 발송 전에 마스킹해줘.";
const storageKeys = {
  documents: "aix-pilot.documents",
  query: "aix-pilot.query",
  audit: "aix-pilot.audit",
  clientId: "aix-pilot.client-id",
  ollamaEndpoint: "aix-pilot.ollama-endpoint",
  ollamaModel: "aix-pilot.ollama-model"
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

function StepStatus({ status }: { status: "done" | "needs_attention" | "waiting" }) {
  const label = status === "done" ? "완료" : status === "needs_attention" ? "검토" : "대기";
  return <span className={`step-status ${status}`}>{label}</span>;
}

function SpecStatus({ value }: { value: "완료" | "검증" | "확장" }) {
  return <span className={`spec-status spec-${value}`}>{value}</span>;
}

function EvalVerdictBadge({ value }: { value: EvalVerdict }) {
  const label = value === "pass" ? "통과" : value === "needs_attention" ? "검토" : "실패";
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

function getOrCreateClientId() {
  try {
    const existing = localStorage.getItem(storageKeys.clientId);
    if (existing) {
      return existing;
    }
    const next = crypto.randomUUID();
    localStorage.setItem(storageKeys.clientId, next);
    return next;
  } catch {
    return "local-runtime-client";
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
  const [clientId] = useState(getOrCreateClientId);
  const [ollamaEndpoint, setOllamaEndpoint] = useState(() => readStoredValue(storageKeys.ollamaEndpoint, OLLAMA_DEFAULT_ENDPOINT));
  const [ollamaModel, setOllamaModel] = useState(() => readStoredValue(storageKeys.ollamaModel, OLLAMA_DEFAULT_MODEL));
  const [llmStatus, setLlmStatus] = useState("무료 LLM 대기");
  const [llmOutput, setLlmOutput] = useState("");
  const [databaseStatus, setDatabaseStatus] = useState("Cloudflare D1 바인딩 대기");
  const [teamMembers, setTeamMembers] = useState(450);
  const [monthlyWorkflows, setMonthlyWorkflows] = useState(120000);
  const [minutesSavedPerWorkflow, setMinutesSavedPerWorkflow] = useState(7);
  const [approvalSteps, setApprovalSteps] = useState(4);
  const [selectedPackageId, setSelectedPackageId] = useState("PKG-OPERATIONS");

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
  const selectedPackage = servicePackages.find((item) => item.id === selectedPackageId) ?? servicePackages[1];
  const valueCase = useMemo(
    () =>
      calculateValueReadiness({
        teamMembers,
        monthlyWorkflows,
        minutesSavedPerWorkflow,
        approvalSteps
      }),
    [approvalSteps, minutesSavedPerWorkflow, monthlyWorkflows, teamMembers]
  );
  const expansionResults = useMemo(() => expansionPaths.map((path) => ({ ...path, result: calculateExpansionPath(path) })), []);
  const primaryExpansion = expansionResults[0];
  const freeRuntimeCards = useMemo(
    () =>
      getFreeRuntimeCards({
        llmConnected: llmStatus.includes("연결"),
        databaseConnected: databaseStatus.includes("D1 저장"),
        deploymentReady: true
      }),
    [databaseStatus, llmStatus]
  );
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

  useEffect(() => {
    writeStoredValue(storageKeys.ollamaEndpoint, ollamaEndpoint);
  }, [ollamaEndpoint]);

  useEffect(() => {
    writeStoredValue(storageKeys.ollamaModel, ollamaModel);
  }, [ollamaModel]);

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

  async function checkOllama() {
    try {
      const endpoint = normalizeEndpoint(ollamaEndpoint);
      const response = await fetch(`${endpoint}/api/tags`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as { models?: Array<{ name?: string }> };
      const modelCount = data.models?.length ?? 0;
      setLlmStatus(`Ollama 연결 (${modelCount}개 모델)`);
      setToast("무료 로컬 LLM 런타임을 확인했습니다");
    } catch {
      setLlmStatus("Ollama 미연결");
      setToast("Ollama가 아직 실행되지 않았습니다");
    }
  }

  async function runLocalLlm() {
    const prompt = buildOllamaPrompt({ query, answer });
    try {
      setLlmStatus("Ollama 생성 중");
      const endpoint = normalizeEndpoint(ollamaEndpoint);
      const response = await fetch(`${endpoint}/api/generate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(createOllamaGenerateRequest(ollamaModel, prompt))
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as { response?: string };
      setLlmOutput(maskSensitive(data.response || "로컬 모델 응답이 비어 있습니다."));
      setLlmStatus("Ollama 연결");
      setToast("무료 로컬 LLM 요약을 생성했습니다");
    } catch {
      try {
        setLlmStatus("Workers AI 생성 중");
        const response = await fetch("/api/llm", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt })
        });
        const data = (await response.json()) as { status?: string; response?: string; provider?: string };
        if (!response.ok || data.status !== "ok") {
          throw new Error(data.status || `HTTP ${response.status}`);
        }
        setLlmOutput(maskSensitive(data.response || "Cloudflare Workers AI 응답이 비어 있습니다."));
        setLlmStatus("Workers AI 연결");
        setToast("무료 Cloudflare Workers AI 요약을 생성했습니다");
      } catch {
        setLlmStatus("무료 LLM 미연결");
        setLlmOutput("Ollama 또는 Cloudflare Workers AI 연결이 필요합니다. 연결 전에는 규칙 기반 RAG/Agent가 그대로 동작합니다.");
        setToast("무료 LLM 연결을 확인해주세요");
      }
    }
  }

  async function syncCloudDatabase() {
    try {
      const response = await fetch("/api/workspace", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-aix-client-id": clientId
        },
        body: JSON.stringify({ documents, auditEvents: auditLog })
      });
      const data = (await response.json()) as { status?: string; stored?: { documents?: number; auditEvents?: number } };
      if (!response.ok || data.status !== "ok") {
        throw new Error(data.status || `HTTP ${response.status}`);
      }
      setDatabaseStatus(`D1 저장 완료: 문서 ${data.stored?.documents ?? 0}건 / 감사 ${data.stored?.auditEvents ?? 0}건`);
      setToast("무료 Cloudflare D1에 워크스페이스를 저장했습니다");
    } catch {
      setDatabaseStatus("D1 미연결: 로컬 저장소 사용 중");
      setToast("D1 바인딩 전이라 브라우저 로컬 DB로 유지합니다");
    }
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
            <span>Pilot Ops Console</span>
          </div>
        </div>
        <nav>
          {[
            ["command", Gauge, "Command"],
            ["trust", LockKeyhole, "Trust"],
            ["value", Layers3, "Value"],
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
              Enterprise AI Pilot Console
            </div>
            <h1>기업 지식 검색과 업무 초안을 한 흐름에서 검증합니다</h1>
            <p className="hero-subcopy">
              문서 검색, 응답 초안, 보안 마스킹, 평가 리포트를 하나의 파일럿 워크스페이스에서 확인하고 운영 전환 기준을 숫자로 남깁니다.
            </p>
            <div className="top-actions">
              <button type="button" className="icon-button" title="파일럿 실행" onClick={runDemoScenario}>
                <Play size={18} />
                <span>Run Demo</span>
              </button>
              <button type="button" className="icon-button ghost" title="보고서 생성" onClick={exportReport}>
                <Download size={18} />
                <span>Export Report</span>
              </button>
              <button type="button" className="icon-button ghost" title="초기화" onClick={resetWorkspace}>
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            </div>
            <div className="hero-proof-row" aria-label="pilot proof summary">
              <span>Eval {evaluationRun.overallScore}</span>
              <span>Spec {specScore}%</span>
              <span>Service {serviceReadiness.score}</span>
              <span>Value {valueCase.readinessSignal}</span>
              <span>문서 {documents.length}건</span>
              <span>위험 {latestRisk}</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="AIX Pilot product visual">
            <div className="product-preview" aria-label="AIX Pilot live product preview">
              <div className="preview-sidebar">
                <span>AIX</span>
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="preview-main">
                <div className="preview-toolbar">
                  <span>운영 준비도 {serviceReadiness.score}</span>
                  <span>Eval {evaluationRun.overallScore}</span>
                  <span>PII 0건</span>
                </div>
                <div className="preview-grid">
                  <article className="preview-card wide">
                    <span>RAG Command</span>
                    <strong>고객 보상 가능 여부와 근거 문서 확인</strong>
                    <p>근거 문서 {answer.citations.length}개 · 신뢰도 {answer.confidence}%</p>
                    <div className="preview-answer">
                      <i />
                      <em>{answer.answer.slice(0, 74)}...</em>
                    </div>
                  </article>
                  <article className="preview-card">
                    <span>Agent Studio</span>
                    <strong>{agentDraft.requiresApproval ? "승인 필요" : "자동 처리 가능"}</strong>
                    <p>{agentDraft.title}</p>
                  </article>
                  <article className="preview-card">
                    <span>Trust Queue</span>
                    <strong>{latestRisk}</strong>
                    <p>DLP 마스킹과 승인 정책 적용</p>
                  </article>
                  <article className="preview-card chart">
                    <span>KPI Trend</span>
                    <div className="preview-bars" aria-hidden="true">
                      <i style={{ height: "62%" }} />
                      <i style={{ height: "88%" }} />
                      <i style={{ height: "54%" }} />
                      <i style={{ height: "72%" }} />
                      <i style={{ height: "46%" }} />
                    </div>
                  </article>
                </div>
              </div>
            </div>
            <div className="visual-glass-card visual-score">
              <span>Evaluation</span>
              <strong>{evaluationRun.overallScore}</strong>
              <small>{evaluationRun.passCount} 통과 / {evaluationRun.failCount} 실패</small>
            </div>
            <div className="visual-glass-card visual-motion">
              <img src="/brand/aix-motion.gif" width={1280} height={720} decoding="async" alt="AIX Pilot 운영 흐름 애니메이션" />
              <span>운영 흐름</span>
            </div>
          </div>
        </header>

        <section className="signal-grid" aria-label="pilot signals">
          <article>
            <span>파일럿 상태</span>
            <strong>운영 준비도 {readinessScore}%</strong>
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
              <p className="eyebrow">Operating Proof</p>
              <h2>화면 시연보다 운영 증거를 먼저 보여줍니다</h2>
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
              무료 기준
            </span>
            <span>
              <Eye size={16} />
              근거 중심
            </span>
            <span>
              <LockKeyhole size={16} />
              개인정보 마스킹
            </span>
            <span>
              <GitBranch size={16} />
              QA 자동화
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
                <h2>운영 전환 리스크</h2>
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
                  <span>현재 데모 입력 기준 운영 전환을 막는 고위험 리스크가 없습니다.</span>
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

        <section className="value-section" id="value">
          <div className="section-heading value-heading">
            <div>
              <p className="eyebrow">Value Readiness</p>
              <h2>공개 가격표 없이 업무 가치, 승인 근거, 운영 리소스를 정리합니다</h2>
            </div>
            <div className={`readiness-signal readiness-${valueCase.readinessSignal}`}>
              <Layers3 size={20} />
              <strong>{valueCase.readinessSignal}</strong>
              <span>운영 전환 신호</span>
            </div>
          </div>

          <div className="value-command">
            <article className="value-case">
              <span>Executive readiness case</span>
              <strong>월 {formatCount(valueCase.monthlySavedHours)}h 반복 업무 회수 후보</strong>
              <p>{valueCase.anchorMessage}</p>
              <div className="value-kpi-row">
                <article>
                  <TrendingUp size={18} />
                  <strong>{formatCount(valueCase.weeklyCheckpointLoad)}</strong>
                  <span>주간 체크 단위</span>
                </article>
                <article>
                  <Gauge size={18} />
                  <strong>{formatCount(valueCase.monthlySavedHours)}h</strong>
                  <span>월 회수 시간</span>
                </article>
                <article>
                  <Rocket size={18} />
                  <strong>{approvalSteps}</strong>
                  <span>승인 단계</span>
                </article>
                <article>
                  <Building2 size={18} />
                  <strong>{valueCase.recommendedPackage}</strong>
                  <span>권장 범위</span>
                </article>
              </div>
            </article>

            <div className="value-controls">
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
                label="승인 단계"
                value={approvalSteps}
                min={1}
                max={8}
                step={1}
                suffix="단계"
                onChange={setApprovalSteps}
              />
            </div>
          </div>

          <div className="expansion-board">
            <article className="expansion-main">
              <span>확장 경로</span>
              <strong>{primaryExpansion.result.targetTeams}개 운영 단위부터 확장 검증</strong>
              <p>{primaryExpansion.whyItCanReach}</p>
              <div>
                <span>대표 워크플로우 {formatCount(primaryExpansion.result.workflowFootprint)}개</span>
                <span>{primaryExpansion.resourceFocus}</span>
                <span>{primaryExpansion.channel}</span>
              </div>
            </article>
            <div className="target-vertical-list">
              {targetVerticals.map((vertical) => (
                <article key={vertical.id}>
                  <span>{vertical.market}</span>
                  <strong>{vertical.wedgeWorkflow}</strong>
                  <p>{vertical.whyNow}</p>
                  <em>{vertical.approvalOwner} / {vertical.adoptionTrigger}</em>
                </article>
              ))}
            </div>
          </div>

          <div className="package-grid">
            {servicePackages.map((servicePackage) => (
              <article className={`package-card ${selectedPackage.id === servicePackage.id ? "active" : ""}`} key={servicePackage.id}>
                <div className="package-head">
                  <div>
                    <span>{servicePackage.architecture}</span>
                    <strong>{servicePackage.name}</strong>
                  </div>
                  {servicePackage.recommended ? <em>추천</em> : null}
                </div>
                <p>{servicePackage.promise}</p>
                <div className="package-line">
                  <strong>{servicePackage.usage}</strong>
                  <span>{servicePackage.resources.join(" / ")}</span>
                </div>
                <ul>
                  {servicePackage.resources.map((resource) => (
                    <li key={resource}>{resource}</li>
                  ))}
                </ul>
                <button type="button" onClick={() => setSelectedPackageId(servicePackage.id)} title={`${servicePackage.name} 범위 선택`}>
                  <span>{selectedPackage.id === servicePackage.id ? "선택됨" : "선택"}</span>
                </button>
                <small>{servicePackage.activationGate}</small>
              </article>
            ))}
          </div>

          <div className="expansion-scenario-grid">
            {expansionResults.map((path) => (
              <article key={path.id}>
                <span>{path.name}</span>
                <strong>{formatCount(path.result.workflowFootprint)}개 workflow footprint</strong>
                <p>{path.wedge}</p>
                <em>{path.result.checkpointCadence} / {path.resourceFocus}</em>
              </article>
            ))}
          </div>

          <div className="architecture-grid">
            <div className="workspace-band architecture-panel">
              <div className="section-heading compact">
                <h2>검토자 관점</h2>
                <Users size={22} />
              </div>
              <div className="architecture-list">
                {architecturePersonas.map((persona) => (
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
                <h2>전환 설계</h2>
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

          <div className="validation-strip">
            {adoptionMotions.map((motion) => (
              <article key={motion.id}>
                <span>{motion.stage}</span>
                <strong>{motion.action}</strong>
                <p>{motion.metric}</p>
                <em>enterprise adoption motion</em>
              </article>
            ))}
          </div>

          <div className="validation-strip">
            {validationExperiments.map((experiment) => (
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
            <div className="free-runtime-grid" aria-label="free runtime status">
              {freeRuntimeCards.map((item) => (
                <article className={`runtime-card runtime-${item.status}`} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <em>{item.detail}</em>
                </article>
              ))}
            </div>
            <div className="free-runtime-panel">
              <article>
                <div className="runtime-panel-head">
                  <Bot size={18} />
                  <strong>무료 LLM</strong>
                  <span>{llmStatus}</span>
                </div>
                <label className="plain-label">
                  <span>Endpoint</span>
                  <input className="plain-input" value={ollamaEndpoint} onChange={(event) => setOllamaEndpoint(event.target.value)} />
                </label>
                <label className="plain-label">
                  <span>Model</span>
                  <input className="plain-input" value={ollamaModel} onChange={(event) => setOllamaModel(event.target.value)} />
                </label>
                <div className="runtime-actions">
                  <button type="button" className="icon-button ghost" onClick={checkOllama}>
                    <Eye size={17} />
                    <span>확인</span>
                  </button>
                  <button type="button" className="icon-button" onClick={runLocalLlm}>
                    <Sparkles size={17} />
                    <span>요약</span>
                  </button>
                </div>
                <p className="runtime-output">{llmOutput || "연결되면 현재 RAG 답변을 무료 모델로 재요약합니다."}</p>
              </article>
              <article>
                <div className="runtime-panel-head">
                  <Database size={18} />
                  <strong>무료 Cloudflare D1</strong>
                  <span>{databaseStatus}</span>
                </div>
                <div className="database-proof-row">
                  <span>Client {clientId.slice(0, 8)}</span>
                  <span>문서 {documents.length}건</span>
                  <span>감사 {auditLog.length}건</span>
                </div>
                <button type="button" className="full-button" onClick={syncCloudDatabase}>
                  <UploadCloud size={17} />
                  <span>D1 저장</span>
                </button>
                <p className="runtime-output">D1 바인딩 전에는 브라우저 로컬 저장소가 무료 fallback으로 유지됩니다.</p>
              </article>
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
                  {evaluationRun.passCount} 통과 / {evaluationRun.attentionCount} 검토 / {evaluationRun.failCount} 실패
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
                  <span>Readiness Signal</span>
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
