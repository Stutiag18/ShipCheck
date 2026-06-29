import { prisma } from "@/lib/db";
import { analyzeContent } from "./content-analyzer";
import { generatePersonas } from "./persona-generator";
import { evaluateAsAgent } from "./agent-evaluator";
import { synthesizeFeedback } from "./senior-evaluator";
import { GeneratedPersona, AgentFeedback } from "@/types/persona";

/**
 * Process the next stage of an evaluation pipeline.
 * Each call handles ONE LLM operation to stay within Vercel's 10s timeout.
 * Returns the updated status.
 */
export async function processNextStage(evaluationId: string): Promise<string> {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: { personas: true, seniorReport: true },
  });

  if (!evaluation) throw new Error("Evaluation not found");

  switch (evaluation.status) {
    case "PENDING":
    case "ANALYZING":
      return await handleContentAnalysis(evaluationId, evaluation);

    case "GENERATING_PERSONAS":
      return await handlePersonaGeneration(evaluationId, evaluation);

    case "EVALUATING":
      return await handleAgentEvaluation(evaluationId, evaluation);

    case "SYNTHESIZING":
      return await handleSynthesis(evaluationId, evaluation);

    case "COMPLETED":
    case "FAILED":
      return evaluation.status;

    default:
      return evaluation.status;
  }
}

async function handleContentAnalysis(
  evaluationId: string,
  evaluation: { content: string; platform: string | null; goal: string | null }
): Promise<string> {
  await prisma.evaluation.update({
    where: { id: evaluationId },
    data: { status: "ANALYZING" },
  });

  try {
    const analysis = await analyzeContent(
      evaluation.content,
      evaluation.platform ?? undefined,
      evaluation.goal ?? undefined
    );

    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: {
        contentType: analysis.contentType,
        targetAudience: analysis.targetAudience,
        status: "GENERATING_PERSONAS",
      },
    });

    return "GENERATING_PERSONAS";
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { status: "FAILED", error: `Content analysis failed: ${msg}` },
    });
    return "FAILED";
  }
}

async function handlePersonaGeneration(
  evaluationId: string,
  evaluation: { content: string; contentType: string | null; targetAudience: string | null; platform: string | null; goal: string | null; agentCount: number }
): Promise<string> {
  try {
    const personas = await generatePersonas(
      evaluation.contentType || "general content",
      evaluation.targetAudience || "general audience",
      evaluation.agentCount,
      evaluation.platform ?? undefined,
      evaluation.goal ?? undefined
    );

    await prisma.persona.createMany({
      data: personas.map((p) => ({
        evaluationId,
        name: p.name,
        role: p.role,
        background: p.background,
        perspective: p.perspective,
        tone: p.tone,
      })),
    });

    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { status: "EVALUATING" },
    });

    return "EVALUATING";
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { status: "FAILED", error: `Persona generation failed: ${msg}` },
    });
    return "FAILED";
  }
}

async function handleAgentEvaluation(
  evaluationId: string,
  evaluation: {
    content: string;
    contentType: string | null;
    targetAudience: string | null;
    platform: string | null;
    goal: string | null;
    personas: Array<{ id: string; completed: boolean; name: string; role: string; background: string; perspective: string; tone: string }>;
  }
): Promise<string> {
  const nextPersona = evaluation.personas.find((p) => !p.completed);

  if (!nextPersona) {
    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { status: "SYNTHESIZING" },
    });
    return "SYNTHESIZING";
  }

  try {
    const persona: GeneratedPersona = {
      name: nextPersona.name,
      role: nextPersona.role,
      background: nextPersona.background,
      perspective: nextPersona.perspective,
      tone: nextPersona.tone,
    };

    const feedback = await evaluateAsAgent(
      persona,
      evaluation.content,
      evaluation.contentType || "general content",
      evaluation.targetAudience || "general audience",
      evaluation.platform ?? undefined,
      evaluation.goal ?? undefined
    );

    await prisma.persona.update({
      where: { id: nextPersona.id },
      data: {
        score: feedback.score,
        reaction: feedback.reaction,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        suggestions: feedback.suggestions,
        completed: true,
      },
    });

    const remainingIncomplete = evaluation.personas.filter(
      (p) => !p.completed && p.id !== nextPersona.id
    ).length;

    if (remainingIncomplete === 0) {
      await prisma.evaluation.update({
        where: { id: evaluationId },
        data: { status: "SYNTHESIZING" },
      });
      return "SYNTHESIZING";
    }

    return "EVALUATING";
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Pipeline] Agent evaluation failed for ${nextPersona.name}:`, msg);
    await prisma.persona.update({
      where: { id: nextPersona.id },
      data: { completed: true, error: msg },
    });

    const remainingIncomplete = evaluation.personas.filter(
      (p) => !p.completed && p.id !== nextPersona.id
    ).length;

    if (remainingIncomplete === 0) {
      await prisma.evaluation.update({
        where: { id: evaluationId },
        data: { status: "SYNTHESIZING" },
      });
      return "SYNTHESIZING";
    }

    return "EVALUATING";
  }
}

async function handleSynthesis(
  evaluationId: string,
  evaluation: {
    content: string;
    contentType: string | null;
    targetAudience: string | null;
    platform: string | null;
    goal: string | null;
    personas: Array<{
      id: string;
      name: string;
      role: string;
      background: string;
      perspective: string;
      tone: string;
      score: number | null;
      reaction: string | null;
      strengths: string | null;
      improvements: string | null;
      suggestions: string | null;
      completed: boolean;
      error: string | null;
    }>;
  }
): Promise<string> {
  try {
    const personaFeedbacks = evaluation.personas
      .filter((p) => p.completed && !p.error && p.score !== null)
      .map((p) => ({
        persona: {
          name: p.name,
          role: p.role,
          background: p.background,
          perspective: p.perspective,
          tone: p.tone,
        } as GeneratedPersona,
        feedback: {
          score: p.score!,
          reaction: p.reaction!,
          strengths: p.strengths!,
          improvements: p.improvements!,
          suggestions: p.suggestions!,
        } as AgentFeedback,
      }));

    if (personaFeedbacks.length === 0) {
      await prisma.evaluation.update({
        where: { id: evaluationId },
        data: { status: "FAILED", error: "No successful agent evaluations to synthesize" },
      });
      return "FAILED";
    }

    const synthesis = await synthesizeFeedback(
      evaluation.content,
      evaluation.contentType || "general content",
      evaluation.targetAudience || "general audience",
      personaFeedbacks,
      evaluation.platform ?? undefined,
      evaluation.goal ?? undefined
    );

    await prisma.seniorReport.create({
      data: {
        evaluationId,
        summary: synthesis.summary,
        overallScore: synthesis.overallScore,
        strengths: synthesis.strengths,
        improvements: synthesis.improvements,
        actionItems: synthesis.actionItems,
        rewrite: synthesis.rewrite ?? null,
      },
    });

    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { status: "COMPLETED", overallScore: synthesis.overallScore },
    });

    return "COMPLETED";
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    await prisma.evaluation.update({
      where: { id: evaluationId },
      data: { status: "FAILED", error: `Synthesis failed: ${msg}` },
    });
    return "FAILED";
  }
}
