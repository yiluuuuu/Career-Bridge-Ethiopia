import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import FilterSidebar from "@/components/FilterSidebar";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { SlidersHorizontal } from "lucide-react";
import FilterDrawerClient from "@/components/FilterDrawerClient";

const PAGE_SIZE = 12;

interface SearchParams {
    q?: string;
    type?: string;
    site?: string;
    experience?: string;
    education?: string;
    gender?: string;
    location?: string;
    category?: string;
    page?: string;
    featured?: string;
}

async function getJobs(params: SearchParams) {
    const {
        q, type, site, experience, education, gender, location, category,
        page: pageStr, featured
    } = params;

    const page = Math.max(1, parseInt(pageStr || "1"));
    const where: Record<string, unknown> = { isActive: true };

    if (q) {
        where.OR = [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { company: { name: { contains: q, mode: "insensitive" } } },
        ];
    }
    if (type) where.jobType = type;
    if (site) where.jobSite = site;
    if (experience) where.experienceLevel = experience;
    if (education) where.educationLevel = education;
    if (gender) where.gender = gender;
    if (location) where.location = { contains: location, mode: "insensitive" };
    if (category) where.category = { slug: category };
    if (featured === "true") where.isFeatured = true;

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

    return { jobs, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {
    const params = await searchParams;
    const { jobs, total, page, totalPages } = await getJobs(params);

    const activeFilters = ["type", "site", "experience", "education", "gender", "location", "category"]
        .filter((k) => params[k as keyof SearchParams]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Search bar */}
            <div className="mb-6">
                <Suspense fallback={<div className="h-12 bg-slate-200 rounded-xl animate-pulse" />}>
                    <SearchBar placeholder="Search jobs, companies, keywords..." />
                </Suspense>
            </div>

            <div className="flex gap-6">
                {/* Desktop sidebar */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="card p-5 sticky top-20">
                        <Suspense fallback={<div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="h-6 bg-slate-100 rounded animate-pulse" />)}</div>}>
                            <FilterSidebar />
                        </Suspense>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                {params.q ? `Results for "${params.q}"` : "All Jobs"}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                {total.toLocaleString()} {total === 1 ? "job" : "jobs"} found
                                {activeFilters.length > 0 && ` • ${activeFilters.length} filter${activeFilters.length > 1 ? "s" : ""} active`}
                            </p>
                        </div>

                        {/* Mobile filter button */}
                        <Suspense fallback={null}>
                            <FilterDrawerClient activeCount={activeFilters.length} />
                        </Suspense>
                    </div>

                    {/* Job grid */}
                    {jobs.length === 0 ? (
                        <div className="text-center py-16">
                            <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 font-medium">No jobs found</p>
                            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {jobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={{
                                        ...job,
                                        deadline: job.deadline?.toISOString() ?? null,
                                        createdAt: job.createdAt.toISOString(),
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <Suspense fallback={null}>
                        <Pagination currentPage={page} totalPages={totalPages} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
