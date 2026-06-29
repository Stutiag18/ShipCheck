import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
      return Response.json([]);
    }

    const evaluations = await prisma.evaluation.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        contentType: true,
        status: true,
        overallScore: true,
        createdAt: true,
        content: true,
      },
    });

    return Response.json(
      evaluations.map((e) => ({
        id: e.id,
        contentType: e.contentType,
        status: e.status,
        overallScore: e.overallScore,
        preview: e.content.substring(0, 100) + (e.content.length > 100 ? "..." : ""),
        createdAt: e.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching history:", error);
    return Response.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
