import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                company: true,
                category: { select: { name: true, slug: true, color: true, icon: true } },
            },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Increment view count
        await prisma.job.update({ where: { id }, data: { views: { increment: 1 } } });

        // Get related jobs
        const related = await prisma.job.findMany({
            where: {
                isActive: true,
                categoryId: job.categoryId,
                id: { not: id },
            },
            include: {
                company: { select: { name: true, logo: true } },
                category: { select: { name: true, slug: true, color: true } },
            },
            take: 3,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ job, related });
    } catch (error) {
        console.error("[GET /api/jobs/[id]]", error);
        return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
    }
}
