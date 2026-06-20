const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });
}

function extractText(result) {
  if (!result) return "";
  const choice = Array.isArray(result.choices) ? result.choices[0] : undefined;
  const content = choice?.message?.content;
  if (typeof content === "string") return content;
  if (typeof result.response === "string") return result.response;
  if (typeof result.answer === "string") return result.answer;
  if (typeof result.text === "string") return result.text;
  return JSON.stringify(result);
}

async function runOpenRouter(env, prompt) {
  const apiKey = String(env.OPENROUTER_API_KEY || "").trim();
  if (!apiKey) return null;

  const model = String(env.OPENROUTER_MODEL || "google/gemini-3.5-flash").trim();
  const referer = String(env.OPENROUTER_HTTP_REFERER || "https://aix-pilot.pages.dev").trim();
  const title = String(env.OPENROUTER_APP_TITLE || "AIX Pilot").trim();

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${apiKey}`,
      "content-type": "application/json",
      "http-referer": referer,
      "x-openrouter-title": title
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are the AIX Pilot enterprise adoption copilot. Answer with concise, implementation-ready Korean unless the user asks otherwise."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 560
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    return {
      status: "upstream_error",
      provider: "openrouter",
      model,
      response: `OpenRouter request failed: ${response.status} ${detail.slice(0, 240)}`
    };
  }

  const result = await response.json();
  return {
    status: "ok",
    provider: "openrouter",
    model,
    response: extractText(result)
  };
}

export async function onRequestPost(context) {
  const prompt = await promptFromRequest(context.request);

  if (!prompt.trim()) {
    return json({ status: "invalid_prompt", message: "Prompt is required." }, { status: 400 });
  }

  const openRouterResult = await runOpenRouter(context.env || {}, prompt);
  if (openRouterResult) {
    return json(openRouterResult, openRouterResult.status === "ok" ? {} : { status: 502 });
  }

  if (!context.env || !context.env.AI) {
    return json({ status: "unconfigured", message: "AI binding is not configured." }, { status: 503 });
  }

  const result = await context.env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    prompt,
    max_tokens: 360,
    temperature: 0.2
  });

  return json({
    status: "ok",
    provider: "cloudflare-workers-ai",
    model: "@cf/meta/llama-3.1-8b-instruct",
    response: extractText(result)
  });
}

async function promptFromRequest(request) {
  const payload = await request.json();
  return String(payload.prompt || "").slice(0, 6000);
}
