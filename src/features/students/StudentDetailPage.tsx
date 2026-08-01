import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  Download,
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
import { listStudentFilesFromApi } from "./student-file.service";
import type { StudentFile } from "./student-file.service";
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

function studentName(student: Student) {
  const legacyName = [student.firstName, student.lastName]
    .filter((part) => part && part !== "-")
    .join(" ");

  return student.nameAsPerId || student.preferredName || legacyName || "-";
}

function contactNumber(student: Student) {
  return String(student.contactNumber || student.phone || "");
}

function residentialAddress(student: Student) {
  return student.residentialAddress || student.address || "";
}

function studentStatus(student: Student) {
  return student.studentStatus || student.status;
}

function idLast4(student: Student) {
  return student.idLast4 || student.idNumber || "";
}

function companyContactNumber(student: Student) {
  return student.companyContactNumber || student.companyContactFax || "";
}

export function StudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [studentFiles, setStudentFiles] = useState<StudentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filesErrorMessage, setFilesErrorMessage] = useState("");
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
    setIsFilesLoading(true);
    setErrorMessage("");
    setFilesErrorMessage("");

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

    listStudentFilesFromApi(studentId)
      .then((response) => {
        if (mounted) {
          setStudentFiles(response.files);
        }
      })
      .catch((error: Error) => {
        if (mounted) {
          setStudentFiles([]);
          setFilesErrorMessage(error.message);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsFilesLoading(false);
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
        certificates: [],
        invoiceFiles: []
      };
    }

    return {
      enrolments: trainingEnrolments.filter(
        (enrolment) => enrolment.studentId === student.studentId
      ),
      records: trainingRecords.filter(
        (record) => record.studentId === student.studentId
      ),
      certificates: certificateRecords.filter(
        (certificate) => certificate.studentId === student.studentId
      ),
      invoiceFiles: managedFiles.filter(
        (file) =>
          file.studentId === student.studentId && file.module === "Invoice PDF"
      )
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
                {studentName(student)}
              </h2>
              <StatusBadge value={studentStatus(student)} />
            </div>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {student.studentNumber} · {student.activeCourse || "No course assigned"}
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <Mail size={16} />
                {student.email || student.companyEmail || "No email"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <Phone size={16} />
                {contactNumber(student) || "No phone"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <QrCode size={16} />
                {student.qrCodeValue || student.studentId}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            <MiniStat label="Enrolments" value={String(related.enrolments.length)} />
            <MiniStat label="Records" value={String(related.records.length)} />
            <MiniStat label="Files" value={String(studentFiles.length)} />
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
            title="Applicant Particulars"
            rows={[
              ["Name as per NRIC/Passport", studentName(student)],
              ["Preferred name", student.preferredName || "-"],
              ["ID type", student.idType || "-"],
              ["ID last 4", idLast4(student) || "-"],
              ["Date of birth", formatDate(student.dateOfBirth)],
              ["Nationality", student.nationality || "-"],
              ["Contact No.", contactNumber(student) || "-"],
              ["Email", student.email || "-"],
              ["Residential address", residentialAddress(student) || "-"]
            ]}
          />
          <InfoCard
            title="Training Overview"
            rows={[
              ["Current course", student.activeCourse || "-"],
              ["Student status", studentStatus(student)],
              ["Training status", student.trainingStatus],
              ["Start date", formatDate(student.startDate)],
              ["Target completion", formatDate(student.targetCompletionDate)],
              ["Completion date", formatDate(student.completionDate)],
              ["Certificate status", student.certificateStatus]
            ]}
          />
          <InfoCard
            title="Company Sponsored Application"
            rows={[
              ["Company name", student.companyName || "-"],
              ["Company UEN No.", student.companyUen || "-"],
              ["Contact person", student.companyContactPerson || "-"],
              ["Email", student.companyEmail || "-"],
              ["Contact No.", companyContactNumber(student) || "-"],
              ["Mailing address", student.companyMailingAddress || "-"]
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
        <StudentFileList
          emptyText="No uploaded student files yet."
          files={studentFiles}
          isLoading={isFilesLoading}
          errorMessage={filesErrorMessage}
        />
      )}

      {activeTab === "certificates" && (
        <RecordList
          emptyText="No live certificates are connected yet. This tab will use the Certificates API next."
          items={related.certificates.map((certificate) => ({
            title: certificate.courseName,
            subtitle: `Reference ${certificate.referenceNumber}`,
            meta: `Issued ${formatDate(certificate.issueDate)} · ${
              certificate.qrCodeValue
            }`,
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

function StudentFileList({
  emptyText,
  files,
  isLoading,
  errorMessage
}: {
  emptyText: string;
  files: StudentFile[];
  isLoading: boolean;
  errorMessage: string;
}) {
  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/86 p-6 text-center shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <Loader2 className="mx-auto animate-spin text-brand-blue" size={28} />
        <p className="mt-3 font-bold text-slate-600 dark:text-slate-300">
          Loading student files
        </p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 shadow-panel backdrop-blur-xl dark:border-rose-400/20 dark:bg-rose-400/10">
        <p className="font-bold text-rose-700 dark:text-rose-200">
          Could not load files
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {errorMessage}
        </p>
      </section>
    );
  }

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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="truncate font-black">{file.fileName}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {file.module} · Uploaded by {file.uploadedBy || "unknown"}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Uploaded {formatDate(file.uploadedAt)}
              </p>
              {file.notes ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {file.notes}
                </p>
              ) : null}
            </div>
            <a
              href={file.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand-blue px-4 py-3 text-sm font-black text-white shadow-glow transition hover:bg-brand-navy"
            >
              <Download size={17} />
              Download
            </a>
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
                  Download
                </a>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
