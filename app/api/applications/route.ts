import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// GET applications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    let applications;

    if (session.user.role === "HRD") {
      // HRD dapat lihat semua aplikasi untuk jobs mereka
      if (jobId) {
        applications = await prisma.application.findMany({
          where: {
            jobId,
            job: {
              createdById: session.user.id,
            },
          },
          include: {
            candidate: {
              select: { id: true, name: true, email: true },
            },
            testSessions: {
              include: { testResults: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      } else {
        applications = await prisma.application.findMany({
          where: {
            job: {
              createdById: session.user.id,
            },
          },
          include: {
            candidate: {
              select: { id: true, name: true, email: true },
            },
            testSessions: {
              include: { testResults: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });
      }
    } else {
      // Kandidat hanya lihat aplikasi mereka sendiri
      applications = await prisma.application.findMany({
        where: { candidateId: session.user.id },
        include: {
          job: true,
          testSessions: {
            include: { testResults: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

// POST create application
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "CANDIDATE") {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { jobId } = await request.json();

    // Check if already applied
    const existingApp = await prisma.application.findFirst({
      where: {
        candidateId: session.user.id,
        jobId,
      },
    });

    if (existingApp) {
      return NextResponse.json(
        { error: "Anda sudah melamar posisi ini" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        candidateId: session.user.id,
        jobId,
        status: "APPLIED",
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Create application error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
