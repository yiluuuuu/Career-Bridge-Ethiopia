"use client";

import Link from "next/link";
import {
    MapPin, Clock, BookmarkPlus, Bookmark, Building2, GraduationCap, MonitorSmartphone
} from "lucide-react";
import {
    jobTypeLabels, jobSiteLabels, formatDate, timeAgo, cn
} from "@/lib/utils";
import { useState, useEffect } from "react";

interface JobCardProps {
    job: {
        id: string;
        title: string;
        location: string;
        jobType: string;
        jobSite: string;
        educationLevel: string;
        salary?: string | null;
        deadline?: string | Date | null;
        createdAt: string | Date;
        isFeatured?: boolean;
        company: { name: string; logo?: string | null };
        category: { name: string; color?: string };
    };
    view?: "grid" | "list";
}

const jobTypeBadgeClass: Record<string, string> = {
    FULL_TIME: "badge-sky",
    PART_TIME: "badge-amber",
    FREELANCE: "badge-purple",
    CONTRACTUAL: "badge-green",
    VOLUNTEER: "badge-rose",
    INTERN_PAID: "badge-green",
    INTERN_UNPAID: "badge-amber",
};

const jobSiteBadgeClass: Record<string, string> = {
    REMOTE: "badge-green",
    HYBRID: "badge-amber",
    ON_SITE: "badge-sky",
};

function CompanyAvatar({ name, logo }: { name: string; logo?: string | null }) {
    const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const colors = [
        "from-sky-400 to-blue-500",
        "from-violet-400 to-purple-500",
        "from-emerald-400 to-green-500",
        "from-amber-400 to-orange-500",
        "from-rose-400 to-pink-500",
    ];
    const colorIndex = name.charCodeAt(0) % colors.length;

    if (logo) {
        return (
            <img src={logo} alt={name} className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-700" />
        );
    }

    return (
        <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm flex-shrink-0",
            colors[colorIndex]
        )}>
            {initials}
        </div>
    );
}

export default function JobCard({ job, view = "grid" }: JobCardProps) {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
        setSaved(savedJobs.includes(job.id));
    }, [job.id]);

    const toggleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        const savedJobs: string[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
        let updated: string[];
        if (saved) {
            updated = savedJobs.filter((id) => id !== job.id);
        } else {
            updated = [...savedJobs, job.id];
        }
        localStorage.setItem("savedJobs", JSON.stringify(updated));
        setSaved(!saved);
    };

    const isExpiringSoon = job.deadline
        ? new Date(job.deadline).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000
        : false;

    return (
        <Link href={`/jobs/${job.id}`} className="block group">
            <article className={cn(
                "card p-4 group-hover:border-sky-200 dark:group-hover:border-sky-700 group-hover:-translate-y-0.5 transition-all duration-200 relative",
                job.isFeatured && "ring-1 ring-sky-200 dark:ring-sky-800"
            )}>
                {job.isFeatured && (
                    <div className="absolute top-3 right-3">
                        <span className="badge bg-gradient-to-r from-sky-500 to-blue-500 text-white text-xs">
                            ⭐ Featured
                        </span>
                    </div>
                )}

                <div className="flex items-start gap-3 pb-3 border-b border-slate-50 dark:border-slate-700/50">
                    <CompanyAvatar name={job.company.name} logo={job.company.logo} />
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors pr-6">
                            {job.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {job.company.name}
                        </p>
                    </div>
                </div>

                <div className="pt-3 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                        <span className={cn("badge", jobTypeBadgeClass[job.jobType] || "badge-sky")}>
                            {jobTypeLabels[job.jobType]}
                        </span>
                        <span className={cn("badge", jobSiteBadgeClass[job.jobSite] || "badge-sky")}>
                            <MonitorSmartphone className="w-2.5 h-2.5" />
                            {jobSiteLabels[job.jobSite]}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-sky-400" />
                            {job.location}
                        </span>
                    </div>

                    {job.salary && (
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            💰 {job.salary}
                        </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {timeAgo(job.createdAt)}
                            </span>
                            {job.deadline && (
                                <span className={cn(
                                    "flex items-center gap-1",
                                    isExpiringSoon ? "text-rose-500" : "text-slate-400"
                                )}>
                                    Deadline: {formatDate(job.deadline)}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={toggleSave}
                            aria-label={saved ? "Unsave job" : "Save job"}
                            className={cn(
                                "p-1.5 rounded-lg transition-all",
                                saved
                                    ? "text-sky-500 bg-sky-50 dark:bg-sky-950/50"
                                    : "text-slate-300 dark:text-slate-600 hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/30"
                            )}
                        >
                            {saved ? <Bookmark className="w-4 h-4 fill-current" /> : <BookmarkPlus className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </article>
        </Link>
    );
}
