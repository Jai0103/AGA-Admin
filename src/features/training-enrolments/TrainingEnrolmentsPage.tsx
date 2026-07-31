import {
  BookOpenCheck,
  CalendarDays,
  FileSignature,
  FileText,
  Plus,
  ReceiptText,
  Search
} from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { trainingEnrolments } from "./enrolment.data";
import type {
  AgreementStatus,
  EnrolmentFilters,
  EnrolmentPaymentStatus,
  EnrolmentStatus
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

const agreementStatuses: Array<"All" | AgreementStatus> = [
  "All",
  "Not Sent",
  "Sent",
  "Signed",
  "Rejected"
];

const paymentStatuses: Array<"All" | EnrolmentPaymentStatus> = [
  "All",
  "Unpaid",
  "Deposit Paid",
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

export function TrainingEnrolmentsPage() {
  const [filters, setFilters] = useState<EnrolmentFilters>({
    search: "",
    status: "All",
    agreementStatus: "All",
    paymentStatus: "All"
  });

  const filteredEnrolments = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return trainingEnrolments.filter((enrolment) => {
      const matchesSearch =
        !search ||
        enrolment.studentName.toLowerCase().includes(search) ||
        enrolment.studentNumber.toLowerCase().includes(search) ||
        enrolment.courseCode.toLowerCase().includes(search) ||
        enrolment.courseName.toLowerCase().includes(search) ||
        enrolment.invoiceNumber.toLowerCase().includes(search);

      const matchesStatus =
        filters.status === "All" || enrolment.status === filters.status;

      const matchesAgreement =
        filters.agreementStatus === "All" ||
        enrolment.agreementStatus === filters.agreementStatus;

      const matchesPayment =
        filters.paymentStatus === "All" ||
        enrolment.paymentStatus === filters.paymentStatus;

      return matchesSearch && matchesStatus && matchesAgreement && matchesPayment;
    });
  }, [filters]);

  const summary = useMemo(() => {
    const inTraining = trainingEnrolments.filter(
      (enrolment) => enrolment.status === "In Training"
    ).length;
    const pendingReview = trainingEnrolments.filter(
      (enrolment) => enrolment.status === "Pending Review"
    ).length;
    const signedAgreements = trainingEnrolments.filter(
      (enrolment) => enrolment.agreementStatus === "Signed"
    ).length;
    const totalBalance = trainingEnrolments.reduce(
      (total, enrolment) => total + enrolment.invoiceBalance,
      0
    );

    return { inTraining, pendingReview, signedAgreements, totalBalance };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Training Enrolments"
        title="Enrolments"
        description="Track course enrolments, training progress, TEA signatures, registration form verification, invoices, and uploaded PDFs."
        icon={BookOpenCheck}
        accentClassName="border-brand-sky"
      >
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy"
        >
          <Plus size={18} />
          New Enrolment
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
          label="Pending Review"
          value={String(summary.pendingReview)}
          icon={CalendarDays}
          tone="amber"
        />
        <SummaryCard
          label="Signed TEA"
          value={String(summary.signedAgreements)}
          icon={FileSignature}
          tone="emerald"
        />
        <SummaryCard
          label="Invoice Balance"
          value={currencyFormatter.format(summary.totalBalance)}
          icon={ReceiptText}
          tone="rose"
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
              placeholder="Search student, course, code, or invoice..."
            />
          </label>

          <FilterSelect
            label="Enrolment status"
            value={filters.status}
            options={enrolmentStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                status: value as EnrolmentFilters["status"]
              }))
            }
          />

          <FilterSelect
            label="Agreement status"
            value={filters.agreementStatus}
            options={agreementStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                agreementStatus: value as EnrolmentFilters["agreementStatus"]
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
                paymentStatus: value as EnrolmentFilters["paymentStatus"]
              }))
            }
          />
        </div>
      </section>

      {filteredEnrolments.length === 0 ? (
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
                  <th className="px-5 py-4">Schedule</th>
                  <th className="px-5 py-4">Documents</th>
                  <th className="px-5 py-4">Invoice</th>
                  <th className="px-5 py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredEnrolments.map((enrolment) => (
                  <tr key={enrolment.enrolmentId} className="align-top">
                    <td className="px-5 py-5">
                      <div className="font-bold">{enrolment.enrolmentId}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {enrolment.courseCode}
                      </div>
                      <div className="mt-3">
                        <StatusBadge value={enrolment.status} />
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">{enrolment.studentName}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {enrolment.studentNumber}
                      </div>
                      <div className="mt-2 text-slate-500 dark:text-slate-400">
                        Trainer: {enrolment.trainerName}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      <div>Start: {formatDate(enrolment.startDate)}</div>
                      <div className="mt-1">
                        Target: {formatDate(enrolment.targetCompletionDate)}
                      </div>
                      <div className="mt-1">
                        Complete: {formatDate(enrolment.completionDate)}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge value={enrolment.agreementStatus} />
                        <StatusBadge value={enrolment.registrationStatus} />
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <FileText size={16} />
                        {enrolment.uploadedPdfCount} PDFs
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">{enrolment.invoiceNumber}</div>
                      <div className="mt-2">
                        <StatusBadge value={enrolment.paymentStatus} />
                      </div>
                      <div className="mt-3 font-semibold">
                        {currencyFormatter.format(enrolment.invoiceBalance)}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      {enrolment.notes}
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
                  <div>
                    <p className="text-lg font-black">{enrolment.studentName}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {enrolment.courseName}
                    </p>
                  </div>
                  <StatusBadge value={enrolment.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Detail label="Start" value={formatDate(enrolment.startDate)} />
                  <Detail
                    label="Target"
                    value={formatDate(enrolment.targetCompletionDate)}
                  />
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      TEA
                    </p>
                    <StatusBadge value={enrolment.agreementStatus} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Payment
                    </p>
                    <StatusBadge value={enrolment.paymentStatus} />
                  </div>
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {enrolment.notes}
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
