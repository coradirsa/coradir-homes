export type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LLMProvider = {
  generateText(messages: LLMMessage[]): Promise<string>;
};

export type LLMProviderConfig = {
  provider?: string;
  model?: string;
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
  disableThinking?: boolean;
};
