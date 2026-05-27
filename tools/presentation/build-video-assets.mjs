#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const videoDir = path.resolve("outputs/aix-pilot-presentation/video");
const textDir = path.join(videoDir, "texts");
const audioDir = path.join(videoDir, "audio");
const previewDir = path.resolve("outputs/aix-pilot-presentation/previews");

const scenes = [
  {
    id: "01",
    slide: "slide-01.png",
    title: "AIX Pilot 소개",
    subtitle: "무료 운영 스택까지 연결한\n기업용 AI 파일럿 콘솔",
    narration:
      "안녕하세요. AIX Pilot은 기업용 생성형 AI 도입을 위한 RAG, Agent, 보안, KPI 대시보드 통합 플랫폼입니다. 단순한 챗봇 데모가 아니라, 무료 LLM과 Cloudflare Pages, D1 데이터베이스까지 연결해서 운영 흐름을 확인할 수 있는 파일럿 결과물로 만들었습니다."
  },
  {
    id: "02",
    slide: "slide-02.png",
    title: "타깃과 문제",
    subtitle: "첫 구매자는\n예산과 리스크가 만나는 곳에 있습니다",
    narration:
      "타깃은 규제 산업의 고객센터와 사내 운영 조직입니다. 이들은 문서가 흩어져 상담 품질이 흔들리고, AI 피오씨가 많아도 보안 승인과 운영 전환 기준이 부족합니다. 그래서 AIX Pilot은 기능 설명보다, 반복 업무 하나에서 절감액과 리스크 통제를 동시에 증명하는 구조로 설계했습니다."
  },
  {
    id: "03",
    slide: "slide-03.png",
    title: "제품 구조",
    subtitle: "검색, 보안, Agent, KPI가\n하나의 운영 판단식으로 연결됩니다",
    narration:
      "제품 구조는 다섯 단계입니다. 문서를 권한과 민감도 기준으로 색인하고, RAG가 근거와 Citation을 분리해 답변합니다. 그 다음 DLP와 프롬프트 인젝션 가드가 위험을 막고, Agent는 이메일과 보고서 초안을 만들되 외부 발송은 휴먼 승인에 묶습니다. 마지막으로 KPI가 운영 전환 여부를 숫자로 보여줍니다."
  },
  {
    id: "04",
    slide: "slide-04.png",
    title: "실서비스 결과물",
    subtitle: "배포된 화면에서\n대시보드와 RAG, Agent가 바로 움직입니다",
    narration:
      "여기 보이는 화면은 실제로 배포된 AIX Pilot 서비스입니다. 대시보드에는 검색 품질, 자동화율, 보안 차단, 절감 시간이 함께 보이고, RAG 콘솔에서는 질문과 근거 문서가 연결됩니다. Agent Studio는 고객 응대 초안을 만들지만, 위험한 작업은 승인 흐름으로 남겨 기업 환경에 맞게 통제합니다."
  },
  {
    id: "05",
    slide: "slide-05.png",
    title: "보안과 신뢰",
    subtitle: "기업 AI에서 먼저 통과해야 하는 것은\n답변보다 신뢰입니다",
    narration:
      "기업 AI에서 가장 중요한 것은 보안과 신뢰입니다. AIX Pilot은 개인정보와 비밀값을 마스킹하고, 정책 우회나 시스템 프롬프트 유출 요청을 고위험으로 분류합니다. 환불, 외부 발송, 권한 변경 같은 작업은 자동 완료하지 않고 사람 승인을 거치며, 감사 로그로 근거를 남깁니다."
  },
  {
    id: "06",
    slide: "slide-06.png",
    title: "무료 운영 스택",
    subtitle: "LLM, 배포, 데이터베이스를\n모두 무료 기준으로 구성했습니다",
    narration:
      "운영 스택은 무료 기준으로 맞췄습니다. 로컬에서는 Ollama qwen 모델을 쓰고, 배포 환경에서는 Cloudflare Workers AI를 폴백으로 사용할 수 있습니다. 프런트엔드는 Cloudflare Pages에 배포했고, 워크스페이스 저장은 Cloudflare D1과 브라우저 로컬 저장소를 함께 둬서 비용 없이도 재현 가능한 데모가 됩니다."
  },
  {
    id: "07",
    slide: "slide-07.png",
    title: "수익화 구조",
    subtitle: "가격은 기능 수보다\n절감액과 승인 근거에서 결정됩니다",
    narration:
      "수익화는 고가 B2B 파일럿으로 잡았습니다. 엔터프라이즈 패키지는 월 이천구백만 원과 셋업 비용을 기준으로 설계했고, 열 개 계정이면 월 이억 구천만 원 이상의 MRR 시나리오가 나옵니다. 핵심은 가격표를 먼저 보여주는 것이 아니라, 시간 절감과 리스크 회피액이 계약 금액보다 충분히 크다는 근거를 만드는 것입니다."
  },
  {
    id: "08",
    slide: "slide-08.png",
    title: "프로젝트 계획과 검증",
    subtitle: "6주 파일럿 계획과\n자동 QA 루틴까지 준비했습니다",
    narration:
      "실제 파일럿 전환 계획은 6주입니다. 첫 주에는 반복 업무 하나를 고정하고, 둘째 주에는 문서 메타데이터를 정리합니다. 셋째와 넷째 주에는 RAG와 Agent를 골든 질문셋으로 검증하고, 다섯째 주에는 보안 리뷰를 진행합니다. 여섯째 주에는 ROI와 품질, 리스크를 하나의 Go No-Go 리포트로 제출합니다."
  },
  {
    id: "09",
    slide: "slide-09.png",
    title: "최종 결과",
    subtitle: "AIX Pilot은 이제\n검증 가능한 서비스입니다",
    narration:
      "최종적으로 AIX Pilot은 RAG, Agent, 보안, 평가, KPI, 수익화, 무료 운영 스택이 연결된 검증 가능한 서비스가 되었습니다. 이 프로젝트의 핵심은 생성형 AI 기능을 만든 것이 아니라, 기업이 실제로 도입을 승인할 수 있는 운영 모델을 제품화했다는 점입니다. 감사합니다."
  }
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", ...options });
  if (result.status !== 0) {
    throw new Error(
      [`${command} ${args.join(" ")} failed`, result.stdout?.trim(), result.stderr?.trim()]
        .filter(Boolean)
        .join("\n")
    );
  }
  return result.stdout || "";
}

function parseDuration(afinfoOutput) {
  const match = afinfoOutput.match(/estimated duration:\s*([0-9.]+)\s*sec/i);
  if (!match) return 0;
  return Number.parseFloat(match[1]);
}

function srtTime(seconds) {
  const ms = Math.round(seconds * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const mm = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(mm).padStart(3, "0")}`;
}

async function main() {
  await fs.mkdir(textDir, { recursive: true });
  await fs.mkdir(audioDir, { recursive: true });

  const enriched = [];
  let cursor = 0;
  const narrationLines = [];
  const srtBlocks = [];

  for (const scene of scenes) {
    const textPath = path.join(textDir, `scene-${scene.id}.txt`);
    const audioPath = path.join(audioDir, `scene-${scene.id}.aiff`);
    await fs.writeFile(textPath, `${scene.narration}\n`, "utf8");
    run("say", ["-v", "Yuna", "-r", "172", "-o", audioPath, "-f", textPath], { cwd: root });
    const info = run("afinfo", [audioPath], { cwd: root });
    const audioDuration = parseDuration(info);
    if (!(audioDuration > 0)) throw new Error(`TTS audio is empty: ${audioPath}`);
    const duration = Math.max(13, audioDuration + 0.75);
    const start = cursor;
    const end = cursor + duration;
    enriched.push({
      ...scene,
      image: path.join(previewDir, scene.slide),
      audio: audioPath,
      textPath,
      audioDuration,
      duration,
      start,
      end
    });
    narrationLines.push(`[${scene.id}] ${scene.title}\n${scene.narration}`);
    srtBlocks.push(`${Number(scene.id)}\n${srtTime(start)} --> ${srtTime(end)}\n${scene.subtitle}\n`);
    cursor = end;
  }

  const scenesPath = path.join(videoDir, "video-scenes.json");
  await fs.writeFile(scenesPath, `${JSON.stringify({ width: 1920, height: 1080, fps: 24, scenes: enriched }, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(videoDir, "AIX-Pilot-5min-Subtitles.srt"), `${srtBlocks.join("\n")}\n`, "utf8");
  await fs.writeFile(path.join(videoDir, "AIX-Pilot-5min-Narration.txt"), `${narrationLines.join("\n\n")}\n`, "utf8");
  await fs.writeFile(
    path.join(videoDir, "video-asset-manifest.json"),
    `${JSON.stringify({ scenesPath, totalDuration: cursor, sceneCount: enriched.length }, null, 2)}\n`,
    "utf8"
  );

  console.log(JSON.stringify({ scenesPath, totalDuration: cursor, sceneCount: enriched.length }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
