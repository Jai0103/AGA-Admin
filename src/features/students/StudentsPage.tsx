import {
  CalendarCheck,
  FileText,
  GraduationCap,
  Loader2,
  Plus,
  QrCode,
  Search,
  ServerCrash
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { listStudentsFromApi } from "./student.service";
import type {
  InvoicePdfStatus,
  Student,
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

const invoicePdfStatuses: Array<"All" | InvoicePdfStatus> = [
  "All",
  "No Invoice PDF",
  "Uploaded",
  "Missing",
  "Needs Replacement"
];

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState<StudentFilters>({
    search: "",
    status: "All",
    trainingStatus: "All",
    invoicePdfStatus: "All"
  });

  useEffect(() => {
    let mounted = true;

    setIsLoading(true);
    setErrorMessage("");

    listStudentsFromApi()
      .then((response) => {
        if (mounted) {
          setStudents(response.students);
        }
      })
      .catch((error: Error) => {
        if (mounted) {
          setErrorMessage(error.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

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

      const matchesInvoicePdfStatus =
        filters.invoicePdfStatus === "All" ||
        student.invoicePdfStatus === filters.invoicePdfStatus;

      return (
        matchesSearch &&
        matchesStudentStatus &&
        matchesTrainingStatus &&
        matchesInvoicePdfStatus
      );
    });
  }, [filters, students]);

  const summary = useMemo(() => {
    const active = students.filter((student) => student.status === "Active").length;
    const readyCertificates = students.filter(
      (student) => student.certificateStatus === "Ready"
    ).length;
    const invoicePdfs = students.reduce(
      (total, student) => total + toNumber(student.invoicePdfCount),
      0
    );
    const pdfCount = students.reduce(
      (total, student) => total + toNumber(student.uploadedPdfCount),
      0
    );

    return { active, readyCertificates, invoicePdfs, pdfCount };
  }, [students]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Information"
        title="Students"
        description="Manage live student profiles from Google Sheets, including training status, certificate readiness, uploaded finance invoice PDFs, student documents, and QR identifiers."
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
        <SummaryCard label="Active Students" value={String(summary.active)} icon={GraduationCap} tone="mint" />
        <SummaryCard label="Certificates Ready" value={String(summary.readyCertificates)} icon={QrCode} tone="emerald" />
        <SummaryCard label="Invoice PDFs" value={String(summary.invoicePdfs)} icon={FileText} tone="amber" />
        <SummaryCard label="Uploaded PDFs" value={String(summary.pdfCount)} icon={FileText} tone="blue" />
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
            label="Invoice PDF status"
            value={filters.invoicePdfStatus}
            options={invoicePdfStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                invoicePdfStatus: value as StudentFilters["invoicePdfStatus"]
              }))
            }
          />
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-3xl border border-white/70 bg-white/86 p-8 text-center shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <Loader2 className="mx-auto animate-spin text-brand-blue" size={32} />
          <h3 className="mt-4 text-xl font-black">Loading live students</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Fetching records from Google Sheets through Apps Script.
          </p>
        </section>
      ) : errorMessage ? (
        <section className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 shadow-panel backdrop-blur-xl dark:border-rose-400/20 dark:bg-rose-400/10">
          <ServerCrash className="text-rose-600 dark:text-rose-200" size={32} />
          <h3 className="mt-4 text-xl font-black">Could not load students</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {errorMessage}
          </p>
        </section>
      ) : filteredStudents.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No students found"
          description="No live Google Sheets students match the current search or filters."
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
                  <th className="px-5 py-4">Invoice PDF</th>
                  <th className="px-5 py-4">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="align-top">
                    <td className="px-5 py-5">
                      <Link
                        to={`/students/${student.studentId}`}
                        className="font-bold text-brand-blue hover:text-brand-navy dark:hover:text-white"
                      >
                        {student.firstName} {student.lastName}
                      </Link>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {student.studentNumber}
                      </div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {student.email || "No email"}
                      </div>
                      <div className="mt-3">
                        <StatusBadge value={student.status} />
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">
                        {student.activeCourse || "No course assigned"}
                      </div>
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
                      <StatusBadge value={student.invoicePdfStatus} />
                      <div className="mt-3 font-semibold">
                        {toNumber(student.invoicePdfCount)} invoice PDF
                        {toNumber(student.invoicePdfCount) === 1 ? "" : "s"}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2 font-semibold">
                        <FileText size={16} className="text-brand-blue" />
                        {toNumber(student.uploadedPdfCount)} PDFs
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
              <Link
                key={student.studentId}
                to={`/students/${student.studentId}`}
                className="rounded-3xl border border-white/70 bg-white/86 p-5 text-inherit shadow-panel backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-white/7"
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
                    <p className="font-semibold">
                      {student.activeCourse || "No course assigned"}
                    </p>
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
                        Invoice PDF
                      </p>
                      <StatusBadge value={student.invoicePdfStatus} />
                    </div>
                    <Detail
                      label="PDFs"
                      value={String(toNumber(student.uploadedPdfCount))}
                    />
                  </div>
                </div>
              </Link>
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
