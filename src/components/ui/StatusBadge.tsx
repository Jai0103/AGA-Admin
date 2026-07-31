import { clsx } from "clsx";

const statusClasses = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  Completed: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200",
  "On Hold": "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-200",
  Withdrawn: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  Draft: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  "Pending Review": "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  "In Training": "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200",
  Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  "Not Started": "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200",
  Expired: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  Suspended: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  Revoked: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  "Not Eligible": "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  Ready: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  Generated: "bg-cyan-100 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-200",
  Issued: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-200",
  Unpaid: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  Partial: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  "Deposit Paid": "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  Paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  Overdue: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  "No Invoice PDF": "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  Uploaded: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  Missing: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  "Needs Replacement": "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  Archived: "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  "Not Sent": "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  Sent: "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200",
  Signed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  Rejected: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  "Not Submitted": "bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  Submitted: "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200",
  Verified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  "Needs Correction": "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200",
  Passed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200",
  Failed: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-200",
  "Requires Follow Up": "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200"
};

type StatusBadgeProps = {
  value: keyof typeof statusClasses;
  className?: string;
};

export function StatusBadge({ value, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        statusClasses[value],
        className
      )}
    >
      {value}
    </span>
  );
}
