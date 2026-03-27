"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Briefcase, Menu, X, Sun, Moon, Calculator, Send, ChevronDown
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
    { label: "NGO Jobs", href: "/ngo-jobs" },
    { label: "Banking Jobs", href: "/banking-jobs" },
    {
        label: "Salary Calculator",
        href: "/salary-calculator",
        icon: <Calculator className="w-3.5 h-3.5" />,
    },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-100 dark:border-slate-800"
                    : "bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-200 dark:shadow-sky-900 group-hover:scale-105 transition-transform">
                            <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                Career Bridge
                            </span>
                            <span className="block text-xs text-sky-500 font-semibold -mt-0.5">Ethiopia</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                    pathname === link.href
                                        ? "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400"
                                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {/* Telegram */}
                        <a
                            href="https://t.me/careerbridgeethiopia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/50 px-3 py-2 rounded-lg transition-all"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Telegram</span>
                        </a>

                        {/* Dark mode */}
                        {mounted && (
                            <button
                                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                aria-label="Toggle dark mode"
                            >
                                {resolvedTheme === "dark" ? (
                                    <Sun className="w-4.5 h-4.5 w-4.5 h-4.5" />
                                ) : (
                                    <Moon className="w-4.5 h-4.5" />
                                )}
                            </button>
                        )}

                        {/* Post Job CTA */}
                        <Link
                            href="/post-job"
                            className="hidden sm:flex btn-primary text-sm items-center gap-1.5"
                        >
                            <span>+ Post Job</span>
                        </Link>

                        {/* Hamburger */}
                        <button
                            onClick={() => setOpen(!open)}
                            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            aria-label="Toggle menu"
                        >
                            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-slide-down">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    pathname === link.href
                                        ? "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400"
                                        : "text-slate-700 dark:text-slate-300"
                                )}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
                            <Link
                                href="/post-job"
                                onClick={() => setOpen(false)}
                                className="btn-primary w-full text-center text-sm"
                            >
                                + Post a Job
                            </Link>
                            <a
                                href="https://t.me/careerbridgeethiopia"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 text-sm text-sky-600 dark:text-sky-400 py-2"
                            >
                                <Send className="w-4 h-4" />
                                Join Telegram Channel
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
