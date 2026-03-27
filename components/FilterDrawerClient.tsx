"use client";

import { useState, Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import { cn } from "@/lib/utils";

export default function FilterDrawerClient({ activeCount }: { activeCount: number }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={cn(
                    "lg:hidden flex items-center gap-2 py-2 px-3 rounded-xl border transition-all text-sm font-medium",
                    activeCount > 0
                        ? "border-sky-400 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                )}
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeCount > 0 && (
                    <span className="bg-sky-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {activeCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                    <div className="relative ml-auto w-80 max-w-[90vw] h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto animate-slide-down">
                        <div className="p-5">
                            <Suspense fallback={null}>
                                <FilterSidebar isMobile onClose={() => setOpen(false)} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
