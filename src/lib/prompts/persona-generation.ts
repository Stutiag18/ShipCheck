export function buildPersonaGenerationPrompt(
  contentType: string,
  targetAudience: string,
  agentCount: number = 5,
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

  return `You are a casting director for a content feedback panel. Generate ${agentCount} diverse personas who would realistically encounter this type of content. Each persona should bring a unique perspective relevant to the target audience.

${context}

Generate exactly ${agentCount} personas as a JSON array. Each persona must have:
- "name": A realistic first name
- "role": Their professional role or identity (e.g., "Marketing Manager", "College Student", "Retired Teacher")
- "background": One sentence about their relevant experience
- "perspective": What lens they evaluate content through (e.g., "clarity and actionability", "emotional resonance", "technical accuracy")
- "tone": Their communication style (e.g., "direct and analytical", "warm but critical", "sarcastic but insightful")

Make personas diverse in:
- Age/career stage
- Industry/background
- What they prioritize in content
- How harsh or generous they are with feedback

At least ${Math.ceil(agentCount * 0.4)} personas should represent the target audience directly. The others should offer outside perspectives (e.g., a content expert, a skeptic, someone from an adjacent field).

Respond ONLY with the JSON array, no other text.

Example format:
[
  {
    "name": "Sarah",
    "role": "Content Marketing Lead",
    "background": "10 years optimizing B2B newsletters for engagement",
    "perspective": "conversion-focused clarity",
    "tone": "direct and data-driven"
  }
]`;
}
