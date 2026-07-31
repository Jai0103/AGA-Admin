export type CertificateStatus =
  | "Draft"
  | "Ready"
  | "Generated"
  | "Issued"
  | "Expired"
  | "Revoked";

export type CertificateTemplateStatus = "Active" | "Inactive" | "Draft";

export type CertificateTemplate = {
  templateId: string;
  templateName: string;
  courseCode: string;
  courseName: string;
  status: CertificateTemplateStatus;
  layout: "AGA Completion Landscape";
  defaultSignatoryName: string;
  defaultSignatoryTitle: string;
  updatedAt: string;
};

export type CertificateRecord = {
  certificateId: string;
  referenceNumber: string;
  studentId: string;
  studentName: string;
  enrolmentId: string;
  courseCode: string;
  courseName: string;
  templateId: string;
  status: CertificateStatus;
  issueDate: string;
  expiryDate?: string;
  signatoryName: string;
  signatoryTitle: string;
  generatedPdfFileId?: string;
  generatedPdfUrl?: string;
  qrCodeValue: string;
  updatedAt: string;
};

export type CertificateFilters = {
  search: string;
  status: "All" | CertificateStatus;
  courseCode: "All" | string;
  templateStatus: "All" | CertificateTemplateStatus;
};
