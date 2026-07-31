import {
  Archive,
  FileArchive,
  FileText,
  FolderOpen,
  Search,
  Upload
} from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { SummaryCard } from "../../components/ui/SummaryCard";
import { managedFiles } from "./file.data";
import type { FileFilters, ManagedFileModule, ManagedFileStatus } from "./file.types";

const fileModules: Array<"All" | ManagedFileModule> = [
  "All",
  "Student Profile",
  "Training Enrolment",
  "Training Record",
  "Certificate",
  "Invoice PDF",
  "TEA",
  "Registration Form",
  "Other"
];

const fileStatuses: Array<"All" | ManagedFileStatus> = [
  "All",
  "Uploaded",
  "Missing",
  "Needs Replacement",
  "Archived"
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function FileManagerPage() {
  const [filters, setFilters] = useState<FileFilters>({
    search: "",
    module: "All",
    status: "All"
  });

  const filteredFiles = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return managedFiles.filter((file) => {
      const matchesSearch =
        !search ||
        file.fileName.toLowerCase().includes(search) ||
        file.studentName.toLowerCase().includes(search) ||
        file.studentNumber.toLowerCase().includes(search) ||
        file.module.toLowerCase().includes(search) ||
        file.notes?.toLowerCase().includes(search);

      const matchesModule =
        filters.module === "All" || file.module === filters.module;

      const matchesStatus =
        filters.status === "All" || file.status === filters.status;

      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [filters]);

  const summary = useMemo(() => {
    const uploaded = managedFiles.filter((file) => file.status === "Uploaded").length;
    const missing = managedFiles.filter((file) => file.status === "Missing").length;
    const needsReplacement = managedFiles.filter(
      (file) => file.status === "Needs Replacement"
    ).length;
    const archived = managedFiles.filter((file) => file.status === "Archived").length;

    return { uploaded, missing, needsReplacement, archived };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="File Manager"
        title="PDF Library"
        description="Manage uploaded and generated PDFs from Google Drive, including invoice PDFs from finance, certificates, TEA, registration forms, and training records."
        icon={FileArchive}
        accentClassName="border-brand-sky"
      >
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy"
        >
          <Upload size={18} />
          Upload PDF
        </button>
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Uploaded" value={String(summary.uploaded)} icon={FileText} tone="emerald" />
        <SummaryCard label="Missing" value={String(summary.missing)} icon={FolderOpen} tone="rose" />
        <SummaryCard label="Needs Replacement" value={String(summary.needsReplacement)} icon={Upload} tone="amber" />
        <SummaryCard label="Archived" value={String(summary.archived)} icon={Archive} tone="blue" />
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
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
              placeholder="Search file, student, module, or notes..."
            />
          </label>

          <FilterSelect
            label="Module"
            value={filters.module}
            options={fileModules}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                module: value as FileFilters["module"]
              }))
            }
          />

          <FilterSelect
            label="File status"
            value={filters.status}
            options={fileStatuses}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                status: value as FileFilters["status"]
              }))
            }
          />
        </div>
      </section>

      {filteredFiles.length === 0 ? (
        <EmptyState
          icon={FileArchive}
          title="No files found"
          description="Try adjusting the search or filters to find a file record."
        />
      ) : (
        <>
          <section className="hidden overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7 xl:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">File</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Module</th>
                  <th className="px-5 py-4">Drive</th>
                  <th className="px-5 py-4">Uploaded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredFiles.map((file) => (
                  <tr key={file.fileId} className="align-top">
                    <td className="px-5 py-5">
                      <div className="font-bold">{file.fileName}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {file.fileId}
                      </div>
                      <div className="mt-3">
                        <StatusBadge value={file.status} />
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">{file.studentName}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {file.studentNumber}
                      </div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        {file.enrolmentId ?? "No enrolment"}
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <div className="font-semibold">{file.module}</div>
                      <p className="mt-2 text-slate-500 dark:text-slate-400">
                        {file.notes ?? "-"}
                      </p>
                    </td>
                    <td className="px-5 py-5">
                      {file.driveUrl ? (
                        <a
                          href={file.driveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 font-bold text-brand-blue dark:border-white/10 dark:bg-white/5"
                        >
                          <FileText size={16} />
                          Open PDF
                        </a>
                      ) : (
                        <span className="text-slate-400">No Drive file</span>
                      )}
                    </td>
                    <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                      <div>{formatDate(file.uploadedAt)}</div>
                      <div className="mt-1 text-slate-500 dark:text-slate-400">
                        By {file.uploadedBy}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="grid gap-4 xl:hidden">
            {filteredFiles.map((file) => (
              <article
                key={file.fileId}
                className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black">{file.fileName}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {file.studentName} · {file.module}
                    </p>
                  </div>
                  <StatusBadge value={file.status} />
                </div>

                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  {file.notes ?? "-"}
                </p>

                {file.driveUrl ? (
                  <a
                    href={file.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-brand-blue dark:border-white/10 dark:bg-white/5"
                  >
                    <FileText size={16} />
                    Open PDF
                  </a>
                ) : null}
              </article>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
