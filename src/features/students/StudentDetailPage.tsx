import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  FileArchive,
  FileText,
  GraduationCap,
  History,
  Loader2,
  Mail,
  Phone,
  QrCode,
  ReceiptText,
  ServerCrash
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { StatusBadge } from "../../components/ui/StatusBadge";
import { certificateRecords } from "../certificates/certificate.data";
import { managedFiles } from "../file-manager/file.data";
import { trainingEnrolments } from "../training-enrolments/enrolment.data";
import { trainingRecords } from "../training-records/training-record.data";
import { getStudentFromApi } from "./student.service";
import type { Student } from "./student.types";

const tabs = [
  { id: "profile", label: "Profile", icon: GraduationCap },
  { id: "enrolments", label: "Enrolments", icon: BookOpenCheck },
  { id: "records", label: "Training Records", icon: FileText },
  { id: "files", label: "Files", icon: FileArchive },
  { id: "certificates", label: "Certificates", icon: BadgeCheck },
  { id: "invoices", label: "Invoice PDFs", icon: ReceiptText },
  { id: "audit", label: "Audit", icon: History }
] as const;

type TabId = (typeof tabs)[number]["id"];

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function StudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  useEffect(() => {
    let mounted = true;

    if (!studentId) {
      setStudent(null);
      setErrorMessage("Missing student ID.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    getStudentFromApi(studentId)
      .then((response) => {
        if (mounted) {
          setStudent(response.student);
        }
      })
      .catch((error: Error) => {
        if (mounted) {
          setStudent(null);
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
  }, [studentId]);

  const related = useMemo(() => {
    if (!student) {
      return {
        enrolments: [],
        records: [],
        files: [],
        certificates: [],
        invoiceFiles: []
      };
    }

    const files = managedFiles.filter((file) => file.studentId === student.studentId);

    return {
      enrolments: trainingEnrolments.filter(
        (enrolment) => enrolment.studentId === student.studentId
      ),
      records: trainingRecords.filter(
        (record) => record.studentId === student.studentId
      ),
      files,
      certificates: certificateRecords.filter(
        (certificate) => certificate.studentId === student.studentId
      ),
      invoiceFiles: files.filter((file) => file.module === "Invoice PDF")
    };
  }, [student]);

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/86 p-8 text-center shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <Loader2 className="mx-auto animate-spin text-brand-blue" size={32} />
        <h2 className="mt-4 text-2xl font-black">Loading student profile</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Fetching the live student record from Google Sheets.
        </p>
      </section>
    );
  }

  if (errorMessage || !student) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/86 p-8 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue"
        >
          <ArrowLeft size={16} />
          Back to students
        </Link>
        <ServerCrash className="mt-6 text-rose-600 dark:text-rose-200" size={32} />
        <h2 className="mt-4 text-3xl font-black">Student not found</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          {errorMessage || "The selected student record does not exist."}
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7 sm:p-8">
        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-blue"
        >
          <ArrowLeft size={16} />
          Back to students
        </Link>

        <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                {student.firstName} {student.lastName}
              </h2>
              <StatusBadge value={student.status} />
            </div>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {student.studentNumber} · {student.activeCourse || "No course assigned"}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <Mail size={16} />
                {student.email || "No email"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <Phone size={16} />
                {student.phone || "No phone"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <QrCode size={16} />
                {student.qrCodeValue}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            <MiniStat label="Enrolments" value={String(related.enrolments.length)} />
            <MiniStat label="Records" value={String(related.records.length)} />
            <MiniStat label="Files" value={String(related.files.length)} />
          </div>
        </div>
      </section>

      <section className="overflow-x-auto rounded-3xl border border-white/70 bg-white/86 p-2 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-brand-navy text-white shadow-glow"
                  : "text-slate-600 hover:bg-white hover:text-brand-blue dark:text-slate-300 dark:hover:bg-white/10"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "profile" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <InfoCard
            title="Personal Profile"
            rows={[
              ["Full name", `${student.firstName} ${student.lastName}`],
              ["Preferred name", student.preferredName || "-"],
              ["Nationality", student.nationality || "-"],
              ["Date of birth", formatDate(student.dateOfBirth)],
              ["Email", student.email || "-"],
              ["Phone", student.phone || "-"]
            ]}
          />
          <InfoCard
            title="Training Overview"
            rows={[
              ["Current course", student.activeCourse || "-"],
              ["Training status", student.trainingStatus],
              ["Start date", formatDate(student.startDate)],
              ["Target completion", formatDate(student.targetCompletionDate)],
              ["Completion date", formatDate(student.completionDate)],
              ["Certificate status", student.certificateStatus]
            ]}
          />
        </section>
      )}

      {activeTab === "enrolments" && (
        <RecordList
          emptyText="No live enrolments are connected yet. This tab will use the TrainingEnrolments API next."
          items={related.enrolments.map((enrolment) => ({
            title: enrolment.courseName,
            subtitle: `${enrolment.enrolmentId} · Trainer: ${enrolment.trainerName}`,
            meta: `Start ${formatDate(enrolment.startDate)} · Target ${formatDate(
              enrolment.targetCompletionDate
            )}`,
            status: enrolment.status
          }))}
        />
      )}

      {activeTab === "records" && (
        <RecordList
          emptyText="No live training records are connected yet. This tab will use the TrainingRecords API next."
          items={related.records.map((record) => ({
            title: record.moduleName,
            subtitle: `${record.recordType} · ${record.trainerName}`,
            meta: `${formatDate(record.recordDate)} · ${record.durationMinutes} minutes`,
            status: record.result
          }))}
        />
      )}

      {activeTab === "files" && (
        <FileList
          emptyText="No live files are connected yet. This tab will use the Files API next."
          files={related.files}
        />
      )}

      {activeTab === "certificates" && (
        <RecordList
          emptyText="No live certificates are connected yet. This tab will use the Certificates API next."
          items={related.certificates.map((certificate) => ({
            title: certificate.courseName,
            subtitle: `Reference ${certificate.referenceNumber}`,
            meta: `Issued ${formatDate(certificate.issueDate)} · ${certificate.qrCodeValue}`,
            status: certificate.status
          }))}
        />
      )}

      {activeTab === "invoices" && (
        <FileList
          emptyText="No live invoice PDFs are connected yet. This tab will use the InvoiceFiles API next."
          files={related.invoiceFiles}
        />
      )}

      {activeTab === "audit" && (
        <section className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <h3 className="text-xl font-black">Audit History</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Audit history is already being written in Apps Script. A live audit
            endpoint will connect this tab to Google Sheets next.
          </p>
        </section>
      )}
    </div>
  );
}

type MiniStatProps = {
  label: string;
  value: string;
};

function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}

type InfoCardProps = {
  title: string;
  rows: Array<[string, string]>;
};

function InfoCard({ title, rows }: InfoCardProps) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
      <h3 className="text-xl font-black">{title}</h3>
      <div className="mt-5 divide-y divide-slate-200 dark:divide-white/10">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {label}
            </p>
            <p className="font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

type RecordItem = {
  title: string;
  subtitle: string;
  meta: string;
  status: Parameters<typeof StatusBadge>[0]["value"];
};

function RecordList({
  emptyText,
  items
}: {
  emptyText: string;
  items: RecordItem[];
}) {
  if (items.length === 0) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <p className="text-slate-500 dark:text-slate-400">{emptyText}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {items.map((item) => (
        <article
          key={`${item.title}-${item.subtitle}`}
          className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-black">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {item.subtitle}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {item.meta}
              </p>
            </div>
            <StatusBadge value={item.status} />
          </div>
        </article>
      ))}
    </section>
  );
}

function FileList({
  emptyText,
  files
}: {
  emptyText: string;
  files: typeof managedFiles;
}) {
  if (files.length === 0) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <p className="text-slate-500 dark:text-slate-400">{emptyText}</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      {files.map((file) => (
        <article
          key={file.fileId}
          className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="font-black">{file.fileName}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {file.module} · Uploaded by {file.uploadedBy}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {file.notes ?? "-"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={file.status} />
              {file.driveUrl ? (
                <a
                  href={file.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-brand-blue dark:border-white/10 dark:bg-white/5"
                >
                  Open PDF
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
