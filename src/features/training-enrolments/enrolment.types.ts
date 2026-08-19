export type EnrolmentStatus =
  | "Draft"
  | "Pending Review"
  | "Approved"
  | "In Training"
  | "Completed"
  | "Cancelled";

export type TrainingStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Suspended";

export type TeaStatus =
  | "Pending"
  | "Generated"
  | "Sent"
  | "Signed"
  | "Rejected"
  | "Not Required";

export type RegistrationFormStatus =
  | "Pending"
  | "Submitted"
  | "Verified"
  | "Needs Correction"
  | "Not Required";

export type CertificateStatus =
  | "Not Eligible"
  | "Eligible"
  | "Ready"
  | "Generated"
  | "Issued"
  | "Expired"
  | "Revoked";

export type EnrolmentInvoicePdfStatus =
  | "No Invoice PDF"
  | "Uploaded"
  | "Missing"
  | "Needs Replacement";

export type EnrolmentPaymentStatus =
  | "Not Tracked"
  | "Unpaid"
  | "Deposit Paid"
  | "Paid"
  | "Overdue"
  | "Refunded";

export type TrainingEnrolment = {
  _rowNumber?: number;
  enrolmentId: string;
  enrolmentNumber: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  courseCode: string;
  courseName: string;
  intakeName: string;
  trainerId: string;
  trainerName: string;
  enrolmentStatus: EnrolmentStatus;
  status: EnrolmentStatus;
  trainingStatus: TrainingStatus;
  startDate: string;
  targetCompletionDate: string;
  completionDate?: string;
  teaStatus: TeaStatus;
  registrationFormStatus: RegistrationFormStatus;
  certificateStatus: CertificateStatus;
  invoicePdfStatus: EnrolmentInvoicePdfStatus;
  invoicePdfCount: number;
  paymentStatus: EnrolmentPaymentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
};

export type EnrolmentFilters = {
  search: string;
  enrolmentStatus: "All" | EnrolmentStatus;
  trainingStatus: "All" | TrainingStatus;
  teaStatus: "All" | TeaStatus;
  invoicePdfStatus: "All" | EnrolmentInvoicePdfStatus;
};
