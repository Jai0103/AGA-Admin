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

export type IdType = "NRIC" | "Passport" | "FIN" | "Other" | "NRIC/Passport";

export type Student = {
  studentId: string;
  studentNumber: string;
  nameAsPerId: string;
  preferredName?: string;
  idType: IdType;
  idLast4: string;
  dateOfBirth: string;
  nationality: string;
  contactNumber: string;
  email: string;
  residentialAddress: string;
  isCompanySponsored: boolean | string;
  companyName?: string;
  companyUen?: string;
  companyContactPerson?: string;
  companyEmail?: string;
  companyContactNumber?: string;
  companyMailingAddress?: string;
  studentStatus: StudentStatus;
  trainingStatus: TrainingStatus;
  activeCourse: string;
  startDate: string;
  targetCompletionDate: string;
  completionDate?: string;
  certificateStatus: CertificateStatus;
  invoicePdfStatus: InvoicePdfStatus;
  invoicePdfCount: number;
  uploadedFileCount: number;
  qrCodeValue: string;
  createdAt?: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;

  firstName?: string;
  lastName?: string;
  phone?: string;
  idNumber?: string;
  address?: string;
  status?: StudentStatus;
  companyContactFax?: string;
  uploadedPdfCount?: number;
};

export type StudentFilters = {
  search: string;
  status: "All" | StudentStatus;
  trainingStatus: "All" | TrainingStatus;
  invoicePdfStatus: "All" | InvoicePdfStatus;
};
