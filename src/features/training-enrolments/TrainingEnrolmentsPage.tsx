import {
  BookOpenCheck,
  CalendarDays,
  FileSignature,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { listTrainingEnrolmentsFromApi } from "./enrolment.service";
import type {
  EnrolmentFilters,
  EnrolmentInvoicePdfStatus,
  EnrolmentStatus,
  TeaStatus,
  TrainingEnrolment,
  TrainingStatus
} from "./enrolment.types";

const enrolmentStatuses: Array<"All" | EnrolmentStatus> = [
  "All",
  "Draft",
  "Pending Review",
  "Approved",
  "In Training",
  "Completed",
  "Cancelled"
];

const trainingStatuses: Array<"All" | TrainingStatus> = [
  "All",
  "Not Started",
  "In Progress",
  "Completed",
  "Suspended"
];

const teaStatuses: Array<"All" | TeaStatus> = [
  "All",
  "Pending",
  "Generated",
  "Sent",
  "Signed",
  "Rejected",
  "Not Required"
];

const invoicePdfStatuses: Array<"All" | EnrolmentInvoicePdfStatus> = [
  "All",
  "No Invoice PDF",
  "Uploaded",
  "Missing",
  "Needs Replacement"
];

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatDateTime(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function TrainingEnrolmentsPage() {
  const [enrolments, setEnrolments] = useState<TrainingEnrolment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState<EnrolmentFilters>({
    search: "",
    enrolmentStatus: "All",
    trainingStatus: "All",
    teaStatus: "All",
    invoicePdfStatus: "All"
  });

  async function loadEnrolments() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await listTrainingEnrolmentsFromApi();
      setEnrolments(response.enrolments);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load enrolments."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadEnrolments();
  }, []);

  const filteredEnrolments = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return enrolments.filter((enrolment) => {
      const matchesSearch =
        !search ||
        enrolment.studentName.toLowerCase().includes(search) ||
        enrolment.studentNumber.toLowerCase().includes(search) ||
        enrolment.enrolmentNumber.toLowerCase().includes(search) ||
        enrolment.courseCode.toLowerCase().includes(search) ||
        enrolment.courseName.toLowerCase().includes(search) ||
        enrolment.trainerName.toLowerCase().includes(search);

      const matchesEnrolmentStatus =
        filters.enrolmentStatus === "All" ||
        enrolment.enrolmentStatus === filters.enrolmentStatus;

      const matchesTrainingStatus =
        filters.trainingStatus === "All" ||
        enrolment.trainingStatus === filters.trainingStatus;

      const matchesTeaStatus =
        filters.teaStatus === "All" || enrolment.teaStatus === filters.teaStatus;

      const matchesInvoicePdfStatus =
        filters.invoicePdfStatus === "All" ||
        enrolment.invoicePdfStatus === filters.invoicePdfStatus;

      return (
        matchesSearch &&
        matchesEnrolmentStatus &&
        matchesTrainingStatus &&
        matchesTeaStatus &&
        matchesInvoicePdfStatus
      );
    });
  }, [enrolments, filters]);

  const summary = useMemo(() => {
    const inTraining = enrolments.filter(
      (enrolment) => enrolment.enrolmentStatus === "In Training"
    ).length;
    const pendingTea = enrolments.filter(
      (enrolment) => enrolment.teaStatus === "Pending"
    ).length;
    const readyCertificates = enrolments.filter(
      (enrolment) =>
        enrolment.certificateStatus === "Eligible" ||
        enrolment.certificateStatus === "Ready"
    ).length;
    const invoicePdfs = enrolments.reduce(
      (total, enrolment) => total + Number(enrolment.invoicePdfCount || 0),
      0
    );

    return { inTraining, pendingTea, readyCertificates, invoicePdfs };
  }, [enrolments]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Training Enrolments"
        title="Enrolment Workflow"
        description="Manage course enrolments from approval through training, TEA, registration documents, invoice PDFs, and certificate readiness."
        icon={BookOpenCheck}
        accentClassName="border-brand-sky"
      >
        <button
          type="button"
          onClick={() => void loadEnrolments()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-5 py-3 text-sm font-bold text-brand-blue shadow-sm transition hover:border-brand-sky hover:bg-sky-50 dark:border-white/10 dark:bg-white/8 dark:text-sky-200 dark:hover:bg-white/12"
        >
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="In Training"
          value={String(summary.inTraining)}
          icon={BookOpenCheck}
          tone="blue"
        />
        <SummaryCard
          label="Pending TEA"
          value={String(summary.pendingTea)}
          icon={FileSignature}
          tone="amber"
        />
        <SummaryCard
          label="Certificate Ready"
          value={String(summary.readyCertificates)}
          icon={ShieldCheck}
          tone="emerald"
        />
        <SummaryCard
          label="Invoice PDFs"
          value={String(summary.invoicePdfs)}
          icon={FileText}
          tone="rose"
        />
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <div className="grid gap-3 xl:grid-cols-[1fr_auto_auto_auto_auto]">
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
              placeholder="Search student, enrolment, course, or trainer..."
            />
          </label>

          <FilterSelect
            label="Enrolment"
            value={filters.enrolmentStatus}
            options={enrolmentStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                enrolmentStatus: value as EnrolmentFilters["enrolmentStatus"]
              }))
            }
          />

          <FilterSelect
            label="Training"
            value={filters.trainingStatus}
            options={trainingStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                trainingStatus: value as EnrolmentFilters["trainingStatus"]
              }))
            }
          />

          <FilterSelect
            label="TEA"
            value={filters.teaStatus}
            options={teaStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                teaStatus: value as EnrolmentFilters["teaStatus"]
              }))
            }
          />

          <FilterSelect
            label="Invoice PDF"
            value={filters.invoicePdfStatus}
            options={invoicePdfStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                invoicePdfStatus: value as EnrolmentFilters["invoicePdfStatus"]
              }))
            }
          />
        </div>
      </section>

      {errorMessage ? (
        <section className="rounded-3xl border border-rose-200 bg-rose-50/90 p-6 text-sm text-rose-700 shadow-panel dark:border-rose-400/30 dark:bg-rose-950/30 dark:text-rose-100">
          <p className="font-black">Could not load enrolments</p>
          <p className="mt-1">{errorMessage}</p>
        </section>
      ) : null}

      {isLoading ? (
        <section className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="mt-5 grid gap-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-white/8"
              />
            ))}
          </div>
        </section>
      ) : filteredEnrolments.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No enrolments found"
          description="Try adjusting the search or filters to find an enrolment record."
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7 xl:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Enrolment</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Training</th>
                  <th className="px-5 py-4">Workflow</th>
                  <th className="px-5 py-4">Files</th>
                  <th className="px-5 py-4">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredEnrolments.map((enrolment) => (
                  <tr key={enrolment.enrolmentId} className="align-top">
                    <td className="px-5 py-5">
                      <div className="font-bold">{enrolment.enrolmentNumber}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {enrolment.courseCode}
                      </div>
                      <div className="mt-3">
                        <StatusBadge value={enrolment.enrolmentStatus} />
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="font-semibold">{enrolment.studentName}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {enrolment.studentNumber}
                      </div>
                      <div className="mt-2 text-slate-500 dark:text-slate-400">
                        {enrolment.courseName}
                      </div>
                    </td>

                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={enrolment.trainingStatus} />
                        <StatusBadge value={enrolment.paymentStatus} />
                      </div>
                      <div className="mt-3">Start: {formatDate(enrolment.startDate)}</div>
                      <div className="mt-1">
                        Target: {formatDate(enrolment.targetCompletionDate)}
                      </div>
                      <div className="mt-1">
                        Trainer: {enrolment.trainerName || "Unassigned"}
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={enrolment.teaStatus} />
                        <StatusBadge value={enrolment.registrationFormStatus} />
                        <StatusBadge value={enrolment.certificateStatus} />
                      </div>
                      <p className="mt-3 text-slate-500 dark:text-slate-400">
                        {enrolment.notes || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <div>
                        <StatusBadge value={enrolment.invoicePdfStatus} />
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <FileText size={16} />
                        {enrolment.invoicePdfCount} invoice PDF
                        {Number(enrolment.invoicePdfCount) === 1 ? "" : "s"}
                      </div>
                    </td>

                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      {formatDateTime(enrolment.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="grid gap-4 xl:hidden">
            {filteredEnrolments.map((enrolment) => (
              <article
                key={enrolment.enrolmentId}
                className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-lg font-black">
                      {enrolment.studentName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {enrolment.courseName}
                    </p>
                  </div>
                  <StatusBadge value={enrolment.enrolmentStatus} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Detail label="Training" value={enrolment.trainingStatus} />
                  <Detail label="Start" value={formatDate(enrolment.startDate)} />
                  <Detail
                    label="Target"
                    value={formatDate(enrolment.targetCompletionDate)}
                  />
                  <Detail
                    label="Trainer"
                    value={enrolment.trainerName || "Unassigned"}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge value={enrolment.teaStatus} />
                  <StatusBadge value={enrolment.registrationFormStatus} />
                  <StatusBadge value={enrolment.certificateStatus} />
                  <StatusBadge value={enrolment.invoicePdfStatus} />
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {enrolment.notes || enrolment.enrolmentNumber}
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
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
