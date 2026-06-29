import { generateWithFallback } from "@/lib/llm";
import { buildContentAnalysisPrompt } from "@/lib/prompts/content-analysis";

export interface ContentAnalysis {
  contentType: string;
  targetAudience: string;
  tone: string;
  intent: string;
}

export async function analyzeContent(
  content: string,
  platform?: string,
  goal?: string
): Promise<ContentAnalysis> {
  const prompt = buildContentAnalysisPrompt(content, platform, goal);

  const response = await generateWithFallback({ prompt, temperature: 0.3 });

  const text = response.text.trim();
  let analysis: ContentAnalysis;
  try {
    analysis = JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse content analysis from LLM response");
    }
    analysis = JSON.parse(jsonMatch[0]);
  }

  if (!analysis.contentType || !analysis.targetAudience) {
    throw new Error("Content analysis missing required fields");
  }

  return analysis;
}
