import { LLMClient, LLMRequest, LLMResponse } from "@/types/llm";

export function createOpenRouterClient(useLargeModel = false): LLMClient {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const model = useLargeModel
    ? "google/gemini-2.0-flash-001"
    : "google/gemini-2.0-flash-001";

  return {
    provider: "openrouter",
    async generate(request: LLMRequest): Promise<LLMResponse> {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://opinion-bot.vercel.app",
          "X-Title": "Opinion Bot",
        },
        body: JSON.stringify({
          model: request.model || model,
          messages: [{ role: "user", content: request.prompt }],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens || 2048,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter error (${response.status}): ${err}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || "";

      return {
        text,
        provider: "openrouter",
        model: data.model || model,
      };
    },
  };
}
