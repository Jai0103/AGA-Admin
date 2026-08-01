import {
  AlertTriangle,
  CalendarCheck,
  Eye,
  FileText,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  QrCode,
  Search,
  ServerCrash,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { archiveStudentInApi, listStudentsFromApi } from "./student.service";
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
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return "-";
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return rawValue;
  }

  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(parsedDate);
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function studentName(student: Student) {
  const legacyName = [student.firstName, student.lastName]
    .filter((part) => part && part !== "-")
    .join(" ");

  return student.nameAsPerId || student.preferredName || legacyName || "-";
}

function contactNumber(student: Student) {
  return String(student.contactNumber || student.phone || "");
}

function studentStatus(student: Student) {
  return student.studentStatus || student.status;
}

function uploadedFileCount(student: Student) {
  return toNumber(student.uploadedFileCount ?? student.uploadedPdfCount);
}

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isArchiving, setIsArchiving] = useState(false);
  const [studentToArchive, setStudentToArchive] = useState<Student | null>(null);
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

  async function handleArchiveStudent() {
    if (!studentToArchive) {
      return;
    }

    setIsArchiving(true);

    try {
      const response = await archiveStudentInApi({
        studentId: studentToArchive.studentId
      });

      setStudents((current) =>
        current.map((student) =>
          student.studentId === response.student.studentId
            ? response.student
            : student
        )
      );
      setStudentToArchive(null);
      toast.success("Student archived");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not archive student.";
      toast.error(message);
    } finally {
      setIsArchiving(false);
    }
  }

  const filteredStudents = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return students.filter((student) => {
      const searchableValues = [
        studentName(student),
        student.studentNumber,
        student.email,
        student.companyEmail,
        contactNumber(student),
        student.activeCourse
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableValues.includes(search);

      const matchesStudentStatus =
        filters.status === "All" || studentStatus(student) === filters.status;

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
    const active = students.filter(
      (student) => studentStatus(student) === "Active"
    ).length;
    const readyCertificates = students.filter(
      (student) => student.certificateStatus === "Ready"
    ).length;
    const invoicePdfs = students.reduce(
      (total, student) => total + toNumber(student.invoicePdfCount),
      0
    );
    const fileCount = students.reduce(
      (total, student) => total + uploadedFileCount(student),
      0
    );

    return { active, readyCertificates, invoicePdfs, fileCount };
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
        <Link
          to="/students/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy"
        >
          <Plus size={18} />
          Add Student
        </Link>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Active Students" value={String(summary.active)} icon={GraduationCap} tone="mint" />
        <SummaryCard label="Certificates Ready" value={String(summary.readyCertificates)} icon={QrCode} tone="emerald" />
        <SummaryCard label="Invoice PDFs" value={String(summary.invoicePdfs)} icon={FileText} tone="amber" />
        <SummaryCard label="Uploaded Files" value={String(summary.fileCount)} icon={FileText} tone="blue" />
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
              placeholder="Search name, student number, email, phone, or course..."
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
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.studentId}
                    className="align-top transition hover:bg-brand-sky/6 dark:hover:bg-white/4"
                  >
                    <td className="px-5 py-5">
                      <Link
                        to={`/students/${student.studentId}`}
                        className="font-bold text-brand-blue hover:text-brand-navy dark:hover:text-white"
                      >
                        {studentName(student)}
                      </Link>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {student.studentNumber}
                      </div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {student.email || student.companyEmail || "No email"}
                      </div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {contactNumber(student) || "No phone"}
                      </div>
                      <div className="mt-3">
                        <StatusBadge value={studentStatus(student)} />
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
                        {student.qrCodeValue || student.studentId}
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
                        {uploadedFileCount(student)} files
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <CalendarCheck size={16} />
                        {formatDate(student.updatedAt)}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex justify-end gap-2">
                        <ActionLink
                          to={`/students/${student.studentId}`}
                          label="View"
                          icon={Eye}
                        />
                        <ActionLink
                          to={`/students/${student.studentId}/edit`}
                          label="Edit"
                          icon={Pencil}
                          tone="neutral"
                        />
                        <ActionButton
                          label="Archive"
                          icon={Trash2}
                          danger
                          disabled={studentStatus(student) === "Withdrawn"}
                          onClick={() => setStudentToArchive(student)}
                        />
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
                className="rounded-3xl border border-white/70 bg-white/86 p-5 text-inherit shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black">{studentName(student)}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {student.studentNumber}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {contactNumber(student) || "No phone"}
                    </p>
                  </div>
                  <StatusBadge value={studentStatus(student)} />
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
                      label="Files"
                      value={String(uploadedFileCount(student))}
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
                  <ActionLink
                    to={`/students/${student.studentId}`}
                    label="View"
                    icon={Eye}
                  />
                  <ActionLink
                    to={`/students/${student.studentId}/edit`}
                    label="Edit"
                    icon={Pencil}
                    tone="neutral"
                  />
                  <ActionButton
                    label="Archive"
                    icon={Trash2}
                    danger
                    disabled={studentStatus(student) === "Withdrawn"}
                    onClick={() => setStudentToArchive(student)}
                  />
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {studentToArchive ? (
        <ArchiveStudentDialog
          student={studentToArchive}
          isArchiving={isArchiving}
          onCancel={() => setStudentToArchive(null)}
          onConfirm={handleArchiveStudent}
        />
      ) : null}
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

type ActionIcon = typeof Eye;

type ActionLinkProps = {
  to: string;
  label: string;
  icon: ActionIcon;
  tone?: "primary" | "neutral";
};

function ActionLink({
  to,
  label,
  icon: Icon,
  tone = "primary"
}: ActionLinkProps) {
  const toneClassName =
    tone === "primary"
      ? "border-brand-blue/20 bg-white/90 text-brand-blue hover:border-brand-blue hover:bg-brand-blue hover:text-white focus:ring-brand-sky/20 dark:border-white/10 dark:bg-white/7 dark:text-brand-sky"
      : "border-slate-200 bg-white/90 text-slate-600 hover:border-brand-blue hover:bg-brand-blue hover:text-white focus:ring-brand-sky/20 dark:border-white/10 dark:bg-white/7 dark:text-slate-200";

  return (
    <Link
      to={to}
      aria-label={label}
      className={`group relative inline-grid size-10 place-items-center rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-glow focus:outline-none focus:ring-4 ${toneClassName}`}
    >
      <Icon size={17} strokeWidth={2.4} />
      <Tooltip label={label} />
    </Link>
  );
}

type ActionButtonProps = {
  label: string;
  icon: ActionIcon;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

function ActionButton({
  label,
  icon: Icon,
  danger,
  disabled,
  onClick
}: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={onClick}
      className={`group relative inline-grid size-10 place-items-center rounded-2xl border shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-45 ${
        danger
          ? "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-500 hover:bg-rose-600 hover:text-white focus:ring-rose-200 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200"
          : "border-slate-200 bg-white/90 text-slate-600 hover:border-brand-blue hover:bg-brand-blue hover:text-white focus:ring-brand-sky/20 dark:border-white/10 dark:bg-white/7 dark:text-slate-200"
      }`}
    >
      <Icon size={17} strokeWidth={2.4} />
      <Tooltip
        label={disabled ? "Already archived" : label}
      />
    </button>
  );
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute -top-11 left-1/2 z-20 w-max max-w-[220px] -translate-x-1/2 translate-y-1 rounded-xl bg-brand-navy px-3 py-2 text-xs font-black text-white opacity-0 shadow-xl ring-1 ring-white/10 transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 dark:bg-white dark:text-brand-navy">
      {label}
      <span className="absolute left-1/2 top-full size-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-brand-navy dark:bg-white" />
    </span>
  );
}

type ArchiveStudentDialogProps = {
  student: Student;
  isArchiving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function ArchiveStudentDialog({
  student,
  isArchiving,
  onCancel,
  onConfirm
}: ArchiveStudentDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-brand-navy/45 px-4 backdrop-blur-md">
      <section className="w-full max-w-lg rounded-3xl border border-white/70 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-400/10 dark:text-rose-200">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-600 dark:text-rose-200">
                Archive Student
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Move this student to Withdrawn?
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isArchiving}
            className="rounded-2xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Close archive dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="font-black">{studentName(student)}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {student.studentNumber}
          </p>
        </div>

        <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This is a soft delete. The student row, files, invoices,
          certificates, and audit trail will remain. The system will set student
          status to <strong>Withdrawn</strong> and training status to{" "}
          <strong>Suspended</strong>.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isArchiving}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 shadow-sm transition hover:text-brand-blue disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isArchiving}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isArchiving ? <Loader2 size={18} className="animate-spin" /> : null}
            {isArchiving ? "Archiving..." : "Archive Student"}
          </button>
        </div>
      </section>
    </div>
  );
}
