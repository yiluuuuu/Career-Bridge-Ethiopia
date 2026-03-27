import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import CategorySection from "@/components/CategorySection";
import SearchBar from "@/components/SearchBar";
import { ArrowRight, TrendingUp, Users, Briefcase, Send } from "lucide-react";

async function getHomepageData() {
    const [jobs, categories, totalJobs] = await Promise.all([
        prisma.job.findMany({
            where: { isActive: true },
            include: {
                company: { select: { name: true, logo: true } },
                category: { select: { name: true, slug: true, color: true } },
            },
            orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
            take: 12,
        }),
        prisma.category.findMany({
            include: { _count: { select: { jobs: { where: { isActive: true } } } } },
            orderBy: { name: "asc" },
        }),
        prisma.job.count({ where: { isActive: true } }),
    ]);
    return { jobs, categories, totalJobs };
}

export default async function HomePage() {
    const { jobs, categories, totalJobs } = await getHomepageData();

    const stats = [
        { label: "Active Jobs", value: totalJobs.toLocaleString(), icon: <Briefcase className="w-5 h-5 text-sky-500" /> },
        { label: "Categories", value: categories.length.toString(), icon: <TrendingUp className="w-5 h-5 text-sky-500" /> },
        { label: "Employers", value: "500+", icon: <Users className="w-5 h-5 text-sky-500" /> },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="text-center mb-8">
                        <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                            🇪🇹 Ethiopia&apos;s #1 Job Portal
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3">
                            Find Your Dream Job
                            <span className="block text-sky-200">in Ethiopia</span>
                        </h1>
                        <p className="text-sky-100 text-base sm:text-lg max-w-xl mx-auto">
                            Connecting talented Ethiopians with top employers across the country.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-2xl mx-auto">
                        <Suspense fallback={<div className="h-14 bg-white/20 rounded-xl animate-pulse" />}>
                            <SearchBar large placeholder="Search jobs, companies, or keywords..." />
                        </Suspense>
                        <div className="flex flex-wrap gap-2 mt-3 justify-center">
                            {["IT", "NGO", "Banking", "Healthcare", "Engineering"].map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/jobs?category=${cat.toLowerCase()}`}
                                    className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-full transition-all"
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-center gap-6 sm:gap-10 mt-8">
                        {stats.map((s) => (
                            <div key={s.label} className="text-center">
                                <div className="flex items-center gap-1.5 justify-center">
                                    {s.icon}
                                    <p className="text-xl sm:text-2xl font-bold text-white">{s.value}</p>
                                </div>
                                <p className="text-xs text-sky-200 mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <Suspense fallback={<div className="h-48 bg-slate-100 animate-pulse rounded-xl m-4" />}>
                <CategorySection categories={categories} />
            </Suspense>

            {/* Latest Jobs */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="section-title">Latest Jobs</h2>
                    <Link
                        href="/jobs"
                        className="flex items-center gap-1 text-sm text-sky-500 hover:text-sky-600 font-medium"
                    >
                        View all
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {jobs.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
                        <p className="font-medium">No jobs available yet</p>
                        <p className="text-sm mt-1">Check back soon or post a job!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {jobs.map((job) => (
                            <JobCard key={job.id} job={{ ...job, deadline: job.deadline?.toISOString() ?? null, createdAt: job.createdAt.toISOString() }} />
                        ))}
                    </div>
                )}
            </section>

            {/* Telegram CTA */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-sky-200 dark:shadow-sky-900">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Send className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Get Jobs on Telegram</h3>
                            <p className="text-sky-100 text-sm">Join our channel and never miss a new opportunity!</p>
                        </div>
                    </div>
                    <a
                        href="https://t.me/careerbridgeethiopia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 bg-white text-sky-600 font-bold px-6 py-3 rounded-xl hover:bg-sky-50 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        Subscribe Now
                    </a>
                </div>
            </section>
        </div>
    );
}
