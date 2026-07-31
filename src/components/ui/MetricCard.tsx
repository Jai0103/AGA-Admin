import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

const toneClasses = {
  blue: "border-t-brand-blue text-brand-blue bg-sky-50 dark:bg-sky-500/10",
  amber: "border-t-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-500/10",
  emerald:
    "border-t-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10",
  rose: "border-t-rose-400 text-rose-600 bg-rose-50 dark:bg-rose-500/10",
  violet:
    "border-t-violet-400 text-violet-600 bg-violet-50 dark:bg-violet-500/10",
  cyan: "border-t-cyan-400 text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10"
};

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  tone: keyof typeof toneClasses;
  icon: LucideIcon;
};

export function MetricCard({
  label,
  value,
  detail,
  tone,
  icon: Icon
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 border-t-4 bg-white/84 p-5 shadow-panel backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <strong className="mt-3 block text-3xl font-black tracking-tight">
            {value}
          </strong>
        </div>
        <span className={clsx("rounded-2xl p-3", toneClasses[tone])}>
          <Icon size={20} />
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {detail}
      </p>
    </article>
  );
}
