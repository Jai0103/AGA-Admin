export type StudentStatus =
  | "Active"
  | "Pending"
  | "Completed"
  | "On Hold"
  | "Withdrawn";

export type TrainingStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Expired"
  | "Suspended";

export type CertificateStatus =
  | "Not Eligible"
  | "Ready"
  | "Generated"
  | "Issued"
  | "Expired";

export type InvoicePdfStatus =
  | "No Invoice PDF"
  | "Uploaded"
  | "Missing"
  | "Needs Replacement";

export type Student = {
  studentId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  status: StudentStatus;
  trainingStatus: TrainingStatus;
  startDate: string;
  targetCompletionDate: string;
  completionDate?: string;
  activeCourse: string;
  certificateStatus: CertificateStatus;
  invoicePdfStatus: InvoicePdfStatus;
  invoicePdfCount: number;
  uploadedPdfCount: number;
  qrCodeValue: string;
  updatedAt: string;
};

export type StudentFilters = {
  search: string;
  status: "All" | StudentStatus;
  trainingStatus: "All" | TrainingStatus;
  invoicePdfStatus: "All" | InvoicePdfStatus;
};
