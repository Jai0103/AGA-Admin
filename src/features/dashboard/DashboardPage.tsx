import {
  BadgeCheck,
  CircleDollarSign,
  FileUp,
  GraduationCap,
  Plane,
  Sparkles
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { MetricCard } from "../../components/ui/MetricCard";
import {
  activityTrend,
  complianceItems,
  courseMix,
  dashboardStats,
  recentRecords
} from "../../lib/dashboard-data";

const icons = [
  GraduationCap,
  Sparkles,
  BadgeCheck,
  CircleDollarSign,
  FileUp,
  Plane
];

const pieColors = ["#0568a6", "#22c7a9", "#ff6b5f", "#7c3aed"];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <div className="border-l-4 border-brand-blue p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-xl border border-brand-sky/20 bg-brand-sky/10 px-3 py-1 text-sm font-bold text-brand-blue">
                <BadgeCheck size={16} />
                Admin Overview
              </span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                Dashboard
              </h2>
              <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                Monitor student records, enrolments, certificates, invoices,
                uploads, and operational activity across Apollo Global Academy.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy"
            >
              <GraduationCap size={18} />
              New Student
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-200 bg-emerald-50/76 shadow-panel backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10">
        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-200">
              <BadgeCheck size={22} />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                Compliance Monitoring
              </p>
              <h3 className="mt-2 text-xl font-black">
                SIS data quality is within its target operating range
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Certificate templates, PDF links, enrolment agreements, and
                invoice records are being tracked for audit readiness.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-slate-300 bg-white/80 px-4 py-3 text-sm font-bold text-brand-navy shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-white">
              Review Exceptions
            </button>
            <button className="rounded-2xl bg-brand-navy px-4 py-3 text-sm font-bold text-white shadow-glow">
              Export Report
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {dashboardStats.map((stat, index) => (
          <MetricCard key={stat.label} {...stat} icon={icons[index]} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <article className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-blue">
                Activity Trend
              </p>
              <h3 className="mt-2 text-xl font-black">
                Monthly SIS Activity
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Enrolments, completions, and invoices updated over the last 6
                months.
              </p>
            </div>

            <div className="rounded-2xl border border-brand-sky/20 bg-brand-sky/10 px-4 py-3 text-brand-blue">
              <strong className="block text-2xl">140</strong>
              <span className="text-xs font-bold uppercase">
                Records this period
              </span>
            </div>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrend}>
                <defs>
                  <linearGradient
                    id="enrolmentGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0568a6" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#0568a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e5ef" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="enrolments"
                  stroke="#0568a6"
                  strokeWidth={3}
                  fill="url(#enrolmentGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="completions"
                  stroke="#22c7a9"
                  strokeWidth={3}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-blue">
                Latest Updates
              </p>
              <h3 className="mt-2 text-xl font-black">Recent Records</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Most recently updated student files.
              </p>
            </div>
            <button className="text-sm font-bold text-brand-blue">
              View all
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {recentRecords.map((record) => (
              <div
                key={`${record.student}-${record.updatedAt}`}
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{record.student}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {record.course}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      {record.updatedAt}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
                    {record.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-blue">
            Course Mix
          </p>
          <h3 className="mt-2 text-xl font-black">
            Active Training Distribution
          </h3>

          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseMix}
                  dataKey="value"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={5}
                >
                  {courseMix.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {courseMix.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: pieColors[index] }}
                />
                <span className="font-semibold">{item.name}</span>
                <span className="text-slate-500">{item.value}%</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-blue">
            Audit Readiness
          </p>
          <h3 className="mt-2 text-xl font-black">Operational Health</h3>

          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={complianceItems}
                layout="vertical"
                margin={{ left: 18 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d9e5ef" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={150}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar
                  dataKey="value"
                  radius={[0, 12, 12, 0]}
                  fill="#22c7a9"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </div>
  );
}
