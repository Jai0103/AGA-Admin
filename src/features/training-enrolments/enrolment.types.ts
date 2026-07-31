export type EnrolmentStatus =
  | "Draft"
  | "Pending Review"
  | "Approved"
  | "In Training"
  | "Completed"
  | "Cancelled";

export type AgreementStatus =
  | "Not Sent"
  | "Sent"
  | "Signed"
  | "Rejected";

export type RegistrationStatus =
  | "Not Submitted"
  | "Submitted"
  | "Verified"
  | "Needs Correction";

export type EnrolmentInvoicePdfStatus =
  | "No Invoice PDF"
  | "Uploaded"
  | "Missing"
  | "Needs Replacement";

export type TrainingEnrolment = {
  enrolmentId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  courseCode: string;
  courseName: string;
  status: EnrolmentStatus;
  startDate: string;
  targetCompletionDate: string;
  completionDate?: string;
  trainerName: string;
  agreementStatus: AgreementStatus;
  registrationStatus: RegistrationStatus;
  invoiceNumber: string;
  invoicePdfStatus: EnrolmentInvoicePdfStatus;
  invoicePdfCount: number;
  uploadedPdfCount: number;
  notes: string;
  updatedAt: string;
};

export type EnrolmentFilters = {
  search: string;
  status: "All" | EnrolmentStatus;
  agreementStatus: "All" | AgreementStatus;
  invoicePdfStatus: "All" | EnrolmentInvoicePdfStatus;
};
