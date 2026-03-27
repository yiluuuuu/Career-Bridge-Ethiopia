import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { Landmark } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Banking & Finance Jobs in Ethiopia",
    description: "Find the latest banking, finance, and financial institution job vacancies in Ethiopia.",
};

const PAGE_SIZE = 12;

async function getBankingJobs(page = 1) {
    const bankingCategory = await prisma.category.findFirst({
        where: { slug: { in: ["banking", "finance", "banking-finance"] } },
    });
    const where = bankingCategory
        ? { isActive: true, categoryId: bankingCategory.id }
        : {
            isActive: true,
            OR: [
                { title: { contains: "bank", mode: "insensitive" as const } },
                { description: { contains: "banking", mode: "insensitive" as const } },
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

export default async function BankingJobsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const page = Math.max(1, parseInt(params.page || "1"));
    const { jobs, total, totalPages } = await getBankingJobs(page);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-sky-100 dark:bg-sky-950 rounded-xl flex items-center justify-center">
                        <Landmark className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Banking & Finance Jobs</h1>
                        <p className="text-sm text-slate-500">{total} positions available</p>
                    </div>
                </div>
                <Suspense fallback={<div className="h-12 bg-slate-200 rounded-xl animate-pulse" />}>
                    <SearchBar placeholder="Search banking & finance jobs..." />
                </Suspense>
            </div>
            {jobs.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <Landmark className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No banking jobs found at the moment</p>
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
                <Pagination currentPage={page} totalPages={totalPages} basePath="/banking-jobs" />
            </Suspense>
        </div>
    );
}
