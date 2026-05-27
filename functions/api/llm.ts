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
  if (typeof result.response === "string") return result.response;
  if (typeof result.answer === "string") return result.answer;
  if (typeof result.text === "string") return result.text;
  return JSON.stringify(result);
}

export async function onRequestPost(context) {
  if (!context.env || !context.env.AI) {
    return json({ status: "unconfigured", message: "AI binding is not configured." }, { status: 503 });
  }

  const payload = await context.request.json();
  const prompt = String(payload.prompt || "").slice(0, 6000);

  if (!prompt.trim()) {
    return json({ status: "invalid_prompt", message: "Prompt is required." }, { status: 400 });
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
