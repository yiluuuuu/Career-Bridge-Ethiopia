import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/JobCard";
import {
    MapPin, Clock, Calendar, ExternalLink, Mail, ArrowLeft,
    Briefcase, GraduationCap, Users, MonitorSmartphone, Building2, Eye
} from "lucide-react";
import {
    jobTypeLabels, jobSiteLabels, experienceLevelLabels,
    educationLevelLabels, genderLabels, formatDate, timeAgo, cn
} from "@/lib/utils";
import type { Metadata } from "next";

async function getJob(id: string) {
    const job = await prisma.job.findUnique({
        where: { id, isActive: true },
        include: {
            company: true,
            category: { select: { name: true, slug: true, color: true, icon: true } },
        },
    });

    const related = job
        ? await prisma.job.findMany({
            where: { isActive: true, categoryId: job.categoryId, id: { not: id } },
            include: {
                company: { select: { name: true, logo: true } },
                category: { select: { name: true, slug: true, color: true } },
            },
            take: 3,
            orderBy: { createdAt: "desc" },
        })
        : [];

    return { job, related };
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const { job } = await getJob(id);
    if (!job) return { title: "Job Not Found" };
    return {
        title: `${job.title} at ${job.company.name}`,
        description: job.description.slice(0, 160),
    };
}

export default async function JobDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const { job, related } = await getJob(id);

    if (!job) notFound();

    const details = [
        { icon: <Briefcase className="w-4 h-4" />, label: "Type", value: jobTypeLabels[job.jobType] },
        { icon: <MonitorSmartphone className="w-4 h-4" />, label: "Work Mode", value: jobSiteLabels[job.jobSite] },
        { icon: <MapPin className="w-4 h-4" />, label: "Location", value: job.location },
        { icon: <GraduationCap className="w-4 h-4" />, label: "Education", value: educationLevelLabels[job.educationLevel] },
        { icon: <Clock className="w-4 h-4" />, label: "Experience", value: experienceLevelLabels[job.experienceLevel] },
        { icon: <Users className="w-4 h-4" />, label: "Gender", value: genderLabels[job.gender] },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
                href="/jobs"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-sky-600 transition-colors mb-5"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
            </Link>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main content */}
                <div className="flex-1 space-y-5">
                    {/* Header card */}
                    <div className="card p-5 sm:p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg"
                                style={{ backgroundColor: job.category.color }}
                            >
                                {job.company.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap gap-2 mb-1">
                                    <span className="badge badge-sky">{job.category.name}</span>
                                    {job.isFeatured && (
                                        <span className="badge bg-gradient-to-r from-sky-500 to-blue-500 text-white">⭐ Featured</span>
                                    )}
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                    {job.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Building2 className="w-3.5 h-3.5" />
                                        {job.company.name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {job.views} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        Posted {timeAgo(job.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {job.salary && (
                            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-800">
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                    💰 Salary: {job.salary}
                                </p>
                            </div>
                        )}

                        {/* Detail grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                            {details.map((d) => (
                                <div key={d.label} className="bg-sky-50/60 dark:bg-slate-700/40 rounded-xl p-3">
                                    <div className="flex items-center gap-1.5 text-sky-500 mb-1">
                                        {d.icon}
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{d.label}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{d.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Apply buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            {job.applyUrl && (
                                <a
                                    href={job.applyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Apply Online
                                </a>
                            )}
                            {job.applyEmail && (
                                <a
                                    href={`mailto:${job.applyEmail}?subject=Application for ${job.title}`}
                                    className="btn-outline flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-4 h-4" />
                                    Apply via Email
                                </a>
                            )}
                        </div>

                        {job.deadline && (
                            <div className={cn(
                                "mt-3 flex items-center gap-2 text-sm",
                                new Date(job.deadline) < new Date() ? "text-rose-500" : "text-slate-500 dark:text-slate-400"
                            )}>
                                <Calendar className="w-4 h-4" />
                                Deadline: {formatDate(job.deadline)}
                                {new Date(job.deadline) < new Date() && " (Expired)"}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="card p-5 sm:p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Job Description</h2>
                        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                            {job.description.split("\n").map((line, i) => (
                                <p key={i} className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed last:mb-0">
                                    {line}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="card p-5 sm:p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Requirements</h2>
                            <div>
                                {job.requirements.split("\n").map((line, i) => (
                                    line.trim() ? (
                                        <div key={i} className="flex items-start gap-2.5 mb-2.5 last:mb-0">
                                            <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0" />
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{line.replace(/^[-•*]\s*/, "")}</p>
                                        </div>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <aside className="w-full lg:w-72 flex-shrink-0 space-y-5">
                    {/* Company info */}
                    <div className="card p-5">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">About the Company</h3>
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                                style={{ backgroundColor: job.category.color }}
                            >
                                {job.company.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{job.company.name}</p>
                                {job.company.website && (
                                    <a
                                        href={job.company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-sky-500 hover:text-sky-600"
                                    >
                                        {job.company.website.replace(/https?:\/\//, "")}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Related jobs */}
                    {related.length > 0 && (
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Similar Jobs</h3>
                            <div className="space-y-3">
                                {related.map((rj) => (
                                    <JobCard
                                        key={rj.id}
                                        job={{
                                            ...rj,
                                            deadline: rj.deadline?.toISOString() ?? null,
                                            createdAt: rj.createdAt.toISOString(),
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
