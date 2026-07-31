import type { LucideIcon } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "blue" | "mint" | "coral" | "amber" | "emerald" | "rose";
};

const toneClasses = {
  blue: "bg-brand-sky/10 text-brand-blue",
  mint: "bg-brand-mint/10 text-emerald-600 dark:text-emerald-200",
  coral: "bg-brand-coral/10 text-brand-coral",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  emerald:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200"
};

export function SummaryCard({
  label,
  value,
  icon: Icon,
  tone = "blue"
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <strong className="mt-3 block text-3xl font-black">{value}</strong>
        </div>
        <span className={`rounded-2xl p-3 ${toneClasses[tone]}`}>
          <Icon size={20} />
        </span>
      </div>
    </article>
  );
}
