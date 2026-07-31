import {
  BadgeCheck,
  FileText,
  Plus,
  QrCode,
  Search,
  ShieldCheck
} from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { CertificatePreview } from "./CertificatePreview";
import {
  certificateRecords,
  certificateTemplates
} from "./certificate.data";
import type {
  CertificateFilters,
  CertificateStatus,
  CertificateTemplateStatus
} from "./certificate.types";

const certificateStatuses: Array<"All" | CertificateStatus> = [
  "All",
  "Draft",
  "Ready",
  "Generated",
  "Issued",
  "Expired",
  "Revoked"
];

const templateStatuses: Array<"All" | CertificateTemplateStatus> = [
  "All",
  "Active",
  "Inactive",
  "Draft"
];

const courseCodes = [
  "All",
  ...Array.from(new Set(certificateTemplates.map((template) => template.courseCode)))
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function CertificatesPage() {
  const [filters, setFilters] = useState<CertificateFilters>({
    search: "",
    status: "All",
    courseCode: "All",
    templateStatus: "All"
  });

  const filteredCertificates = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return certificateRecords.filter((certificate) => {
      const template = certificateTemplates.find(
        (item) => item.templateId === certificate.templateId
      );

      const matchesSearch =
        !search ||
        certificate.studentName.toLowerCase().includes(search) ||
        certificate.referenceNumber.toLowerCase().includes(search) ||
        certificate.courseName.toLowerCase().includes(search) ||
        certificate.certificateId.toLowerCase().includes(search);

      const matchesStatus =
        filters.status === "All" || certificate.status === filters.status;

      const matchesCourse =
        filters.courseCode === "All" ||
        certificate.courseCode === filters.courseCode;

      const matchesTemplateStatus =
        filters.templateStatus === "All" ||
        template?.status === filters.templateStatus;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCourse &&
        matchesTemplateStatus
      );
    });
  }, [filters]);

  const selectedCertificate =
    filteredCertificates[0] ?? certificateRecords[0];

  const summary = useMemo(() => {
    const activeTemplates = certificateTemplates.filter(
      (template) => template.status === "Active"
    ).length;
    const ready = certificateRecords.filter(
      (certificate) => certificate.status === "Ready"
    ).length;
    const generated = certificateRecords.filter(
      (certificate) =>
        certificate.status === "Generated" || certificate.status === "Issued"
    ).length;
    const issued = certificateRecords.filter(
      (certificate) => certificate.status === "Issued"
    ).length;

    return { activeTemplates, ready, generated, issued };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Certificates"
        title="Certificate Manager"
        description="Manage course-based certificate templates, generate certificate PDFs, track issue status, and maintain QR-ready certificate records."
        icon={ShieldCheck}
        accentClassName="border-brand-coral"
      >
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy"
        >
          <Plus size={18} />
          New Certificate
        </button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Active Templates"
          value={String(summary.activeTemplates)}
          icon={FileText}
          tone="blue"
        />
        <SummaryCard
          label="Ready To Generate"
          value={String(summary.ready)}
          icon={BadgeCheck}
          tone="emerald"
        />
        <SummaryCard
          label="Generated PDFs"
          value={String(summary.generated)}
          icon={ShieldCheck}
          tone="coral"
        />
        <SummaryCard
          label="Issued"
          value={String(summary.issued)}
          icon={QrCode}
          tone="amber"
        />
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
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
                  placeholder="Search student, reference, certificate, or course..."
                />
              </label>

              <FilterSelect
                label="Certificate status"
                value={filters.status}
                options={certificateStatuses}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    status: value as CertificateFilters["status"]
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

              <FilterSelect
                label="Template status"
                value={filters.templateStatus}
                options={templateStatuses}
                onChange={(value) =>
                  setFilters((current) => ({
                    ...current,
                    templateStatus:
                      value as CertificateFilters["templateStatus"]
                  }))
                }
              />
            </div>
          </section>

          {filteredCertificates.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No certificates found"
              description="Try adjusting the search or filters to find a certificate record."
            />
          ) : (
            <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Certificate</th>
                    <th className="hidden px-5 py-4 lg:table-cell">Course</th>
                    <th className="hidden px-5 py-4 xl:table-cell">PDF</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                  {filteredCertificates.map((certificate) => (
                    <tr key={certificate.certificateId} className="align-top">
                      <td className="px-5 py-5">
                        <div className="font-bold">{certificate.studentName}</div>
                        <div className="mt-1 text-slate-500 dark:text-slate-400">
                          Ref. {certificate.referenceNumber}
                        </div>
                        <div className="mt-1 text-slate-500 dark:text-slate-400">
                          {formatDate(certificate.issueDate)}
                        </div>
                      </td>
                      <td className="hidden px-5 py-5 lg:table-cell">
                        <div className="font-semibold">{certificate.courseName}</div>
                        <div className="mt-1 text-slate-500 dark:text-slate-400">
                          {certificate.courseCode}
                        </div>
                      </td>
                      <td className="hidden px-5 py-5 xl:table-cell">
                        {certificate.generatedPdfUrl ? (
                          <a
                            href={certificate.generatedPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-bold text-brand-blue dark:border-white/10 dark:bg-white/5"
                          >
                            <FileText size={16} />
                            View PDF
                          </a>
                        ) : (
                          <span className="text-slate-400">Not generated</span>
                        )}
                      </td>
                      <td className="px-5 py-5">
                        <StatusBadge value={certificate.status} />
                        <div className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <QrCode size={16} />
                          {certificate.qrCodeValue}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-blue">
                Template Preview
              </p>
              <h3 className="mt-2 text-xl font-black">
                AGA Completion Landscape
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Preview follows your reference certificate layout. PDF generation
                will use this data structure.
              </p>
            </div>
            <StatusBadge value={selectedCertificate.status} />
          </div>

          <CertificatePreview certificate={selectedCertificate} />
        </section>
      </section>
    </div>
  );
}
