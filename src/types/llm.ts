export type LLMProvider = "gemini" | "groq" | "openrouter";

export interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMResponse {
  text: string;
  provider: LLMProvider;
  model: string;
}

export interface LLMClient {
  provider: LLMProvider;
  generate(request: LLMRequest): Promise<LLMResponse>;
}
