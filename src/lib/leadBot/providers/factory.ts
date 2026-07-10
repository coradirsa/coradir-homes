import type { LLMMessage, LLMProvider, LLMProviderConfig } from "./types";

const DEFAULT_TIMEOUT_MS = 4500;

function getTimeoutMs(value?: number | string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

class OpenAICompatibleProvider implements LLMProvider {
  constructor(
    private readonly config: Required<Pick<LLMProviderConfig, "model" | "baseUrl" | "apiKey" | "timeoutMs">> &
      Pick<LLMProviderConfig, "disableThinking">
  ) {}

  async generateText(messages: LLMMessage[]) {
    const response = await fetchWithTimeout(
      `${this.config.baseUrl.replace(/\/+$/, "")}/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: 0.2,
          // Los modelos GLM de Z.ai razonan por defecto y tardan >20s; para chat se desactiva.
          ...(this.config.disableThinking ? { thinking: { type: "disabled" } } : {}),
        }),
      },
      this.config.timeoutMs
    );

    if (!response.ok) {
      throw new Error(`LLM provider respondio ${response.status}`);
    }

    const data = await response.json();
    return String(data?.choices?.[0]?.message?.content || "").trim();
  }
}

class GeminiProvider implements LLMProvider {
  constructor(private readonly config: Required<Pick<LLMProviderConfig, "model" | "apiKey" | "timeoutMs">>) {}

  async generateText(messages: LLMMessage[]) {
    const prompt = messages.map((message) => `${message.role}: ${message.content}`).join("\n\n");
    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.config.model)}:generateContent?key=${encodeURIComponent(this.config.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2 },
        }),
      },
      this.config.timeoutMs
    );

    if (!response.ok) {
      throw new Error(`Gemini respondio ${response.status}`);
    }

    const data = await response.json();
    return String(data?.candidates?.[0]?.content?.parts?.[0]?.text || "").trim();
  }
}

class OllamaProvider implements LLMProvider {
  constructor(private readonly config: Required<Pick<LLMProviderConfig, "model" | "baseUrl" | "timeoutMs">>) {}

  async generateText(messages: LLMMessage[]) {
    const response = await fetchWithTimeout(
      `${this.config.baseUrl.replace(/\/+$/, "")}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          stream: false,
        }),
      },
      this.config.timeoutMs
    );

    if (!response.ok) {
      throw new Error(`Ollama respondio ${response.status}`);
    }

    const data = await response.json();
    return String(data?.message?.content || "").trim();
  }
}

export function createLLMProvider(config: LLMProviderConfig = {}): LLMProvider | null {
  const provider = (config.provider || process.env.LEAD_BOT_LLM_PROVIDER || "").toLowerCase();
  const model = config.model || process.env.LEAD_BOT_LLM_MODEL || "";
  const baseUrl = config.baseUrl || process.env.LEAD_BOT_LLM_BASE_URL || "";
  const apiKey = config.apiKey || process.env.LEAD_BOT_LLM_API_KEY || "";
  const timeoutMs = getTimeoutMs(config.timeoutMs || process.env.LEAD_BOT_LLM_TIMEOUT_MS);
  const disableThinking = config.disableThinking ?? process.env.LEAD_BOT_LLM_DISABLE_THINKING === "true";

  if (!provider || !model) return null;

  if (provider === "gemini") {
    if (!apiKey) return null;
    return new GeminiProvider({ model, apiKey, timeoutMs });
  }

  if (provider === "ollama") {
    return new OllamaProvider({ model, baseUrl: baseUrl || "http://localhost:11434", timeoutMs });
  }

  if (!apiKey) return null;

  return new OpenAICompatibleProvider({
    model,
    baseUrl: baseUrl || "https://api.openai.com/v1",
    apiKey,
    timeoutMs,
    disableThinking,
  });
}
