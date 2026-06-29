import { generateWithFallback } from "@/lib/llm";
import { buildAgentEvaluationPrompt } from "@/lib/prompts/agent-evaluation";
import { GeneratedPersona, AgentFeedback } from "@/types/persona";

function toStringField(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item, i) => `${i + 1}. ${item}`).join("\n");
  }
  if (typeof value === "string") return value;
  return String(value);
}

export async function evaluateAsAgent(
  persona: GeneratedPersona,
  content: string,
  contentType: string,
  targetAudience: string,
  platform?: string,
  goal?: string
): Promise<AgentFeedback> {
  const prompt = buildAgentEvaluationPrompt(
    persona,
    content,
    contentType,
    targetAudience,
    platform,
    goal
  );

  const response = await generateWithFallback({ prompt, temperature: 0.9 });

  const text = response.text.trim();
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse agent feedback from LLM response");
    }
    raw = JSON.parse(jsonMatch[0]);
  }

  const feedback: AgentFeedback = {
    score: raw.score,
    reaction: toStringField(raw.reaction),
    strengths: toStringField(raw.strengths),
    improvements: toStringField(raw.improvements),
    suggestions: toStringField(raw.suggestions),
  };

  if (
    typeof feedback.score !== "number" ||
    feedback.score < 1 ||
    feedback.score > 10
  ) {
    throw new Error("Invalid score in agent feedback");
  }
  if (!feedback.reaction || !feedback.strengths || !feedback.improvements || !feedback.suggestions) {
    throw new Error("Agent feedback missing required fields");
  }

  return feedback;
}
