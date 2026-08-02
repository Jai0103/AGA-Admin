import {
  BadgeCheck,
  Download,
  Eye,
  FileArchive,
  FileText,
  FolderOpen,
  Loader2,
  Search,
  ServerCrash,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "../../components/ui/EmptyState";
import { FilterSelect } from "../../components/ui/FilterSelect";
import { PageHeader } from "../../components/ui/PageHeader";
import { SummaryCard } from "../../components/ui/SummaryCard";
import {
  deleteStudentFileFromApi,
  listFilesFromApi
} from "../students/student-file.service";
import type { StudentFile } from "../students/student-file.service";
import { listStudentsFromApi } from "../students/student.service";
import type { Student } from "../students/student.types";

const fileModules = [
  "All",
  "Registration Form",
  "NRIC/Passport",
  "Company Letter",
  "Invoice PDF",
  "Training Agreement",
  "Certificate Support",
  "Other"
] as const;

type FileModuleFilter = (typeof fileModules)[number];

type FileFilters = {
  search: string;
  module: FileModuleFilter;
};

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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(parsedDate);
}

function studentName(student?: Student) {
  if (!student) {
    return "Unknown student";
  }

  const legacyName = [student.firstName, student.lastName]
    .filter((part) => part && part !== "-")
    .join(" ");

  return student.nameAsPerId || student.preferredName || legacyName || "-";
}

function previewUrl(file: StudentFile) {
  return file.driveFileId
    ? `https://drive.google.com/file/d/${file.driveFileId}/preview`
    : file.driveUrl;
}

export function FileManagerPage() {
  const [files, setFiles] = useState<StudentFile[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewFile, setPreviewFile] = useState<StudentFile | null>(null);
  const [deleteFile, setDeleteFile] = useState<StudentFile | null>(null);
  const [deletedFileName, setDeletedFileName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<FileFilters>({
    search: "",
    module: "All"
  });

  useEffect(() => {
    let mounted = true;

    setIsLoading(true);
    setErrorMessage("");

    Promise.all([listFilesFromApi(), listStudentsFromApi()])
      .then(([filesResponse, studentsResponse]) => {
        if (mounted) {
          setFiles(filesResponse.files);
          setStudents(studentsResponse.students);
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

  const studentById = useMemo(() => {
    return new Map(students.map((student) => [student.studentId, student]));
  }, [students]);

  const filteredFiles = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return files.filter((file) => {
      const student = studentById.get(file.studentId);
      const searchableValues = [
        file.fileName,
        file.fileId,
        file.module,
        file.mimeType,
        file.uploadedBy,
        file.notes,
        file.studentId,
        student?.studentNumber,
        studentName(student)
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !search || searchableValues.includes(search);
      const matchesModule =
        filters.module === "All" || file.module === filters.module;

      return matchesSearch && matchesModule;
    });
  }, [files, filters, studentById]);

  const summary = useMemo(() => {
    const uniqueStudents = new Set(files.map((file) => file.studentId)).size;
    const invoiceFiles = files.filter((file) => file.module === "Invoice PDF").length;
    const registrationFiles = files.filter(
      (file) => file.module === "Registration Form"
    ).length;

    return {
      totalFiles: files.length,
      uniqueStudents,
      invoiceFiles,
      registrationFiles
    };
  }, [files]);

  async function handleDeleteFile() {
    if (!deleteFile) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      await deleteStudentFileFromApi({
        fileId: deleteFile.fileId
      });

      setFiles((current) =>
        current.filter((file) => file.fileId !== deleteFile.fileId)
      );
      setDeletedFileName(deleteFile.fileName);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not delete file."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="File Manager"
        title="File Library"
        description="Manage uploaded student files from Google Drive and Google Sheets."
        icon={FileArchive}
        accentClassName="border-brand-sky"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total Files" value={String(summary.totalFiles)} icon={FileText} tone="blue" />
        <SummaryCard label="Students With Files" value={String(summary.uniqueStudents)} icon={FolderOpen} tone="emerald" />
        <SummaryCard label="Invoice PDFs" value={String(summary.invoiceFiles)} icon={FileText} tone="amber" />
        <SummaryCard label="Registration Forms" value={String(summary.registrationFiles)} icon={BadgeCheck} tone="mint" />
      </section>

      <section className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
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
                module: value as FileModuleFilter
              }))
            }
          />
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-3xl border border-white/70 bg-white/86 p-8 text-center shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <Loader2 className="mx-auto animate-spin text-brand-blue" size={32} />
          <h2 className="mt-4 text-2xl font-black">Loading file library</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Fetching uploaded files from Google Sheets.
          </p>
        </section>
      ) : null}

      {errorMessage ? (
        <section className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 shadow-panel backdrop-blur-xl dark:border-rose-400/20 dark:bg-rose-400/10">
          <ServerCrash className="text-rose-600 dark:text-rose-200" size={28} />
          <h2 className="mt-3 text-xl font-black text-rose-700 dark:text-rose-200">
            Could not load files
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {errorMessage}
          </p>
        </section>
      ) : null}

      {!isLoading && !errorMessage && filteredFiles.length === 0 ? (
        <EmptyState
          icon={FileArchive}
          title="No files found"
          description="Try adjusting the search or module filter."
        />
      ) : null}

      {!isLoading && !errorMessage && filteredFiles.length > 0 ? (
        <>
          <section className="hidden overflow-hidden rounded-3xl border border-white/70 bg-white/86 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7 xl:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">File</th>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Module</th>
                  <th className="px-5 py-4">Uploaded</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {filteredFiles.map((file) => {
                  const student = studentById.get(file.studentId);

                  return (
                    <tr key={file.fileId} className="align-top">
                      <td className="px-5 py-5">
                        <div className="font-bold">{file.fileName}</div>
                        <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {file.mimeType}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          {file.fileId}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <Link
                          to={`/students/${file.studentId}`}
                          className="font-bold text-brand-blue transition hover:text-brand-navy dark:hover:text-brand-sky"
                        >
                          {studentName(student)}
                        </Link>
                        <div className="mt-1 text-slate-500 dark:text-slate-400">
                          {student?.studentNumber || file.studentId}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <span className="rounded-full bg-brand-sky/15 px-3 py-1 text-xs font-black text-brand-blue">
                          {file.module || "Other"}
                        </span>
                        <p className="mt-3 text-slate-500 dark:text-slate-400">
                          {file.notes || "-"}
                        </p>
                      </td>
                      <td className="px-5 py-5 text-slate-600 dark:text-slate-300">
                        <div>{formatDate(file.uploadedAt)}</div>
                        <div className="mt-1 text-slate-500 dark:text-slate-400">
                          By {file.uploadedBy || "unknown"}
                        </div>
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <IconButton
                            label="View"
                            icon={Eye}
                            onClick={() => setPreviewFile(file)}
                          />
                          <IconLink
                            label="Download"
                            icon={Download}
                            href={file.driveUrl}
                            primary
                          />
                          <IconButton
                            label="Delete"
                            icon={Trash2}
                            danger
                            onClick={() => {
                              setDeleteFile(file);
                              setDeletedFileName("");
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <section className="grid gap-4 xl:hidden">
            {filteredFiles.map((file) => {
              const student = studentById.get(file.studentId);

              return (
                <article
                  key={file.fileId}
                  className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-black">{file.fileName}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {studentName(student)} - {file.module || "Other"}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-sky/15 px-3 py-1 text-xs font-black text-brand-blue">
                      {file.module || "Other"}
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                    Uploaded {formatDate(file.uploadedAt)} by{" "}
                    {file.uploadedBy || "unknown"}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4 dark:border-white/10">
                    <IconButton
                      label="View"
                      icon={Eye}
                      onClick={() => setPreviewFile(file)}
                    />
                    <IconLink
                      label="Download"
                      icon={Download}
                      href={file.driveUrl}
                      primary
                    />
                    <IconButton
                      label="Delete"
                      icon={Trash2}
                      danger
                      onClick={() => {
                        setDeleteFile(file);
                        setDeletedFileName("");
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </section>
        </>
      ) : null}

      {previewFile ? (
        <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      ) : null}

      {deleteFile ? (
        <DeleteFileModal
          file={deleteFile}
          deletedFileName={deletedFileName}
          isDeleting={isDeleting}
          onCancel={() => {
            setDeleteFile(null);
            setDeletedFileName("");
          }}
          onConfirm={handleDeleteFile}
        />
      ) : null}
    </div>
  );
}

type IconButtonProps = {
  label: string;
  icon: typeof Eye;
  danger?: boolean;
  onClick: () => void;
};

function IconButton({ label, icon: Icon, danger, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border shadow-soft transition hover:-translate-y-0.5 ${
        danger
          ? "border-rose-200 bg-white text-rose-600 hover:border-rose-500 hover:bg-rose-600 hover:text-white dark:border-rose-400/20 dark:bg-white/5 dark:text-rose-300"
          : "border-slate-200 bg-white text-slate-600 hover:border-brand-blue/30 hover:bg-brand-blue hover:text-white hover:shadow-glow dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
      }`}
    >
      <Icon size={18} />
      <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white opacity-0 shadow-panel transition group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

function IconLink({
  label,
  icon: Icon,
  href,
  primary
}: {
  label: string;
  icon: typeof Download;
  href: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      download
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className={`group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl transition hover:-translate-y-0.5 ${
        primary
          ? "bg-brand-blue text-white shadow-glow hover:bg-brand-navy"
          : "border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
      }`}
    >
      <Icon size={18} />
      <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white opacity-0 shadow-panel transition group-hover:opacity-100">
        {label}
      </span>
    </a>
  );
}

function FilePreviewModal({
  file,
  onClose
}: {
  file: StudentFile;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <section className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl dark:bg-slate-950">
        <header className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/90 p-4 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-brand-blue">
              File preview
            </p>
            <h3 className="mt-1 truncate text-lg font-black">{file.fileName}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {file.module} - Uploaded {formatDate(file.uploadedAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <IconLink label="Download" icon={Download} href={file.driveUrl} primary />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              title="Close preview"
              className="group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <X size={18} />
              <span className="pointer-events-none absolute -bottom-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white opacity-0 shadow-panel transition group-hover:opacity-100">
                Close
              </span>
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 bg-slate-100 p-3 dark:bg-slate-900">
          <iframe
            title={file.fileName}
            src={previewUrl(file)}
            className="h-full w-full rounded-2xl border border-slate-200 bg-white dark:border-white/10"
          />
        </div>
      </section>
    </div>
  );
}

function DeleteFileModal({
  file,
  deletedFileName,
  isDeleting,
  onCancel,
  onConfirm
}: {
  file: StudentFile;
  deletedFileName: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (deletedFileName) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
        <section className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:bg-slate-950">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200">
              <BadgeCheck size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">
                Deleted
              </p>
              <h3 className="mt-2 text-2xl font-black">File deleted successfully</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                The file was removed from the file library and moved to Drive
                trash.
              </p>
              <p className="mt-4 truncate rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black dark:border-white/10 dark:bg-white/5">
                {deletedFileName}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-2xl bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-glow transition hover:bg-brand-navy"
            >
              OK
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
      <section className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-2xl dark:bg-slate-950">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-400/10 dark:text-rose-200">
            <Trash2 size={22} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-rose-600">
              Delete file
            </p>
            <h3 className="mt-2 text-2xl font-black">Move this file to trash?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will remove the file from Google Sheets and move the Drive
              file to trash.
            </p>
            <p className="mt-4 truncate rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black dark:border-white/10 dark:bg-white/5">
              {file.fileName}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-50"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
            {isDeleting ? "Deleting" : "Delete file"}
          </button>
        </div>
      </section>
    </div>
  );
}
