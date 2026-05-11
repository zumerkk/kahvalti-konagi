"use client";

import { type ReactNode } from "react";

export type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  gradient: "amber" | "emerald" | "violet" | "sky" | "rose";
  trend?: { label: string; isPositive: boolean };
};

const gradients = {
  amber: "from-amber-500/20 via-amber-500/5 to-transparent border-amber-500/20",
  emerald: "from-emerald-500/20 via-emerald-500/5 to-transparent border-emerald-500/20",
  violet: "from-violet-500/20 via-violet-500/5 to-transparent border-violet-500/20",
  sky: "from-sky-500/20 via-sky-500/5 to-transparent border-sky-500/20",
  rose: "from-rose-500/20 via-rose-500/5 to-transparent border-rose-500/20",
};

const iconBg = {
  amber: "bg-amber-500/15 text-amber-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  violet: "bg-violet-500/15 text-violet-400",
  sky: "bg-sky-500/15 text-sky-400",
  rose: "bg-rose-500/15 text-rose-400",
};

export function StatCard({ icon, label, value, sub, gradient, trend }: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${gradients[gradient]} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}
    >
      {/* Glow effect */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.03] blur-2xl transition-all duration-500 group-hover:bg-white/[0.06]" />

      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/50 uppercase">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</div>
          {sub ? <div className="mt-1 text-xs text-white/40">{sub}</div> : null}
          {trend && (
            <div className={`mt-2 text-xs font-medium ${trend.isPositive ? "text-emerald-400" : "text-rose-400"}`}>
              {trend.label}
            </div>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg[gradient]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
