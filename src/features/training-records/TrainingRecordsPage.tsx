import {
  BarChart3,
  ClipboardList,
  FileText,
  Plus,
  Search,
  Timer
} from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { trainingRecords } from "./training-record.data";
import type {
  TrainingRecordFilters,
  TrainingRecordResult,
  TrainingRecordType
} from "./training-record.types";

const recordTypes: Array<"All" | TrainingRecordType> = [
  "All",
  "Theory Lesson",
  "Practical Lesson",
  "Assessment",
  "Remedial",
  "Completion"
];

const recordResults: Array<"All" | TrainingRecordResult> = [
  "All",
  "Pending",
  "Passed",
  "Failed",
  "Completed",
  "Requires Follow Up"
];

const courseCodes = [
  "All",
  ...Array.from(new Set(trainingRecords.map((record) => record.courseCode)))
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
}

export function TrainingRecordsPage() {
  const [filters, setFilters] = useState<TrainingRecordFilters>({
    search: "",
    recordType: "All",
    result: "All",
    courseCode: "All"
  });

  const filteredRecords = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return trainingRecords.filter((record) => {
      const matchesSearch =
        !search ||
        record.studentName.toLowerCase().includes(search) ||
        record.studentNumber.toLowerCase().includes(search) ||
        record.courseName.toLowerCase().includes(search) ||
        record.courseCode.toLowerCase().includes(search) ||
        record.moduleName.toLowerCase().includes(search) ||
        record.trainerName.toLowerCase().includes(search);

      const matchesType =
        filters.recordType === "All" || record.recordType === filters.recordType;

      const matchesResult =
        filters.result === "All" || record.result === filters.result;

      const matchesCourse =
        filters.courseCode === "All" || record.courseCode === filters.courseCode;

      return matchesSearch && matchesType && matchesResult && matchesCourse;
    });
  }, [filters]);

  const summary = useMemo(() => {
    const totalDuration = trainingRecords.reduce(
      (total, record) => total + record.durationMinutes,
      0
    );
    const assessments = trainingRecords.filter(
      (record) => record.recordType === "Assessment"
    ).length;
    const passed = trainingRecords.filter(
      (record) => record.result === "Passed" || record.result === "Completed"
    ).length;
    const pdfs = trainingRecords.filter((record) => record.pdfUrl).length;

    return { totalDuration, assessments, passed, pdfs };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Training Records"
        title="Records"
        description="Review lesson entries, assessment outcomes, completion records, trainer remarks, training duration, and supporting PDFs."
        icon={ClipboardList}
        accentClassName="border-brand-coral"
      >
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy"
        >
          <Plus size={18} />
          New Record
        </button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Recorded Time"
          value={formatDuration(summary.totalDuration)}
          icon={Timer}
          tone="coral"
        />
        <SummaryCard
          label="Assessments"
          value={String(summary.assessments)}
          icon={ClipboardList}
          tone="blue"
        />
        <SummaryCard
          label="Passed or Complete"
          value={String(summary.passed)}
          icon={BarChart3}
          tone="emerald"
        />
        <SummaryCard
          label="PDF Records"
          value={String(summary.pdfs)}
          icon={FileText}
          tone="amber"
        />
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <label className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <Search size={18} className="text-slate-400" />
            <input
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  search: event.target.value
                }))
              }
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search student, module, trainer, or course..."
            />
          </label>

          <FilterSelect
            label="Record type"
            value={filters.recordType}
            options={recordTypes}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                recordType: value as TrainingRecordFilters["recordType"]
              }))
            }
          />

          <FilterSelect
            label="Result"
            value={filters.result}
            options={recordResults}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                result: value as TrainingRecordFilters["result"]
              }))
            }
          />

          <FilterSelect
            label="Course"
            value={filters.courseCode}
            options={courseCodes}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                courseCode: value
              }))
            }
          />
        </div>
      </section>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No training records found"
          description="Try adjusting the search or filters to find a training record."
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7 xl:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Record</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Module</th>
                  <th className="px-5 py-4">Result</th>
                  <th className="px-5 py-4">Trainer</th>
                  <th className="px-5 py-4">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredRecords.map((record) => (
                  <tr key={record.recordId} className="align-top">
                    <td className="px-5 py-5">
                      <div className="font-bold">{record.recordId}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {record.recordType}
                      </div>
                      <div className="mt-2 text-slate-500 dark:text-slate-400">
                        {formatDate(record.recordDate)}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">{record.studentName}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {record.studentNumber}
                      </div>
                      <div className="mt-2 text-slate-500 dark:text-slate-400">
                        {record.courseCode}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">{record.moduleName}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {record.courseName}
                      </div>
                      <p className="mt-3 text-slate-600 dark:text-slate-300">
                        {record.remarks}
                      </p>
                    </td>
                    <td className="px-5 py-5">
                      <StatusBadge value={record.result} />
                      <div className="mt-3 font-semibold">
                        Score: {record.score ?? "-"}
                      </div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {formatDuration(record.durationMinutes)}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      {record.trainerName}
                    </td>
                    <td className="px-5 py-5">
                      {record.pdfUrl ? (
                        <a
                          href={record.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-bold text-brand-blue dark:border-white/10 dark:bg-white/5"
                        >
                          <FileText size={16} />
                          View PDF
                        </a>
                      ) : (
                        <span className="text-slate-400">No PDF</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="grid gap-4 xl:hidden">
            {filteredRecords.map((record) => (
              <article
                key={record.recordId}
                className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black">{record.moduleName}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {record.studentName} · {record.courseCode}
                    </p>
                  </div>
                  <StatusBadge value={record.result} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Detail label="Type" value={record.recordType} />
                  <Detail label="Date" value={formatDate(record.recordDate)} />
                  <Detail
                    label="Duration"
                    value={formatDuration(record.durationMinutes)}
                  />
                  <Detail label="Score" value={String(record.score ?? "-")} />
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {record.remarks}
                </p>
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}

type DetailProps = {
  label: string;
  value: string;
};

function Detail({ label, value }: DetailProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      {value}
    </div>
  );
}
