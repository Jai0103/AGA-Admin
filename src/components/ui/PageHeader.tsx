import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accentClassName?: string;
  children?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  accentClassName = "border-brand-blue",
  children
}: PageHeaderProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
      <div className={`border-l-4 p-6 sm:p-8 ${accentClassName}`}>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-xl border border-brand-sky/20 bg-brand-sky/10 px-3 py-1 text-sm font-bold text-brand-blue">
              <Icon size={16} />
              {eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
              {description}
            </p>
          </div>

          {children ? <div className="shrink-0">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
