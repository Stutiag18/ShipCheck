import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      include: {
        personas: {
          orderBy: { id: "asc" },
        },
        seniorReport: true,
      },
    });

    if (!evaluation) {
      return Response.json({ error: "Evaluation not found" }, { status: 404 });
    }

    return Response.json({
      id: evaluation.id,
      content: evaluation.content,
      inputType: evaluation.inputType,
      contentType: evaluation.contentType,
      targetAudience: evaluation.targetAudience,
      platform: evaluation.platform,
      goal: evaluation.goal,
      status: evaluation.status,
      overallScore: evaluation.overallScore,
      error: evaluation.error,
      personas: evaluation.personas.map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role,
        background: p.background,
        perspective: p.perspective,
        tone: p.tone,
        score: p.score,
        reaction: p.reaction,
        strengths: p.strengths,
        improvements: p.improvements,
        suggestions: p.suggestions,
        completed: p.completed,
      })),
      seniorReport: evaluation.seniorReport
        ? {
            id: evaluation.seniorReport.id,
            summary: evaluation.seniorReport.summary,
            overallScore: evaluation.seniorReport.overallScore,
            strengths: evaluation.seniorReport.strengths,
            improvements: evaluation.seniorReport.improvements,
            actionItems: evaluation.seniorReport.actionItems,
            rewrite: evaluation.seniorReport.rewrite,
          }
        : null,
      createdAt: evaluation.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return Response.json(
      { error: "Failed to fetch evaluation" },
      { status: 500 }
    );
  }
}
