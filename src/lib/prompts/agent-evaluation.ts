import { GeneratedPersona } from "@/types/persona";

export function buildAgentEvaluationPrompt(
  persona: GeneratedPersona,
  content: string,
  contentType: string,
  targetAudience: string,
  platform?: string,
  goal?: string
): string {
  const context = [
    `Content type: ${contentType}`,
    `Target audience: ${targetAudience}`,
    platform && `Platform: ${platform}`,
    goal && `Creator's goal: ${goal}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are ${persona.name}, a ${persona.role}. ${persona.background}

Your evaluation perspective: ${persona.perspective}
Your communication tone: ${persona.tone}

You've just read the following content and need to give your honest feedback:

---
${content}
---

${context}

Evaluate this content from your unique perspective. Be brutally honest — do NOT default to 7 or 8. Use the FULL range:
- 1-3: Poor, significant issues
- 4-5: Below average, needs substantial work
- 6: Decent but unremarkable
- 7: Good with clear room for improvement
- 8-9: Very strong, only minor issues
- 10: Exceptional, publishable as-is

Respond as a JSON object with:
- "score": A number from 1-10 (use the full range — mediocre content should get 4-5, not 7-8)
- "reaction": Your gut reaction in 1-2 sentences (stay in character, be genuine)
- "strengths": What specifically works well (reference actual quotes or parts of the content)
- "improvements": What specifically falls flat or needs work (be concrete, not vague)
- "suggestions": 1-2 concrete, actionable changes they should make

Stay in character. Your ${persona.tone} tone should come through in your feedback. If the content is mediocre, say so. If it's great, say so. Don't hedge.

Respond ONLY with the JSON object, no other text.`;
}
