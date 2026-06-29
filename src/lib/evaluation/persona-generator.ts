import { generateWithFallback } from "@/lib/llm";
import { buildPersonaGenerationPrompt } from "@/lib/prompts/persona-generation";
import { GeneratedPersona } from "@/types/persona";

export async function generatePersonas(
  contentType: string,
  targetAudience: string,
  agentCount: number = 5,
  platform?: string,
  goal?: string
): Promise<GeneratedPersona[]> {
  const prompt = buildPersonaGenerationPrompt(contentType, targetAudience, agentCount, platform, goal);

  const response = await generateWithFallback({ prompt, temperature: 0.9 });

  const text = response.text.trim();

  // JSON mode may wrap array in an object like {"personas": [...]}
  let personas: GeneratedPersona[];
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      personas = parsed;
    } else if (parsed.personas && Array.isArray(parsed.personas)) {
      personas = parsed.personas;
    } else {
      // Find first array value in the object
      const arrValue = Object.values(parsed).find(v => Array.isArray(v)) as GeneratedPersona[] | undefined;
      if (arrValue) {
        personas = arrValue;
      } else {
        throw new Error("No array found in response");
      }
    }
  } catch (e) {
    // Fallback: try regex extraction
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse personas from LLM response");
    }
    personas = JSON.parse(jsonMatch[0]);
  }

  if (!Array.isArray(personas) || personas.length < 1) {
    throw new Error(`Expected ${agentCount} personas, got ${personas?.length ?? 0}`);
  }

  // LLM may return slightly more or fewer — trim to requested count
  personas = personas.slice(0, agentCount);

  for (const p of personas) {
    if (!p.name || !p.role || !p.background || !p.perspective || !p.tone) {
      throw new Error("Persona missing required fields");
    }
  }

  return personas;
}
