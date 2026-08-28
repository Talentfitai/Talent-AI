import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const jobSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  department: z.string(),
  location: z.string(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  idealProfiles: z.record(
    z.object({
      category: z.string(),
      score: z.number(),
    })
  ),
});

// GET all jobs for candidates or specific job for details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("id");

    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          idealProfiles: true,
        },
      });

      if (!job) {
        return NextResponse.json(
          { error: "Lowongan tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json(job);
    }

    // Get all active jobs
    const jobs = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        idealProfiles: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}

// POST create new job (HRD only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "HRD") {
      return NextResponse.json(
        { error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, department, location, salaryMin, salaryMax, idealProfiles } =
      jobSchema.parse(body);

    const job = await prisma.job.create({
      data: {
        title,
        description,
        department,
        location,
        salaryMin,
        salaryMax,
        status: "ACTIVE",
        createdById: session.user.id,
        idealProfiles: {
          create: Object.entries(idealProfiles).map(([key, value]) => ({
            testType: key.toUpperCase(),
            minScore: (value as any).score,
          })),
        },
      },
      include: {
        idealProfiles: true,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan" },
      { status: 500 }
    );
  }
}
