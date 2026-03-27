import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JobType, JobSite, ExperienceLevel, EducationLevel, Gender } from "@prisma/client";

const PAGE_SIZE = 12;

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q") || "";
        const type = searchParams.get("type") || "";
        const site = searchParams.get("site") || "";
        const experience = searchParams.get("experience") || "";
        const education = searchParams.get("education") || "";
        const gender = searchParams.get("gender") || "";
        const location = searchParams.get("location") || "";
        const category = searchParams.get("category") || "";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const featured = searchParams.get("featured") === "true";

        const where: Record<string, unknown> = { isActive: true };

        if (q) {
            where.OR = [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { company: { name: { contains: q, mode: "insensitive" } } },
            ];
        }
        if (type && Object.values(JobType).includes(type as JobType)) where.jobType = type;
        if (site && Object.values(JobSite).includes(site as JobSite)) where.jobSite = site;
        if (experience && Object.values(ExperienceLevel).includes(experience as ExperienceLevel)) where.experienceLevel = experience;
        if (education && Object.values(EducationLevel).includes(education as EducationLevel)) where.educationLevel = education;
        if (gender && Object.values(Gender).includes(gender as Gender)) where.gender = gender;
        if (location) where.location = { contains: location, mode: "insensitive" };
        if (category) where.category = { slug: category };
        if (featured) where.isFeatured = true;

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                include: {
                    company: { select: { name: true, logo: true } },
                    category: { select: { name: true, slug: true, color: true } },
                },
                orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.job.count({ where }),
        ]);

        return NextResponse.json({
            jobs,
            total,
            page,
            totalPages: Math.ceil(total / PAGE_SIZE),
            pageSize: PAGE_SIZE,
        });
    } catch (error) {
        console.error("[GET /api/jobs]", error);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            title, description, requirements, salary, deadline, applyUrl, applyEmail,
            jobType, jobSite, experienceLevel, educationLevel, gender, location,
            categoryId, companyName, companyLogo, companyWebsite,
        } = body;

        if (!title || !description || !location || !categoryId || !companyName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upsert company
        const company = await prisma.company.upsert({
            where: { name: companyName },
            create: { name: companyName, logo: companyLogo, website: companyWebsite },
            update: { logo: companyLogo, website: companyWebsite },
        });

        const job = await prisma.job.create({
            data: {
                title, description, requirements: requirements || "",
                salary, deadline: deadline ? new Date(deadline) : null,
                applyUrl, applyEmail,
                jobType: jobType || "FULL_TIME",
                jobSite: jobSite || "ON_SITE",
                experienceLevel: experienceLevel || "ENTRY",
                educationLevel: educationLevel || "BACHELOR",
                gender: gender || "ANY",
                location,
                categoryId,
                companyId: company.id,
            },
            include: { company: true, category: true },
        });

        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        console.error("[POST /api/jobs]", error);
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}
