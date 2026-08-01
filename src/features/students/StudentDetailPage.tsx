import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  Download,
  Eye,
  FileArchive,
  FileText,
  GraduationCap,
  History,
  Loader2,
  Mail,
  Phone,
  QrCode,
  ReceiptText,
  ServerCrash,
  UploadCloud,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { StatusBadge } from "../../components/ui/StatusBadge";
import { certificateRecords } from "../certificates/certificate.data";
import { managedFiles } from "../file-manager/file.data";
import { trainingEnrolments } from "../training-enrolments/enrolment.data";
import { trainingRecords } from "../training-records/training-record.data";
import {
  listStudentFilesFromApi,
  readFileAsBase64,
  uploadStudentFileToApi
} from "./student-file.service";
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

const fileModules = [
  "Registration Form",
  "NRIC/Passport",
  "Training Agreement",
  "Invoice PDF",
  "Certificate Support",
  "Other"
] as const;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png"
]);

const maxUploadSizeBytes = 8 * 1024 * 1024;

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

function fileSizeLabel(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

export function StudentDetailPage() {
  const { studentId } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [studentFiles, setStudentFiles] = useState<StudentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilesLoading, setIsFilesLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filesErrorMessage, setFilesErrorMessage] = useState("");
  const [uploadErrorMessage, setUploadErrorMessage] = useState("");
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");
  const [selectedModule, setSelectedModule] =
    useState<(typeof fileModules)[number]>("Registration Form");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileNotes, setFileNotes] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  const loadStudentFiles = useCallback(() => {
    if (!studentId) {
      setStudentFiles([]);
      return Promise.resolve();
    }

    setIsFilesLoading(true);
    setFilesErrorMessage("");

    return listStudentFilesFromApi(studentId)
      .then((response) => {
        setStudentFiles(response.files);
      })
      .catch((error: Error) => {
        setStudentFiles([]);
        setFilesErrorMessage(error.message);
      })
      .finally(() => {
        setIsFilesLoading(false);
      });
  }, [studentId]);

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

    loadStudentFiles();

    return () => {
      mounted = false;
    };
  }, [loadStudentFiles, studentId]);

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

  async function handleFileUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!studentId) {
      setUploadErrorMessage("Missing student ID.");
      return;
    }

    if (!selectedFile) {
      setUploadErrorMessage("Choose a file before uploading.");
      return;
    }

    if (!allowedMimeTypes.has(selectedFile.type)) {
      setUploadErrorMessage("Allowed files: PDF, Word DOC/DOCX, JPG, or PNG.");
      return;
    }

    if (selectedFile.size > maxUploadSizeBytes) {
      setUploadErrorMessage("Maximum upload size is 8 MB.");
      return;
    }

    setIsUploading(true);
    setUploadErrorMessage("");
    setUploadSuccessMessage("");

    try {
      const base64Data = await readFileAsBase64(selectedFile);

      await uploadStudentFileToApi({
        studentId,
        module: selectedModule,
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        base64Data,
        notes: fileNotes.trim()
      });

      setSelectedFile(null);
      setFileNotes("");
      setUploadSuccessMessage("File uploaded successfully.");
      await loadStudentFiles();
    } catch (error) {
      setUploadErrorMessage(
        error instanceof Error ? error.message : "Could not upload file."
      );
    } finally {
      setIsUploading(false);
    }
  }

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
              {student.studentNumber} - {student.activeCourse || "No course assigned"}
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
            subtitle: `${enrolment.enrolmentId} - Trainer: ${enrolment.trainerName}`,
            meta: `Start ${formatDate(enrolment.startDate)} - Target ${formatDate(
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
            subtitle: `${record.recordType} - ${record.trainerName}`,
            meta: `${formatDate(record.recordDate)} - ${record.durationMinutes} minutes`,
            status: record.result
          }))}
        />
      )}

      {activeTab === "files" && (
        <section className="space-y-4">
          <StudentFileUploadCard
            fileNotes={fileNotes}
            isUploading={isUploading}
            selectedFile={selectedFile}
            selectedModule={selectedModule}
            uploadErrorMessage={uploadErrorMessage}
            uploadSuccessMessage={uploadSuccessMessage}
            onClearFile={() => setSelectedFile(null)}
            onFileChange={(file) => {
              setSelectedFile(file);
              setUploadErrorMessage("");
              setUploadSuccessMessage("");
            }}
            onModuleChange={setSelectedModule}
            onNotesChange={setFileNotes}
            onSubmit={handleFileUpload}
          />
          <StudentFileList
            emptyText="No uploaded student files yet."
            files={studentFiles}
            isLoading={isFilesLoading}
            errorMessage={filesErrorMessage}
          />
        </section>
      )}

      {activeTab === "certificates" && (
        <RecordList
          emptyText="No live certificates are connected yet. This tab will use the Certificates API next."
          items={related.certificates.map((certificate) => ({
            title: certificate.courseName,
            subtitle: `Reference ${certificate.referenceNumber}`,
            meta: `Issued ${formatDate(certificate.issueDate)} - ${
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

type StudentFileUploadCardProps = {
  fileNotes: string;
  isUploading: boolean;
  selectedFile: File | null;
  selectedModule: (typeof fileModules)[number];
  uploadErrorMessage: string;
  uploadSuccessMessage: string;
  onClearFile: () => void;
  onFileChange: (file: File | null) => void;
  onModuleChange: (module: (typeof fileModules)[number]) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function StudentFileUploadCard({
  fileNotes,
  isUploading,
  selectedFile,
  selectedModule,
  uploadErrorMessage,
  uploadSuccessMessage,
  onClearFile,
  onFileChange,
  onModuleChange,
  onNotesChange,
  onSubmit
}: StudentFileUploadCardProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-blue">
            Student file upload
          </p>
          <h3 className="mt-2 text-2xl font-black">Upload supporting document</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Store PDFs, Word documents, JPG, or PNG files in the student's Drive
            folder and save the link in Google Sheets.
          </p>
        </div>

        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-glow transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
          {isUploading ? "Uploading" : "Upload file"}
        </button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[220px_1fr]">
        <label className="grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
          File module
          <select
            value={selectedModule}
            onChange={(event) =>
              onModuleChange(event.target.value as (typeof fileModules)[number])
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {fileModules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
        </label>

        <label className="grid cursor-pointer place-items-center rounded-3xl border border-dashed border-brand-blue/30 bg-brand-blue/5 px-4 py-6 text-center transition hover:border-brand-blue hover:bg-brand-blue/10 dark:bg-brand-blue/10">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png"
            className="sr-only"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
          <UploadCloud className="text-brand-blue" size={28} />
          <span className="mt-2 text-sm font-black text-slate-900 dark:text-white">
            Choose PDF, Word, JPG, or PNG
          </span>
          <span className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Maximum 8 MB
          </span>
        </label>
      </div>

      {selectedFile ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm font-black">{selectedFile.name}</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {selectedFile.type || "Unknown file type"} - {fileSizeLabel(selectedFile.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClearFile}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 transition hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          >
            <X size={15} />
            Remove
          </button>
        </div>
      ) : null}

      <label className="mt-4 grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
        Notes
        <textarea
          value={fileNotes}
          onChange={(event) => onNotesChange(event.target.value)}
          rows={3}
          placeholder="Optional note for this file"
          className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </label>

      {uploadErrorMessage ? (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
          {uploadErrorMessage}
        </p>
      ) : null}

      {uploadSuccessMessage ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
          {uploadSuccessMessage}
        </p>
      ) : null}
    </form>
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
                {file.module} - Uploaded by {file.uploadedBy || "unknown"}
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
            <div className="flex shrink-0 items-center gap-2">
              <a
                href={file.driveUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${file.fileName}`}
                title="View file"
                className="group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-blue/30 hover:bg-brand-blue hover:text-white hover:shadow-glow dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <Eye size={18} />
                <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white opacity-0 shadow-panel transition group-hover:opacity-100">
                  View
                </span>
              </a>
              <a
                href={file.driveUrl}
                download
                target="_blank"
                rel="noreferrer"
                aria-label={`Download ${file.fileName}`}
                title="Download file"
                className="group relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-brand-navy dark:bg-sky-500 dark:hover:bg-sky-400"
              >
                <Download size={18} />
                <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-black text-white opacity-0 shadow-panel transition group-hover:opacity-100">
                  Download
                </span>
              </a>
            </div>
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
                {file.module} - Uploaded by {file.uploadedBy}
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
