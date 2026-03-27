"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    className?: string;
    large?: boolean;
    placeholder?: string;
}

export default function SearchBar({
    className,
    large,
    placeholder = "Search jobs, companies, keywords...",
}: SearchBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(searchParams.get("q") || "");

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            const params = new URLSearchParams(searchParams.toString());
            if (value.trim()) {
                params.set("q", value.trim());
            } else {
                params.delete("q");
            }
            params.delete("page");
            router.push(`/jobs?${params.toString()}`);
        },
        [value, router, searchParams]
    );

    const clear = () => {
        setValue("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className={cn("relative flex items-center w-full", className)}>
            <Search
                className={cn(
                    "absolute left-4 text-slate-400 flex-shrink-0 pointer-events-none z-10",
                    large ? "w-5 h-5" : "w-4 h-4"
                )}
            />
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "input-field pl-11 pr-24",
                    large && "text-base py-4 shadow-md"
                )}
            />
            {value && (
                <button
                    type="button"
                    onClick={clear}
                    className="absolute right-28 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear search"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
            <button
                type="submit"
                className={cn(
                    "absolute right-2 btn-primary text-sm py-2",
                    large && "py-2.5 px-5"
                )}
            >
                Search
            </button>
        </form>
    );
}
