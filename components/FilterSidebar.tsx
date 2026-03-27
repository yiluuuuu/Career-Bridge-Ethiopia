"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import {
    jobTypeLabels,
    jobSiteLabels,
    experienceLevelLabels,
    educationLevelLabels,
    genderLabels,
    ethiopianCities,
    cn,
} from "@/lib/utils";

interface FilterSection {
    key: string;
    label: string;
    options: { value: string; label: string }[];
}

const filterSections: FilterSection[] = [
    {
        key: "type",
        label: "Job Type",
        options: Object.entries(jobTypeLabels).map(([value, label]) => ({ value, label })),
    },
    {
        key: "site",
        label: "Job Site",
        options: Object.entries(jobSiteLabels).map(([value, label]) => ({ value, label })),
    },
    {
        key: "experience",
        label: "Experience Level",
        options: Object.entries(experienceLevelLabels).map(([value, label]) => ({ value, label })),
    },
    {
        key: "education",
        label: "Education Level",
        options: Object.entries(educationLevelLabels).map(([value, label]) => ({ value, label })),
    },
    {
        key: "gender",
        label: "Gender Preference",
        options: Object.entries(genderLabels).map(([value, label]) => ({ value, label })),
    },
    {
        key: "location",
        label: "Location",
        options: ethiopianCities.map((city) => ({ value: city, label: city })),
    },
];

interface FilterSidebarProps {
    onClose?: () => void;
    isMobile?: boolean;
}

function FilterGroup({
    section,
    currentValue,
    onChange,
}: {
    section: FilterSection;
    currentValue: string;
    onChange: (key: string, value: string) => void;
}) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between mb-3"
            >
                <span className="filter-label mb-0">{section.label}</span>
                {expanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
            </button>

            {expanded && (
                <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-hide">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name={section.key}
                            value=""
                            checked={!currentValue}
                            onChange={() => onChange(section.key, "")}
                            className="accent-sky-500"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-sky-600 transition-colors">
                            Any
                        </span>
                    </label>
                    {section.options.map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name={section.key}
                                value={opt.value}
                                checked={currentValue === opt.value}
                                onChange={() => onChange(section.key, opt.value)}
                                className="accent-sky-500"
                            />
                            <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-sky-600 transition-colors">
                                {opt.label}
                            </span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FilterSidebar({ onClose, isMobile }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getParam = (key: string) => searchParams.get(key) || "";

    const updateParam = useCallback(
        (key: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page");
            router.push(`/jobs?${params.toString()}`);
        },
        [router, searchParams]
    );

    const hasActiveFilters = filterSections.some((s) => getParam(s.key));

    const clearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        filterSections.forEach((s) => params.delete(s.key));
        params.delete("page");
        router.push(`/jobs?${params.toString()}`);
        onClose?.();
    };

    return (
        <div className={cn(isMobile ? "px-1" : "")}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-sky-500" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Filters</h3>
                    {hasActiveFilters && (
                        <span className="badge badge-sky">
                            {filterSections.filter((s) => getParam(s.key)).length} active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Clear all
                        </button>
                    )}
                    {isMobile && onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <X className="w-4 h-4 text-slate-500" />
                        </button>
                    )}
                </div>
            </div>

            {filterSections.map((section) => (
                <FilterGroup
                    key={section.key}
                    section={section}
                    currentValue={getParam(section.key)}
                    onChange={updateParam}
                />
            ))}

            {isMobile && (
                <button
                    onClick={onClose}
                    className="btn-primary w-full mt-4 text-sm"
                >
                    Show Results
                </button>
            )}
        </div>
    );
}
