import { generateWithFallback } from "@/lib/llm";
import { buildSeniorSynthesisPrompt } from "@/lib/prompts/senior-synthesis";
import { GeneratedPersona, AgentFeedback, SeniorSynthesis } from "@/types/persona";

interface PersonaWithFeedback {
  persona: GeneratedPersona;
  feedback: AgentFeedback;
}

function toStringField(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item, i) => `${i + 1}. ${item}`).join("\n");
  }
  if (typeof value === "string") return value;
  return String(value);
}

export async function synthesizeFeedback(
  content: string,
  contentType: string,
  targetAudience: string,
  personaFeedbacks: PersonaWithFeedback[],
  platform?: string,
  goal?: string
): Promise<SeniorSynthesis> {
  const prompt = buildSeniorSynthesisPrompt(
    content,
    contentType,
    targetAudience,
    personaFeedbacks,
    platform,
    goal
  );

  const response = await generateWithFallback(
    { prompt, temperature: 0.5, maxTokens: 3000 },
    true
  );

  const text = response.text.trim();
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse senior synthesis from LLM response");
    }
    raw = JSON.parse(jsonMatch[0]);
  }

  const synthesis: SeniorSynthesis = {
    summary: toStringField(raw.summary),
    overallScore: raw.overallScore,
    strengths: toStringField(raw.strengths),
    improvements: toStringField(raw.improvements),
    actionItems: toStringField(raw.actionItems),
    rewrite: raw.rewrite ? toStringField(raw.rewrite) : null,
  };

  if (
    typeof synthesis.overallScore !== "number" ||
    synthesis.overallScore < 1 ||
    synthesis.overallScore > 10
  ) {
    throw new Error("Invalid overall score in synthesis");
  }
  if (!synthesis.summary || !synthesis.strengths || !synthesis.improvements || !synthesis.actionItems) {
    throw new Error("Senior synthesis missing required fields");
  }

  return synthesis;
}
