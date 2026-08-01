import {
  ArrowLeft,
  Building2,
  GraduationCap,
  Loader2,
  Save,
  ServerCrash,
  UserRound
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { PageHeader } from "../../components/ui/PageHeader";
import { getStudentFromApi, updateStudentInApi } from "./student.service";
import type {
  CertificateStatus,
  IdType,
  Student,
  StudentStatus,
  TrainingStatus
} from "./student.types";

const courseOptions = [
  "UATO Theory Course",
  "Flight Instructor Check",
  "UAPL Practical Training",
  "UAPL Theory Refresher",
  "Custom Course"
];

const idTypeOptions: IdType[] = ["NRIC", "Passport", "FIN", "Other"];

const studentStatuses: StudentStatus[] = [
  "Active",
  "Pending",
  "Completed",
  "On Hold",
  "Withdrawn"
];

const trainingStatuses: TrainingStatus[] = [
  "Not Started",
  "In Progress",
  "Completed",
  "Expired",
  "Suspended"
];

const certificateStatuses: CertificateStatus[] = [
  "Not Eligible",
  "Ready",
  "Generated",
  "Issued",
  "Expired"
];

type FormState = {
  nameAsPerId: string;
  idType: IdType;
  idLast4: string;
  dateOfBirth: string;
  nationality: string;
  contactNumber: string;
  email: string;
  residentialAddress: string;
  isCompanySponsored: boolean;
  companyName: string;
  companyUen: string;
  companyContactPerson: string;
  companyEmail: string;
  companyContactNumber: string;
  companyMailingAddress: string;
  studentStatus: StudentStatus;
  trainingStatus: TrainingStatus;
  activeCourse: string;
  startDate: string;
  targetCompletionDate: string;
  completionDate: string;
  certificateStatus: CertificateStatus;
};

const initialForm: FormState = {
  nameAsPerId: "",
  idType: "NRIC",
  idLast4: "",
  dateOfBirth: "",
  nationality: "",
  contactNumber: "",
  email: "",
  residentialAddress: "",
  isCompanySponsored: false,
  companyName: "",
  companyUen: "",
  companyContactPerson: "",
  companyEmail: "",
  companyContactNumber: "",
  companyMailingAddress: "",
  studentStatus: "Active",
  trainingStatus: "Not Started",
  activeCourse: "UATO Theory Course",
  startDate: "",
  targetCompletionDate: "",
  completionDate: "",
  certificateStatus: "Not Eligible"
};

function toDateInputValue(value?: string) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    return rawValue;
  }

  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function getStudentName(student: Student) {
  const legacyName = [student.firstName, student.lastName]
    .filter((part) => part && part !== "-")
    .join(" ");

  return student.nameAsPerId || student.preferredName || legacyName;
}

function toBoolean(value: boolean | string | undefined) {
  if (typeof value === "boolean") {
    return value;
  }

  return String(value ?? "").toLowerCase() === "true";
}

function studentToForm(student: Student): FormState {
  const companySponsored = Boolean(
    toBoolean(student.isCompanySponsored) ||
      student.companyName ||
      student.companyUen ||
      student.companyContactPerson ||
      student.companyEmail ||
      student.companyContactNumber ||
      student.companyContactFax ||
      student.companyMailingAddress
  );

  return {
    nameAsPerId: getStudentName(student),
    idType: student.idType || "NRIC",
    idLast4: student.idLast4 || student.idNumber || "",
    dateOfBirth: toDateInputValue(student.dateOfBirth),
    nationality: student.nationality || "",
    contactNumber: String(student.contactNumber || student.phone || ""),
    email: student.email || "",
    residentialAddress: student.residentialAddress || student.address || "",
    isCompanySponsored: companySponsored,
    companyName: student.companyName || "",
    companyUen: student.companyUen || "",
    companyContactPerson: student.companyContactPerson || "",
    companyEmail: student.companyEmail || "",
    companyContactNumber:
      student.companyContactNumber || student.companyContactFax || "",
    companyMailingAddress: student.companyMailingAddress || "",
    studentStatus: student.studentStatus || student.status,
    trainingStatus: student.trainingStatus,
    activeCourse: student.activeCourse || "UATO Theory Course",
    startDate: toDateInputValue(student.startDate),
    targetCompletionDate: toDateInputValue(student.targetCompletionDate),
    completionDate: toDateInputValue(student.completionDate),
    certificateStatus: student.certificateStatus
  };
}

export function EditStudentPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    if (!studentId) {
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
          setForm(studentToForm(response.student));
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
  }, [studentId]);

  function updateField<Field extends keyof FormState>(
    field: Field,
    value: FormState[Field]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleSponsorChange(isCompanySponsored: boolean) {
    setForm((current) => ({
      ...current,
      isCompanySponsored,
      companyName: isCompanySponsored ? current.companyName : "",
      companyUen: isCompanySponsored ? current.companyUen : "",
      companyContactPerson: isCompanySponsored
        ? current.companyContactPerson
        : "",
      companyEmail: isCompanySponsored ? current.companyEmail : "",
      companyContactNumber: isCompanySponsored
        ? current.companyContactNumber
        : "",
      companyMailingAddress: isCompanySponsored
        ? current.companyMailingAddress
        : ""
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!student) {
      setErrorMessage("Student record is not loaded.");
      return;
    }

    if (!form.nameAsPerId.trim()) {
      setErrorMessage("Name as per NRIC/Passport is required.");
      return;
    }

    if (form.isCompanySponsored && !form.companyName.trim()) {
      setErrorMessage("Company name is required for company sponsored applications.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await updateStudentInApi({
        studentId: student.studentId,
        studentNumber: student.studentNumber,
        nameAsPerId: form.nameAsPerId.trim(),
        preferredName: form.nameAsPerId.trim(),
        idType: form.idType,
        idLast4: form.idLast4.trim(),
        dateOfBirth: form.dateOfBirth,
        nationality: form.nationality.trim(),
        contactNumber: form.contactNumber.trim(),
        email: form.email.trim(),
        residentialAddress: form.residentialAddress.trim(),
        isCompanySponsored: form.isCompanySponsored,
        companyName: form.isCompanySponsored ? form.companyName.trim() : "",
        companyUen: form.isCompanySponsored ? form.companyUen.trim() : "",
        companyContactPerson: form.isCompanySponsored
          ? form.companyContactPerson.trim()
          : "",
        companyEmail: form.isCompanySponsored ? form.companyEmail.trim() : "",
        companyContactNumber: form.isCompanySponsored
          ? form.companyContactNumber.trim()
          : "",
        companyMailingAddress: form.isCompanySponsored
          ? form.companyMailingAddress.trim()
          : "",
        studentStatus: form.studentStatus,
        trainingStatus: form.trainingStatus,
        activeCourse: form.activeCourse,
        startDate: form.startDate,
        targetCompletionDate: form.targetCompletionDate,
        completionDate: form.completionDate,
        certificateStatus: form.certificateStatus,
        invoicePdfStatus: student.invoicePdfStatus,
        invoicePdfCount: student.invoicePdfCount,
        uploadedFileCount: student.uploadedFileCount ?? student.uploadedPdfCount,
        qrCodeValue: student.qrCodeValue || student.studentId
      });

      toast.success("Student updated");
      navigate(`/students/${response.student.studentId}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not update student.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-white/70 bg-white/86 p-8 text-center shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
        <Loader2 className="mx-auto animate-spin text-brand-blue" size={32} />
        <h2 className="mt-4 text-2xl font-black">Loading edit form</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Fetching the live student record from Google Sheets.
        </p>
      </section>
    );
  }

  if (errorMessage && !student) {
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
        <h2 className="mt-4 text-3xl font-black">Could not load student</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">{errorMessage}</p>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Information"
        title="Edit Student"
        description="Update the live student profile in Google Sheets."
        icon={GraduationCap}
        accentClassName="border-brand-mint"
      >
        <Link
          to={student ? `/students/${student.studentId}` : "/students"}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-brand-blue shadow-sm transition hover:text-brand-navy dark:border-white/10 dark:bg-white/5 dark:hover:text-white"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </PageHeader>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/70 bg-white/86 p-6 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7"
      >
        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-brand-sky/15 text-brand-blue">
                <UserRound size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black">Applicant Particulars</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Primary student details from the registration form.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextField
                  label="Name as per NRIC/Passport"
                  value={form.nameAsPerId}
                  required
                  onChange={(value) => updateField("nameAsPerId", value)}
                />
              </div>
              <SelectField
                label="ID Type"
                value={form.idType}
                options={idTypeOptions}
                onChange={(value) => updateField("idType", value as IdType)}
              />
              <TextField
                label="NRIC/Passport No. (Last 4 Digits)"
                value={form.idLast4}
                maxLength={4}
                placeholder="123A"
                onChange={(value) => updateField("idLast4", value)}
              />
              <TextField
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(value) => updateField("dateOfBirth", value)}
              />
              <TextField
                label="Nationality"
                value={form.nationality}
                onChange={(value) => updateField("nationality", value)}
              />
              <TextField
                label="Contact No."
                value={form.contactNumber}
                onChange={(value) => updateField("contactNumber", value)}
              />
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
              />
              <div className="sm:col-span-2">
                <TextAreaField
                  label="Residential Address"
                  value={form.residentialAddress}
                  onChange={(value) => updateField("residentialAddress", value)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-brand-mint/15 text-brand-navy dark:text-brand-mint">
                <Building2 size={22} />
              </div>
              <div>
                <h3 className="text-xl font-black">Sponsorship</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Show company fields only when this application is sponsored.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => handleSponsorChange(false)}
                className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                  !form.isCompanySponsored
                    ? "bg-white text-brand-blue shadow-sm dark:bg-white/12 dark:text-white"
                    : "text-slate-500 hover:text-brand-blue dark:text-slate-300"
                }`}
              >
                Self Sponsored
              </button>
              <button
                type="button"
                onClick={() => handleSponsorChange(true)}
                className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                  form.isCompanySponsored
                    ? "bg-brand-blue text-white shadow-glow"
                    : "text-slate-500 hover:text-brand-blue dark:text-slate-300"
                }`}
              >
                Company Sponsored
              </button>
            </div>

            {form.isCompanySponsored ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Company Name"
                  value={form.companyName}
                  required
                  onChange={(value) => updateField("companyName", value)}
                />
                <TextField
                  label="Company UEN No."
                  value={form.companyUen}
                  onChange={(value) => updateField("companyUen", value)}
                />
                <TextField
                  label="Contact Person"
                  value={form.companyContactPerson}
                  onChange={(value) =>
                    updateField("companyContactPerson", value)
                  }
                />
                <TextField
                  label="Email"
                  type="email"
                  value={form.companyEmail}
                  onChange={(value) => updateField("companyEmail", value)}
                />
                <TextField
                  label="Contact No."
                  value={form.companyContactNumber}
                  onChange={(value) =>
                    updateField("companyContactNumber", value)
                  }
                />
                <div className="sm:col-span-2">
                  <TextAreaField
                    label="Mailing Address"
                    value={form.companyMailingAddress}
                    onChange={(value) =>
                      updateField("companyMailingAddress", value)
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center dark:border-white/10 dark:bg-white/5">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-200">
                  No company details needed.
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Switch to Company Sponsored if the trainee is registered by an
                  organisation.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5 xl:col-span-2">
            <h3 className="text-xl font-black">Training Details</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
              Student status is the profile lifecycle. Training status is the
              course progress for the selected active course.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <SelectField
                label="Student Status"
                value={form.studentStatus}
                options={studentStatuses}
                onChange={(value) =>
                  updateField("studentStatus", value as StudentStatus)
                }
              />
              <SelectField
                label="Training Status"
                value={form.trainingStatus}
                options={trainingStatuses}
                onChange={(value) =>
                  updateField("trainingStatus", value as TrainingStatus)
                }
              />
              <SelectField
                label="Active Course"
                value={form.activeCourse}
                options={courseOptions}
                onChange={(value) => updateField("activeCourse", value)}
              />
              <SelectField
                label="Certificate Status"
                value={form.certificateStatus}
                options={certificateStatuses}
                onChange={(value) =>
                  updateField("certificateStatus", value as CertificateStatus)
                }
              />
              <TextField
                label="Start Date"
                type="date"
                value={form.startDate}
                onChange={(value) => updateField("startDate", value)}
              />
              <TextField
                label="Target Completion Date"
                type="date"
                value={form.targetCompletionDate}
                onChange={(value) => updateField("targetCompletionDate", value)}
              />
              <TextField
                label="Completion Date"
                type="date"
                value={form.completionDate}
                onChange={(value) => updateField("completionDate", value)}
              />
            </div>
          </section>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to={student ? `/students/${student.studentId}` : "/students"}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:text-brand-blue dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-glow transition hover:bg-brand-navy disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  onChange: (value: string) => void;
};

function TextField({
  label,
  value,
  type = "text",
  required,
  maxLength,
  placeholder,
  onChange
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      <input
        type={type}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-blue focus:ring-4 focus:ring-brand-sky/10 dark:border-white/10 dark:bg-white/5"
      />
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function TextAreaField({ label, value, onChange }: TextAreaFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-sky/10 dark:border-white/10 dark:bg-white/5"
      />
    </label>
  );
}

type SelectFieldProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-sky/10 dark:border-white/10 dark:bg-white/5"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
