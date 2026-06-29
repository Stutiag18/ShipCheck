import { GeneratedPersona, AgentFeedback } from "@/types/persona";

interface PersonaWithFeedback {
  persona: GeneratedPersona;
  feedback: AgentFeedback;
}

export function buildSeniorSynthesisPrompt(
  content: string,
  contentType: string,
  targetAudience: string,
  personaFeedbacks: PersonaWithFeedback[],
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

  const feedbackSummary = personaFeedbacks
    .map(
      ({ persona, feedback }) =>
        `**${persona.name}** (${persona.role}, perspective: ${persona.perspective})
Score: ${feedback.score}/10
Reaction: ${feedback.reaction}
Strengths: ${feedback.strengths}
Improvements: ${feedback.improvements}
Suggestions: ${feedback.suggestions}`
    )
    .join("\n\n");

  return `You are a senior content strategist with 20+ years of experience. You've assembled a panel of diverse reviewers to evaluate a piece of content. Your job is to synthesize their feedback into a clear, actionable report.

## Original Content
---
${content}
---

## Context
${context}

## Panel Feedback
${feedbackSummary}

---

Now synthesize all feedback into a comprehensive report. Consider:
- Where do reviewers agree? (high-signal feedback)
- Where do they disagree? (perspective-dependent feedback)
- What's the overall quality level?
- What are the highest-impact improvements?

Respond as a JSON object with:
- "summary": A 2-3 sentence executive summary of the content's quality and main takeaway
- "overallScore": A weighted score from 1-10 (not just an average - weight by relevance of each persona's perspective to the target audience)
- "strengths": The top 3-4 strengths that multiple reviewers identified (as a single string with bullet points using \\n)
- "improvements": The top 3-4 improvements prioritized by impact (as a single string with bullet points using \\n)
- "actionItems": 3-5 specific, actionable next steps the creator should take (as a single string with numbered items using \\n)
- "rewrite": If the content could significantly benefit from restructuring, provide a brief rewritten version or outline. If the content is already strong, set this to null.

Respond ONLY with the JSON object, no other text.`;
}
