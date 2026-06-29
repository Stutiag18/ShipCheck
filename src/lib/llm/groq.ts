import Groq from "groq-sdk";
import { LLMClient, LLMRequest, LLMResponse } from "@/types/llm";
import { acquireToken } from "./rate-limiter";

const DEFAULT_MODEL = "llama-3.1-8b-instant";
const LARGE_MODEL = "llama-3.3-70b-versatile";

export function createGroqClient(useLargeModel = false): LLMClient {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const groq = new Groq({ apiKey });

  return {
    provider: "groq",
    async generate(request: LLMRequest): Promise<LLMResponse> {
      await acquireToken("groq");

      const modelName = request.model || (useLargeModel ? LARGE_MODEL : DEFAULT_MODEL);
      const completion = await groq.chat.completions.create({
        model: modelName,
        messages: [{ role: "user", content: request.prompt }],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 2048,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content || "";

      return { text, provider: "groq", model: modelName };
    },
  };
}
