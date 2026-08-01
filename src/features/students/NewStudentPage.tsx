import {
  ArrowLeft,
  Building2,
  FileUp,
  GraduationCap,
  Loader2,
  Save,
  UserRound,
  X
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { PageHeader } from "../../components/ui/PageHeader";
import { createStudentInApi } from "./student.service";
import type { CertificateStatus, StudentStatus, TrainingStatus } from "./student.types";

const courseOptions = [
  "UATO Theory Course",
  "Flight Instructor Check",
  "UAPL Practical Training",
  "UAPL Theory Refresher",
  "Custom Course"
];

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

type FormState = {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  nationality: string;
  phone: string;
  address: string;
  isCompanySponsored: boolean;
  companyName: string;
  companyUen: string;
  companyContactPerson: string;
  companyEmail: string;
  companyContactFax: string;
  companyMailingAddress: string;
  status: StudentStatus;
  trainingStatus: TrainingStatus;
  activeCourse: string;
  startDate: string;
  targetCompletionDate: string;
  certificateStatus: CertificateStatus;
};

const initialForm: FormState = {
  fullName: "",
  idNumber: "",
  dateOfBirth: "",
  nationality: "",
  phone: "",
  address: "",
  isCompanySponsored: false,
  companyName: "",
  companyUen: "",
  companyContactPerson: "",
  companyEmail: "",
  companyContactFax: "",
  companyMailingAddress: "",
  status: "Active",
  trainingStatus: "Not Started",
  activeCourse: "UATO Theory Course",
  startDate: "",
  targetCompletionDate: "",
  certificateStatus: "Not Eligible"
};

export function NewStudentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const acceptedFileTypes = useMemo(
    () => ".pdf,.doc,.docx,.jpg,.jpeg,.png",
    []
  );

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
      companyContactFax: isCompanySponsored ? current.companyContactFax : "",
      companyMailingAddress: isCompanySponsored
        ? current.companyMailingAddress
        : ""
    }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    const allowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const incomingFiles = Array.from(files).filter((file) => {
      const lowerName = file.name.toLowerCase();
      return allowedExtensions.some((extension) => lowerName.endsWith(extension));
    });

    setSelectedFiles((current) => [...current, ...incomingFiles]);
  }

  function removeFile(fileName: string) {
    setSelectedFiles((current) =>
      current.filter((file) => file.name !== fileName)
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.fullName.trim()) {
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
      const nameParts = form.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] ?? form.fullName.trim();
      const lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-";

      await createStudentInApi({
        firstName,
        lastName,
        preferredName: form.fullName.trim(),
        idNumber: form.idNumber.trim(),
        dateOfBirth: form.dateOfBirth,
        nationality: form.nationality.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        companyName: form.isCompanySponsored ? form.companyName.trim() : "",
        companyUen: form.isCompanySponsored ? form.companyUen.trim() : "",
        companyContactPerson: form.isCompanySponsored
          ? form.companyContactPerson.trim()
          : "",
        companyEmail: form.isCompanySponsored ? form.companyEmail.trim() : "",
        companyContactFax: form.isCompanySponsored
          ? form.companyContactFax.trim()
          : "",
        companyMailingAddress: form.isCompanySponsored
          ? form.companyMailingAddress.trim()
          : "",
        email: form.isCompanySponsored ? form.companyEmail.trim() : "",
        status: form.status,
        trainingStatus: form.trainingStatus,
        activeCourse: form.activeCourse,
        startDate: form.startDate,
        targetCompletionDate: form.targetCompletionDate,
        certificateStatus: form.certificateStatus,
        invoicePdfStatus: "No Invoice PDF"
      });

      toast.success("Student created");
      navigate("/students");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create student.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Information"
        title="Add Student"
        description="Create a student profile using the registration form fields. File upload will connect to Google Drive in the next backend step."
        icon={GraduationCap}
        accentClassName="border-brand-mint"
      >
        <Link
          to="/students"
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
                  value={form.fullName}
                  required
                  onChange={(value) => updateField("fullName", value)}
                />
              </div>
              <TextField
                label="NRIC/Passport No. (Last 4 Digits)"
                value={form.idNumber}
                maxLength={4}
                placeholder="123A"
                onChange={(value) => updateField("idNumber", value)}
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
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
              />
              <div className="sm:col-span-2">
                <TextAreaField
                  label="Residential Address"
                  value={form.address}
                  onChange={(value) => updateField("address", value)}
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
                  label="Contact/Fax No."
                  value={form.companyContactFax}
                  onChange={(value) => updateField("companyContactFax", value)}
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

          <section className="rounded-3xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-xl font-black">Training Details</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
              Student status is the profile lifecycle. Training status is the
              course progress for the selected active course.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Student Status"
                value={form.status}
                options={studentStatuses}
                onChange={(value) => updateField("status", value as StudentStatus)}
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
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/75 p-5 dark:border-white/10 dark:bg-white/5">
            <h3 className="text-xl font-black">Registration Files</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
              Accepted files: MS Word, PDF, JPG, and PNG. Google Drive upload
              will be connected in the next backend step.
            </p>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-brand-blue/35 bg-brand-sky/10 px-5 py-8 text-center transition hover:border-brand-blue hover:bg-brand-sky/15 dark:border-brand-sky/30 dark:bg-white/5">
              <FileUp size={28} className="text-brand-blue" />
              <span className="mt-3 text-sm font-black text-slate-900 dark:text-white">
                Choose files
              </span>
              <span className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-300">
                PDF, DOC, DOCX, JPG, JPEG, PNG
              </span>
              <input
                type="file"
                multiple
                accept={acceptedFileTypes}
                onChange={(event) => handleFiles(event.target.files)}
                className="hidden"
              />
            </label>

            {selectedFiles.length ? (
              <div className="mt-4 space-y-2">
                {selectedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5"
                  >
                    <span className="min-w-0 truncate font-bold text-slate-700 dark:text-slate-200">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.name)}
                      className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-400/10 dark:hover:text-rose-200"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/students"
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
            {isSubmitting ? "Saving..." : "Save Student"}
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
