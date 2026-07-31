import {
  CalendarCheck,
  FileText,
  GraduationCap,
  Plus,
  QrCode,
  Search
} from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { students } from "./student.data";
import type {
  PaymentStatus,
  StudentFilters,
  StudentStatus,
  TrainingStatus
} from "./student.types";

const studentStatuses: Array<"All" | StudentStatus> = [
  "All",
  "Active",
  "Pending",
  "Completed",
  "On Hold",
  "Withdrawn"
];

const trainingStatuses: Array<"All" | TrainingStatus> = [
  "All",
  "Not Started",
  "In Progress",
  "Completed",
  "Expired",
  "Suspended"
];

const paymentStatuses: Array<"All" | PaymentStatus> = [
  "All",
  "Unpaid",
  "Partial",
  "Paid",
  "Overdue"
];

const currencyFormatter = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  maximumFractionDigits: 0
});

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function StudentsPage() {
  const [filters, setFilters] = useState<StudentFilters>({
    search: "",
    status: "All",
    trainingStatus: "All",
    paymentStatus: "All"
  });

  const filteredStudents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        student.studentNumber.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.activeCourse.toLowerCase().includes(search);

      const matchesStudentStatus =
        filters.status === "All" || student.status === filters.status;

      const matchesTrainingStatus =
        filters.trainingStatus === "All" ||
        student.trainingStatus === filters.trainingStatus;

      const matchesPaymentStatus =
        filters.paymentStatus === "All" ||
        student.paymentStatus === filters.paymentStatus;

      return (
        matchesSearch &&
        matchesStudentStatus &&
        matchesTrainingStatus &&
        matchesPaymentStatus
      );
    });
  }, [filters]);

  const summary = useMemo(() => {
    const active = students.filter((student) => student.status === "Active").length;
    const readyCertificates = students.filter(
      (student) => student.certificateStatus === "Ready"
    ).length;
    const totalBalance = students.reduce(
      (total, student) => total + student.invoiceBalance,
      0
    );
    const pdfCount = students.reduce(
      (total, student) => total + student.uploadedPdfCount,
      0
    );

    return { active, readyCertificates, totalBalance, pdfCount };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Information"
        title="Students"
        description="Manage student profiles, training status, certificate readiness, payment status, invoice balances, uploaded PDFs, and QR identifiers."
        icon={GraduationCap}
        accentClassName="border-brand-mint"
      >
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy"
        >
          <Plus size={18} />
          Add Student
        </button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active Students"
          value={String(summary.active)}
          icon={GraduationCap}
          tone="mint"
        />
        <SummaryCard
          label="Certificates Ready"
          value={String(summary.readyCertificates)}
          icon={QrCode}
          tone="emerald"
        />
        <SummaryCard
          label="Invoice Balance"
          value={currencyFormatter.format(summary.totalBalance)}
          icon={CalendarCheck}
          tone="amber"
        />
        <SummaryCard
          label="Uploaded PDFs"
          value={String(summary.pdfCount)}
          icon={FileText}
          tone="blue"
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
              placeholder="Search name, student number, email, or course..."
            />
          </label>

          <FilterSelect
            label="Student status"
            value={filters.status}
            options={studentStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                status: value as StudentFilters["status"]
              }))
            }
          />

          <FilterSelect
            label="Training status"
            value={filters.trainingStatus}
            options={trainingStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                trainingStatus: value as StudentFilters["trainingStatus"]
              }))
            }
          />

          <FilterSelect
            label="Payment status"
            value={filters.paymentStatus}
            options={paymentStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                paymentStatus: value as StudentFilters["paymentStatus"]
              }))
            }
          />
        </div>
      </section>

      {filteredStudents.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No students found"
          description="Try adjusting the search or filters to find a student record."
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7 xl:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Training</th>
                  <th className="px-5 py-4">Dates</th>
                  <th className="px-5 py-4">Certificate</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="align-top">
                    <td className="px-5 py-5">
                      <div className="font-bold">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {student.studentNumber}
                      </div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {student.email}
                      </div>
                      <div className="mt-3">
                        <StatusBadge value={student.status} />
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">{student.activeCourse}</div>
                      <div className="mt-3">
                        <StatusBadge value={student.trainingStatus} />
                      </div>
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      <div>Start: {formatDate(student.startDate)}</div>
                      <div className="mt-1">
                        Target: {formatDate(student.targetCompletionDate)}
                      </div>
                      <div className="mt-1">
                        Complete: {formatDate(student.completionDate)}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <StatusBadge value={student.certificateStatus} />
                      <div className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <QrCode size={16} />
                        {student.qrCodeValue}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <StatusBadge value={student.paymentStatus} />
                      <div className="mt-3 font-semibold">
                        {currencyFormatter.format(student.invoiceBalance)}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 font-semibold">
                        <FileText size={16} className="text-brand-blue" />
                        {student.uploadedPdfCount} PDFs
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CalendarCheck size={16} />
                        {formatDate(student.updatedAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="grid gap-4 xl:hidden">
            {filteredStudents.map((student) => (
              <article
                key={student.studentId}
                className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {student.studentNumber}
                    </p>
                  </div>
                  <StatusBadge value={student.status} />
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">{student.activeCourse}</p>
                    <div className="mt-2">
                      <StatusBadge value={student.trainingStatus} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                    <Detail label="Start" value={formatDate(student.startDate)} />
                    <Detail
                      label="Target"
                      value={formatDate(student.targetCompletionDate)}
                    />
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Payment
                      </p>
                      <StatusBadge value={student.paymentStatus} />
                    </div>
                    <Detail label="PDFs" value={String(student.uploadedPdfCount)} />
                  </div>
                </div>
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
