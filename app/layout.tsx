import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
    title: {
        default: "Career Bridge Ethiopia – Find Your Dream Job",
        template: "%s | Career Bridge Ethiopia",
    },
    description:
        "Ethiopia's leading job portal. Find thousands of job vacancies across IT, Banking, NGO, Engineering, Healthcare and more. Mobile-first, fast, and free.",
    keywords: ["jobs in Ethiopia", "ethiopia vacancies", "career Ethiopia", "NGO jobs Ethiopia", "banking jobs Ethiopia"],
    openGraph: {
        title: "Career Bridge Ethiopia",
        description: "Find your dream job in Ethiopia",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-1 pb-6">{children}</main>
                        <footer className="bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 py-8 mt-auto">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                    © {new Date().getFullYear()} Career Bridge Ethiopia. All rights reserved.
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Empowering Ethiopia&apos;s workforce
                                </p>
                            </div>
                        </footer>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
