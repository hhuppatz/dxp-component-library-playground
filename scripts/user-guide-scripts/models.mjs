// scripts/user-guide-scripts/models.mjs
//
// Minimal Anthropic (Claude) chat client used by the CI "once-over" pass (scripts/user-guide-scripts/ci-guide-pass.mjs).
// Zero-dependency: native fetch against the Anthropic Messages API. Auth: ANTHROPIC_API_KEY.
//
// (The original UltraCX pipeline called GitHub Models, which is fully retired on 2026-07-30. This playground copy
// uses the Anthropic Messages API so you can test the migrated pipeline with your own key. It only depends on the
// three exports below — chat()/extractJson()/hasToken() — whose signatures are unchanged, so ci-guide-pass.mjs
// needs no changes regardless of provider.)
//
// Override the model per-run with MODELS_MODEL (e.g. "claude-haiku-4-5" to cut cost for this simple JSON job).
// Override the endpoint with MODELS_ENDPOINT (must be Anthropic Messages-API compatible). Provide the key via
// ANTHROPIC_API_KEY (or MODELS_TOKEN). For a no-token local dry run, ci-guide-pass.mjs supports MODELS_MOCK=1.
const MODEL = process.env.MODELS_MODEL || "claude-haiku-4-5";
const ENDPOINT = process.env.MODELS_ENDPOINT || "https://api.anthropic.com/v1/messages";
const API_VERSION = process.env.ANTHROPIC_VERSION || "2023-06-01";
const TOKEN = process.env.ANTHROPIC_API_KEY || process.env.MODELS_TOKEN;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function stripCodeFences(text) {
  let t = String(text ?? "").trim();
  const fence = t.match(/^```[a-zA-Z]*\s*\n([\s\S]*?)\n```$/);
  if (fence) return fence[1].trim();
  return t.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "").trim();
}

export function extractJson(text) {
  const t = stripCodeFences(text);
  try {
    return JSON.parse(t);
  } catch {}
  const s = t.indexOf("{");
  const e = t.lastIndexOf("}");
  if (s !== -1 && e > s) {
    try {
      return JSON.parse(t.slice(s, e + 1));
    } catch {}
  }
  return null;
}

export function hasToken() {
  return Boolean(TOKEN);
}

export async function chat(messages, { json = false, maxTokens = 4000 } = {}) {
  if (!TOKEN) throw new Error("No ANTHROPIC_API_KEY (or MODELS_TOKEN) found in the environment.");

  // Anthropic takes the system prompt as a top-level `system` field, not a role:"system" turn in messages[].
  // Callers (ci-guide-pass) still build an OpenAI-style [{role:"system"},{role:"user"}] array; split it here so
  // they don't have to change.
  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const convo = messages.filter((m) => m.role !== "system");

  const body = { model: MODEL, max_tokens: maxTokens, messages: convo };
  if (system) body.system = system;

  // Anthropic has no OpenAI-style response_format:{type:"json_object"}. To guarantee valid JSON we force a
  // single tool call: the model MUST answer by populating the tool's input, which the API validates as a JSON
  // object. The prompt supplies the exact keys; we hand the stringified input back so extractJson() parses it
  // trivially (and remains a safety net — ci-guide-pass does `extractJson(raw) || {}`).
  if (json) {
    body.tools = [
      {
        name: "emit_json",
        description: "Return ONLY the JSON object described in the instructions, as this tool's input.",
        input_schema: { type: "object", additionalProperties: true },
      },
    ];
    body.tool_choice = { type: "tool", name: "emit_json" };
  }

  let lastErr;
  for (let attempt = 0; attempt < 4; attempt++) {
    let res;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "x-api-key": TOKEN,
          "anthropic-version": API_VERSION,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      lastErr = e;
      await sleep(1500 * (attempt + 1));
      continue;
    }
    if (res.ok) {
      const data = await res.json();
      const blocks = data.content || [];
      if (json) {
        const tool = blocks.find((b) => b.type === "tool_use");
        if (tool) return JSON.stringify(tool.input ?? {});
      }
      const text = blocks.find((b) => b.type === "text");
      return text?.text ?? "";
    }
    // 429 (rate limit) and 5xx (incl. 529 overloaded) are retryable; Anthropic sends retry-after in seconds.
    if (res.status === 429 || res.status >= 500) {
      const ra = Number(res.headers.get("retry-after"));
      await sleep(Number.isFinite(ra) && ra > 0 ? ra * 1000 : 2000 * (attempt + 1));
      lastErr = new Error("HTTP " + res.status + ": " + (await res.text()));
      continue;
    }
    throw new Error("Anthropic API error " + res.status + ": " + (await res.text()));
  }
  throw lastErr || new Error("Anthropic request failed");
}
