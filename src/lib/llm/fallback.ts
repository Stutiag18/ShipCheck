import { LLMClient, LLMRequest, LLMResponse } from "@/types/llm";
import { createGeminiClient } from "./gemini";
import { createGroqClient } from "./groq";
import { createOpenRouterClient } from "./openrouter";
import { createDemoClient } from "./demo";

const MAX_RETRIES = 2;
const BASE_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasApiKeys(): boolean {
  return !!(process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY);
}

async function attemptWithRetry(
  client: LLMClient,
  request: LLMRequest,
  retries: number = MAX_RETRIES
): Promise<LLMResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await client.generate(request);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < retries) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

export async function generateWithFallback(
  request: LLMRequest,
  useLargeModel = false
): Promise<LLMResponse> {
  // If no API keys configured, use demo mode
  if (!hasApiKeys()) {
    const demo = createDemoClient();
    return demo.generate(request);
  }

  // Try Groq first (fastest, not blocked)
  if (process.env.GROQ_API_KEY) {
    try {
      const groq = createGroqClient(useLargeModel);
      return await attemptWithRetry(groq, request, MAX_RETRIES);
    } catch (error) {
      console.error("[LLM] Groq failed:", error instanceof Error ? error.message : error);
      // Fall through to other providers
    }
  }

  // Try Gemini
  if (process.env.GEMINI_API_KEY) {
    try {
      const gemini = createGeminiClient();
      return await attemptWithRetry(gemini, request, 1);
    } catch (error) {
      console.error("[LLM] Gemini failed:", error instanceof Error ? error.message : error);
    }
  }

  // Try OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const openrouter = createOpenRouterClient(useLargeModel);
      return await attemptWithRetry(openrouter, request, 1);
    } catch (error) {
      console.error("[LLM] OpenRouter failed:", error instanceof Error ? error.message : error);
    }
  }

  // Final fallback to demo
  const demo = createDemoClient();
  return demo.generate(request);
}
