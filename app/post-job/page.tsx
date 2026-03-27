"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Briefcase, Building2, MapPin, DollarSign, Calendar,
    Globe, Mail, CheckCircle2, ChevronRight, Loader2
} from "lucide-react";
import {
    jobTypeLabels, jobSiteLabels, experienceLevelLabels,
    educationLevelLabels, genderLabels, ethiopianCities, cn
} from "@/lib/utils";

interface Category {
    id: string;
    name: string;
}

export default function PostJobPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        companyName: "",
        companyLogo: "",
        companyWebsite: "",
        location: "Addis Ababa",
        categoryId: "",
        jobType: "FULL_TIME",
        jobSite: "ON_SITE",
        experienceLevel: "ENTRY",
        educationLevel: "BACHELOR",
        gender: "ANY",
        salary: "",
        deadline: "",
        applyUrl: "",
        applyEmail: "",
        description: "",
        requirements: "",
    });

    useEffect(() => {
        fetch("/api/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                if (data.length > 0) setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to post job");
            }

            setSubmitted(true);
            setTimeout(() => router.push("/jobs"), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">Job Posted Successfully!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                    Your job vacancy has been published and is now visible to thousands of job seekers.
                </p>
                <button
                    onClick={() => router.push("/jobs")}
                    className="btn-primary"
                >
                    View All Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Post a Job</h1>
                <p className="text-slate-500 mt-1 text-sm">Fill in the details below to reach Ethiopia&apos;s top talent.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800 p-4 rounded-xl text-rose-600 dark:text-rose-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Section 1: Basic Info */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-sky-500" />
                        Basic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="filter-label">Job Title *</label>
                            <input
                                required
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Senior Software Engineer"
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Category *</label>
                            <select
                                required
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Job Type</label>
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {Object.entries(jobTypeLabels).map(([val, lab]) => (
                                    <option key={val} value={val}>{lab}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Work Mode</label>
                            <select
                                name="jobSite"
                                value={formData.jobSite}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {Object.entries(jobSiteLabels).map(([val, lab]) => (
                                    <option key={val} value={val}>{lab}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 2: Requirements */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-sky-500" />
                        Qualifications & Salary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="filter-label">Location *</label>
                            <select
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {ethiopianCities.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Experience</label>
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {Object.entries(experienceLevelLabels).map(([val, lab]) => (
                                    <option key={val} value={val}>{lab}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Education</label>
                            <select
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                className="input-field"
                            >
                                {Object.entries(educationLevelLabels).map(([val, lab]) => (
                                    <option key={val} value={val}>{lab}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Salary (optional)</label>
                            <input
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g. ETB 15,000 - 20,000"
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Company Info */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-sky-500" />
                        Company details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="filter-label">Company Name *</label>
                            <input
                                required
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="e.g. Commercial Bank of Ethiopia"
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Logo URL (optional)</label>
                            <input
                                name="companyLogo"
                                value={formData.companyLogo}
                                onChange={handleChange}
                                placeholder="https://example.com/logo.png"
                                className="input-field"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 4: Details */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-sky-500" />
                        Job Details & Application
                    </h2>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="filter-label">Deadline</label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">How to Apply (URL or Email)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                    name="applyUrl"
                                    value={formData.applyUrl}
                                    onChange={handleChange}
                                    placeholder="Application URL"
                                    className="input-field"
                                />
                                <input
                                    name="applyEmail"
                                    value={formData.applyEmail}
                                    onChange={handleChange}
                                    placeholder="Application Email"
                                    className="input-field"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Job Description *</label>
                            <textarea
                                required
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Describe the role in detail..."
                                className="input-field resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="filter-label">Requirements (Bulleted list)</label>
                            <textarea
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                rows={4}
                                placeholder="• 3+ years experience
• Degree in CS or related field
• Strong communication skills"
                                className="input-field resize-none"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Publish Job
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
