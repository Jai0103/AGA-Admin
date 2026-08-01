import { ArrowLeft, GraduationCap, Loader2, Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { PageHeader } from "../../components/ui/PageHeader";
import { createStudentInApi } from "./student.service";
import type {
  CertificateStatus,
  InvoicePdfStatus,
  StudentStatus,
  TrainingStatus
} from "./student.types";

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

const invoicePdfStatuses: InvoicePdfStatus[] = [
  "No Invoice PDF",
  "Uploaded",
  "Missing",
  "Needs Replacement"
];

type FormState = {
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  idNumber: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  status: StudentStatus;
  trainingStatus: TrainingStatus;
  startDate: string;
  targetCompletionDate: string;
  activeCourse: string;
  certificateStatus: CertificateStatus;
  invoicePdfStatus: InvoicePdfStatus;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  preferredName: "",
  email: "",
  phone: "",
  nationality: "",
  dateOfBirth: "",
  idNumber: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  status: "Active",
  trainingStatus: "Not Started",
  startDate: "",
  targetCompletionDate: "",
  activeCourse: "",
  certificateStatus: "Not Eligible",
  invoicePdfStatus: "No Invoice PDF"
};

export function NewStudentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateField<Field extends keyof FormState>(
    field: Field,
    value: FormState[Field]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setErrorMessage("First name and last name are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createStudentInApi({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        preferredName: form.preferredName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        nationality: form.nationality.trim(),
        idNumber: form.idNumber.trim(),
        address: form.address.trim(),
        emergencyContactName: form.emergencyContactName.trim(),
        emergencyContactPhone: form.emergencyContactPhone.trim(),
        activeCourse: form.activeCourse.trim()
      });

      toast.success("Student created");
      navigate(`/students/${response.student.studentId}`);
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
        description="Create a live student profile in Google Sheets. After saving, the system opens the new student profile hub."
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
          <section>
            <h3 className="text-xl font-black">Personal Details</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField
                label="First name"
                value={form.firstName}
                required
                onChange={(value) => updateField("firstName", value)}
              />
              <TextField
                label="Last name"
                value={form.lastName}
                required
                onChange={(value) => updateField("lastName", value)}
              />
              <TextField
                label="Preferred name"
                value={form.preferredName}
                onChange={(value) => updateField("preferredName", value)}
              />
              <TextField
                label="Nationality"
                value={form.nationality}
                onChange={(value) => updateField("nationality", value)}
              />
              <TextField
                label="Date of birth"
                type="date"
                value={form.dateOfBirth}
                onChange={(value) => updateField("dateOfBirth", value)}
              />
              <TextField
                label="ID number"
                value={form.idNumber}
                onChange={(value) => updateField("idNumber", value)}
              />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black">Contact Details</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(value) => updateField("email", value)}
              />
              <TextField
                label="Phone"
                value={form.phone}
                onChange={(value) => updateField("phone", value)}
              />
              <TextField
                label="Emergency contact name"
                value={form.emergencyContactName}
                onChange={(value) =>
                  updateField("emergencyContactName", value)
                }
              />
              <TextField
                label="Emergency contact phone"
                value={form.emergencyContactPhone}
                onChange={(value) =>
                  updateField("emergencyContactPhone", value)
                }
              />
              <div className="sm:col-span-2">
                <TextAreaField
                  label="Address"
                  value={form.address}
                  onChange={(value) => updateField("address", value)}
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black">Training Details</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Student status"
                value={form.status}
                options={studentStatuses}
                onChange={(value) => updateField("status", value as StudentStatus)}
              />
              <SelectField
                label="Training status"
                value={form.trainingStatus}
                options={trainingStatuses}
                onChange={(value) =>
                  updateField("trainingStatus", value as TrainingStatus)
                }
              />
              <TextField
                label="Active course"
                value={form.activeCourse}
                onChange={(value) => updateField("activeCourse", value)}
              />
              <SelectField
                label="Certificate status"
                value={form.certificateStatus}
                options={certificateStatuses}
                onChange={(value) =>
                  updateField("certificateStatus", value as CertificateStatus)
                }
              />
              <TextField
                label="Start date"
                type="date"
                value={form.startDate}
                onChange={(value) => updateField("startDate", value)}
              />
              <TextField
                label="Target completion date"
                type="date"
                value={form.targetCompletionDate}
                onChange={(value) => updateField("targetCompletionDate", value)}
              />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-black">Document Status</h3>
            <div className="mt-5 grid gap-4">
              <SelectField
                label="Invoice PDF status"
                value={form.invoicePdfStatus}
                options={invoicePdfStatuses}
                onChange={(value) =>
                  updateField("invoicePdfStatus", value as InvoicePdfStatus)
                }
              />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Invoice PDFs are uploaded from the finance system later. This
                form only creates the student profile.
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
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
  onChange: (value: string) => void;
};

function TextField({
  label,
  value,
  type = "text",
  required,
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-sky/10 dark:border-white/10 dark:bg-white/5"
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
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-sky/10 dark:border-white/10 dark:bg-white/5"
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
