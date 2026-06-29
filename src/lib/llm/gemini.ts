import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMClient, LLMRequest, LLMResponse } from "@/types/llm";
import { acquireToken } from "./rate-limiter";

const DEFAULT_MODEL = "gemini-2.0-flash";

export function createGeminiClient(): LLMClient {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const genAI = new GoogleGenerativeAI(apiKey);

  return {
    provider: "gemini",
    async generate(request: LLMRequest): Promise<LLMResponse> {
      await acquireToken("gemini");

      const modelName = request.model || DEFAULT_MODEL;
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: request.temperature ?? 0.7,
          maxOutputTokens: request.maxTokens ?? 2048,
        },
      });

      const result = await model.generateContent(request.prompt);
      const text = result.response.text();

      return { text, provider: "gemini", model: modelName };
    },
  };
}
