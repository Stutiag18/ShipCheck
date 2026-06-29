import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, imageBase64, platform, goal, agentCount: rawAgentCount } = body;

    const inputType = imageBase64 ? "image" : "text";
    const agentCount = Math.min(10, Math.max(5, Number(rawAgentCount) || 5));

    if (!content && !imageBase64) {
      return Response.json(
        { error: "Content (text or image) is required" },
        { status: 400 }
      );
    }

    if (content && content.length > 10000) {
      return Response.json(
        { error: "Content must be under 10,000 characters" },
        { status: 400 }
      );
    }

    // Get or create session ID from cookies
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("session_id")?.value;
    if (!sessionId) {
      sessionId = uuidv4();
    }

    const evaluation = await prisma.evaluation.create({
      data: {
        content: content || "[Image content]",
        inputType,
        imageData: imageBase64 || null,
        platform: platform || null,
        goal: goal || null,
        agentCount,
        sessionId,
        status: "PENDING",
      },
    });

    // Set session cookie if new
    if (!cookieStore.get("session_id")) {
      cookieStore.set("session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return Response.json({ id: evaluation.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return Response.json(
      { error: "Failed to create evaluation" },
      { status: 500 }
    );
  }
}
