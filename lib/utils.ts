import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return "No deadline";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-ET", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function timeAgo(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return formatDate(d);
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export const jobTypeLabels: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    FREELANCE: "Freelance",
    CONTRACTUAL: "Contractual",
    VOLUNTEER: "Volunteer",
    INTERN_PAID: "Intern (Paid)",
    INTERN_UNPAID: "Intern (Unpaid)",
};

export const jobSiteLabels: Record<string, string> = {
    ON_SITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
};

export const experienceLevelLabels: Record<string, string> = {
    ENTRY: "Entry Level",
    JUNIOR: "Junior",
    INTERMEDIATE: "Intermediate",
    SENIOR: "Senior",
    EXPERT: "Expert",
};

export const educationLevelLabels: Record<string, string> = {
    TVET: "TVET",
    SECONDARY: "Secondary School",
    CERTIFICATE: "Certificate",
    DIPLOMA: "Diploma",
    BACHELOR: "Bachelor's Degree",
    MASTER: "Master's Degree",
    PHD: "PhD",
    NOT_REQUIRED: "Not Required",
};

export const genderLabels: Record<string, string> = {
    MALE: "Male",
    FEMALE: "Female",
    ANY: "Any",
};

export const ethiopianCities = [
    "Addis Ababa",
    "Adama",
    "Gondar",
    "Mekelle",
    "Hawassa",
    "Bahir Dar",
    "Dire Dawa",
    "Jimma",
    "Dessie",
    "Jijiga",
    "Shashamane",
    "Bishoftu",
    "Sodo",
    "Arba Minch",
    "Hosaena",
    "Harar",
    "Dilla",
    "Nekemte",
    "Debre Birhan",
    "Asella",
];
