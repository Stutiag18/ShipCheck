import { NextRequest } from "next/server";
import { processNextStage } from "@/lib/evaluation/pipeline";
import { prisma } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify evaluation exists
    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
    });

    if (!evaluation) {
      return Response.json({ error: "Evaluation not found" }, { status: 404 });
    }

    if (evaluation.status === "COMPLETED" || evaluation.status === "FAILED") {
      return Response.json({ status: evaluation.status });
    }

    const newStatus = await processNextStage(id);

    return Response.json({ status: newStatus });
  } catch (error) {
    console.error("Error processing evaluation stage:", error);
    return Response.json(
      { error: "Failed to process evaluation stage" },
      { status: 500 }
    );
  }
}
