"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Monitor, Landmark, HeartPulse, Globe, GraduationCap, Hammer,
    ShoppingCart, Leaf, Scale, Megaphone, Hotel, Truck, Users,
    Building2, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
    id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
    _count?: { jobs: number };
}

const iconMap: Record<string, React.ReactNode> = {
    monitor: <Monitor className="w-5 h-5" />,
    landmark: <Landmark className="w-5 h-5" />,
    heart: <HeartPulse className="w-5 h-5" />,
    globe: <Globe className="w-5 h-5" />,
    graduation: <GraduationCap className="w-5 h-5" />,
    hammer: <Hammer className="w-5 h-5" />,
    shopping: <ShoppingCart className="w-5 h-5" />,
    leaf: <Leaf className="w-5 h-5" />,
    scale: <Scale className="w-5 h-5" />,
    megaphone: <Megaphone className="w-5 h-5" />,
    hotel: <Hotel className="w-5 h-5" />,
    truck: <Truck className="w-5 h-5" />,
    users: <Users className="w-5 h-5" />,
    building: <Building2 className="w-5 h-5" />,
    briefcase: <Briefcase className="w-5 h-5" />,
};

interface CategorySectionProps {
    categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get("category") || "";

    const handleClick = (slug: string) => {
        const params = new URLSearchParams();
        params.set("category", slug);
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <section className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="section-title">Browse by Category</h2>
                    <Link
                        href="/jobs"
                        className="text-sm text-sky-500 hover:text-sky-600 font-medium transition-colors"
                    >
                        View all →
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleClick(cat.slug)}
                                className={cn(
                                    "group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center hover:-translate-y-0.5 hover:shadow-md",
                                    isActive
                                        ? "border-sky-400 bg-sky-50 dark:bg-sky-950/50 shadow-md shadow-sky-100 dark:shadow-sky-900/30"
                                        : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-sky-200 dark:hover:border-sky-700"
                                )}
                            >
                                <div
                                    className={cn(
                                        "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
                                        isActive ? "text-white shadow-lg" : "group-hover:scale-110"
                                    )}
                                    style={{
                                        backgroundColor: isActive ? cat.color : `${cat.color}20`,
                                        color: isActive ? "white" : cat.color,
                                    }}
                                >
                                    {iconMap[cat.icon] || iconMap.briefcase}
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-xs font-semibold leading-tight",
                                        isActive ? "text-sky-700 dark:text-sky-300" : "text-slate-700 dark:text-slate-200"
                                    )}>
                                        {cat.name}
                                    </p>
                                    {cat._count !== undefined && (
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                            {cat._count.jobs} jobs
                                        </p>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
