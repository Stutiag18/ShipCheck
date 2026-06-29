export function buildContentAnalysisPrompt(
  content: string,
  platform?: string,
  goal?: string
): string {
  const context = [
    platform && `Platform: ${platform}`,
    goal && `Creator's goal: ${goal}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are a content strategist. Analyze the following content and identify what type of content it is and who its target audience would be.

---
${content}
---

${context ? `Additional context:\n${context}\n` : ""}
Respond as a JSON object with:
- "contentType": The type of content (e.g., "newsletter", "blog post", "social media post", "email campaign", "landing page copy", "product description", "video script", "thought leadership", "tutorial", "announcement", "sales pitch", "personal essay", etc.)
- "targetAudience": A concise description of who this content is meant for (e.g., "B2B SaaS founders in early stage", "fitness enthusiasts aged 25-35", "technical developers learning React", etc.)
- "tone": The detected tone of the content (e.g., "professional and informative", "casual and conversational", "urgent and persuasive")
- "intent": What the content is trying to achieve (e.g., "educate readers about a topic", "drive signups", "build authority", "entertain")

Respond ONLY with the JSON object, no other text.`;
}
