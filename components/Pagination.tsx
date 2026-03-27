"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = "/jobs" }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const goTo = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        router.push(`${basePath}?${params.toString()}`);
    };

    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-center gap-1.5 py-6">
            <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600 hover:border-sky-300 transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {pages.map((page, i) =>
                page === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-9 text-center text-slate-400">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => goTo(page as number)}
                        className={cn(
                            "w-9 h-9 rounded-lg text-sm font-medium transition-all",
                            currentPage === page
                                ? "bg-sky-500 text-white shadow-lg shadow-sky-200 dark:shadow-sky-900"
                                : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600"
                        )}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-50 dark:hover:bg-sky-950/30 hover:text-sky-600 hover:border-sky-300 transition-all"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
