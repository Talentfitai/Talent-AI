import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET test details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const testType = searchParams.get("testType");

    if (sessionId) {
      const testSession = await prisma.testSession.findUnique({
        where: { id: sessionId },
        include: {
          test: true,
          testResults: true,
          application: {
            include: { job: true },
          },
        },
      });

      if (!testSession) {
        return NextResponse.json(
          { error: "Sesi test tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json(testSession);
    }

    if (testType) {
      const test = await prisma.test.findFirst({
        where: { type: testType },
      });

      if (!test) {
        return NextResponse.json(
          { error: "Test tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json(test);
    }

    return NextResponse.json(
      { error: "Parameter tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Get test error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

// POST start test atau submit jawaban
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, applicationId, testType, answers } = body;

    if (action === "START") {
      // Create new test session
      const test = await prisma.test.findFirst({
        where: { type: testType },
      });

      if (!test) {
        return NextResponse.json(
          { error: "Test tidak ditemukan" },
          { status: 404 }
        );
      }

      const testSession = await prisma.testSession.create({
        data: {
          applicationId,
          testId: test.id,
          startedAt: new Date(),
        },
      });

      return NextResponse.json(testSession, { status: 201 });
    }

    if (action === "SUBMIT") {
      const { sessionId } = body;

      // Get test session & test
      const testSession = await prisma.testSession.findUnique({
        where: { id: sessionId },
        include: { test: true },
      });

      if (!testSession) {
        return NextResponse.json(
          { error: "Sesi test tidak ditemukan" },
          { status: 404 }
        );
      }

      // Calculate score based on test type
      let score = 0;
      const testType = testSession.test.type;

      if (testType === "DISC") {
        // Simple scoring for DISC
        const selectedAnswers = Object.values(answers).filter(
          (a: any) => a === true
        ).length;
        score = Math.round((selectedAnswers / Object.keys(answers).length) * 100);
      } else if (testType === "MBTI") {
        score = Math.round(Object.values(answers).reduce((sum: any, val: any) => sum + val, 0) / Object.keys(answers).length);
      } else if (testType === "IQ") {
        const correct = Object.values(answers).filter((a: any) => a === true).length;
        score = Math.round((correct / Object.keys(answers).length) * 100);
      }

      // Save test result
      const testResult = await prisma.testResult.create({
        data: {
          testSessionId: sessionId,
          score,
          answers: JSON.stringify(answers),
          completedAt: new Date(),
        },
      });

      // Update test session status
      await prisma.testSession.update({
        where: { id: sessionId },
        data: {
          endedAt: new Date(),
          status: "COMPLETED",
        },
      });

      return NextResponse.json(
        { message: "Test selesai", score, testResult },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Action tidak valid" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Test error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
