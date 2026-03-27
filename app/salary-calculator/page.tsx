"use client";

import { useState } from "react";
import { Calculator, Info } from "lucide-react";
import type { Metadata } from "next";

// Ethiopian Income Tax Brackets (2024)
const TAX_BRACKETS = [
    { min: 0, max: 600, rate: 0, deduction: 0 },
    { min: 601, max: 1650, rate: 0.1, deduction: 60 },
    { min: 1651, max: 3200, rate: 0.15, deduction: 142.5 },
    { min: 3201, max: 5250, rate: 0.2, deduction: 302.5 },
    { min: 5251, max: 7800, rate: 0.25, deduction: 565 },
    { min: 7801, max: 10900, rate: 0.3, deduction: 955 },
    { min: 10901, max: Infinity, rate: 0.35, deduction: 1500 },
];

function calculateTax(grossSalary: number): {
    incomeTax: number;
    employeePension: number;
    employerPension: number;
    netSalary: number;
    effectiveRate: number;
} {
    const bracket = TAX_BRACKETS.find(
        (b) => grossSalary >= b.min && grossSalary <= b.max
    ) || TAX_BRACKETS[TAX_BRACKETS.length - 1];

    const incomeTax = Math.max(0, grossSalary * bracket.rate - bracket.deduction);
    const employeePension = grossSalary <= 1000 ? 0 : grossSalary * 0.07; // 7% employee
    const employerPension = grossSalary <= 1000 ? 0 : grossSalary * 0.11; // 11% employer
    const netSalary = grossSalary - incomeTax - employeePension;
    const effectiveRate = grossSalary > 0 ? ((incomeTax + employeePension) / grossSalary) * 100 : 0;

    return { incomeTax, employeePension, employerPension, netSalary, effectiveRate };
}

function formatETB(amount: number) {
    return `ETB ${amount.toLocaleString("en-ET", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SalaryCalculatorPage() {
    const [gross, setGross] = useState("");
    const result = gross && Number(gross) > 0 ? calculateTax(Number(gross)) : null;

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-sky-100 dark:bg-sky-950 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-sky-600 dark:text-sky-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Salary Calculator</h1>
                    <p className="text-sm text-slate-500">Ethiopian income tax & pension calculator</p>
                </div>
            </div>

            <div className="card p-6 mb-5">
                <label className="filter-label" htmlFor="gross">Gross Monthly Salary (ETB)</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">ETB</span>
                    <input
                        id="gross"
                        type="number"
                        value={gross}
                        onChange={(e) => setGross(e.target.value)}
                        placeholder="e.g. 15,000"
                        className="input-field pl-14"
                        min="0"
                    />
                </div>
            </div>

            {result && (
                <div className="space-y-4 animate-fade-in">
                    {/* Net salary highlight */}
                    <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-sky-200 dark:shadow-sky-900">
                        <p className="text-sky-100 text-sm mb-1">Take-Home (Net) Salary</p>
                        <p className="text-4xl font-bold">{formatETB(result.netSalary)}</p>
                        <p className="text-sky-200 text-xs mt-1">Per Month</p>
                    </div>

                    {/* Breakdown */}
                    <div className="card p-5 space-y-3">
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Breakdown</h2>

                        {[
                            { label: "Gross Salary", value: Number(gross), color: "text-slate-900 dark:text-slate-100", bg: "bg-slate-50 dark:bg-slate-700/50" },
                            { label: "Income Tax (withheld)", value: -result.incomeTax, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/30" },
                            { label: "Employee Pension (7%)", value: -result.employeePension, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30" },
                            { label: "Net Salary", value: result.netSalary, color: "text-emerald-600 font-bold", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
                        ].map((item) => (
                            <div key={item.label} className={`flex justify-between items-center p-3 rounded-xl ${item.bg}`}>
                                <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                                <span className={`text-sm font-semibold ${item.color}`}>
                                    {item.value < 0 ? "−" : ""}{formatETB(Math.abs(item.value))}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Employer cost */}
                    <div className="card p-5">
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Employer&apos;s Total Cost</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-300">Gross Salary</span>
                                <span className="font-medium">{formatETB(Number(gross))}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-300">Employer Pension (11%)</span>
                                <span className="font-medium text-amber-600">{formatETB(result.employerPension)}</span>
                            </div>
                            <div className="flex justify-between text-sm border-t pt-2 border-slate-100 dark:border-slate-700">
                                <span className="text-slate-900 dark:text-slate-100 font-semibold">Total Cost</span>
                                <span className="font-bold text-sky-600">{formatETB(Number(gross) + result.employerPension)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tax bracket info */}
                    <div className="bg-sky-50 dark:bg-sky-950/30 rounded-2xl p-4 flex gap-2">
                        <Info className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-sky-700 dark:text-sky-300">
                            Effective tax rate: <strong>{result.effectiveRate.toFixed(1)}%</strong> of gross salary.
                            Based on Ethiopian Income Tax Proclamation (2024 brackets).
                        </p>
                    </div>

                    {/* Tax brackets table */}
                    <div className="card p-5">
                        <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Tax Bracket Reference</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-700">
                                        <th className="text-left py-2 text-slate-500">Income Range (ETB)</th>
                                        <th className="text-right py-2 text-slate-500">Tax Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TAX_BRACKETS.map((b, i) => (
                                        <tr
                                            key={i}
                                            className={`border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${Number(gross) >= b.min && Number(gross) <= b.max
                                                    ? "bg-sky-50 dark:bg-sky-950/30"
                                                    : ""
                                                }`}
                                        >
                                            <td className="py-2 text-slate-600 dark:text-slate-300">
                                                {b.min.toLocaleString()} – {b.max === Infinity ? "Above" : b.max.toLocaleString()}
                                            </td>
                                            <td className="py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                                                {(b.rate * 100).toFixed(0)}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
