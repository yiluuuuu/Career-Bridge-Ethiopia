import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "NGO Jobs in Ethiopia",
    description: "Find the latest NGO and non-profit organization job vacancies in Ethiopia.",
};

const PAGE_SIZE = 12;

async function getNGOJobs(page = 1) {
    const ngoCategory = await prisma.category.findFirst({
        where: { slug: { in: ["ngo", "non-profit", "nonprofit"] } },
    });
    const where = ngoCategory
        ? { isActive: true, categoryId: ngoCategory.id }
        : {
            isActive: true,
            OR: [
                { title: { contains: "NGO", mode: "insensitive" as const } },
                { description: { contains: "NGO", mode: "insensitive" as const } },
            ],
        };
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
    return { jobs, total, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function NGOJobsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || "1"));
    const { jobs, total, totalPages } = await getNGOJobs(page);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
                        <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">NGO Jobs</h1>
                        <p className="text-sm text-slate-500">{total} positions available</p>
                    </div>
                </div>
                <Suspense fallback={<div className="h-12 bg-slate-200 rounded-xl animate-pulse" />}>
                    <SearchBar placeholder="Search NGO jobs..." />
                </Suspense>
            </div>
            {jobs.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <Globe className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No NGO jobs found at the moment</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {jobs.map((job) => (
                        <JobCard
                            key={job.id}
                            job={{ ...job, deadline: job.deadline?.toISOString() ?? null, createdAt: job.createdAt.toISOString() }}
                        />
                    ))}
                </div>
            )}
            <Suspense fallback={null}>
                <Pagination currentPage={page} totalPages={totalPages} basePath="/ngo-jobs" />
            </Suspense>
        </div>
    );
}
