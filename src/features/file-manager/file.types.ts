export type ManagedFileModule =
  | "Student Profile"
  | "Training Enrolment"
  | "Training Record"
  | "Certificate"
  | "Invoice PDF"
  | "TEA"
  | "Registration Form"
  | "Other";

export type ManagedFileStatus =
  | "Uploaded"
  | "Missing"
  | "Needs Replacement"
  | "Archived";

export type ManagedFile = {
  fileId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  enrolmentId?: string;
  module: ManagedFileModule;
  status: ManagedFileStatus;
  fileName: string;
  mimeType: "application/pdf";
  driveFileId: string;
  driveUrl: string;
  folderId: string;
  uploadedAt: string;
  uploadedBy: string;
  notes?: string;
};

export type FileFilters = {
  search: string;
  module: "All" | ManagedFileModule;
  status: "All" | ManagedFileStatus;
};
