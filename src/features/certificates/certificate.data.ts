import type { CertificateRecord, CertificateTemplate } from "./certificate.types";

export const certificateTemplates: CertificateTemplate[] = [
  {
    templateId: "TPL-UATO-THEORY",
    templateName: "UATO Theory Course Completion",
    courseCode: "UATO",
    courseName: "UATO Theory Course",
    status: "Active",
    layout: "AGA Completion Landscape",
    defaultSignatoryName: "Alan Low Kay Boon",
    defaultSignatoryTitle: "Accountable Manager",
    updatedAt: "2026-07-31T09:00:00.000Z"
  },
  {
    templateId: "TPL-UATO-PRACTICAL",
    templateName: "UATO Practical Training Completion",
    courseCode: "UATO-P",
    courseName: "UAPL Practical Training on Multi-rotor up to 25kg",
    status: "Active",
    layout: "AGA Completion Landscape",
    defaultSignatoryName: "Alan Low Kay Boon",
    defaultSignatoryTitle: "Accountable Manager",
    updatedAt: "2026-07-31T09:05:00.000Z"
  },
  {
    templateId: "TPL-SIM-REFRESHER",
    templateName: "Simulator Refresher Completion",
    courseCode: "SIM-RF",
    courseName: "Simulator Refresher",
    status: "Draft",
    layout: "AGA Completion Landscape",
    defaultSignatoryName: "Alan Low Kay Boon",
    defaultSignatoryTitle: "Accountable Manager",
    updatedAt: "2026-07-30T14:20:00.000Z"
  }
];

export const certificateRecords: CertificateRecord[] = [
  {
    certificateId: "CERT-2026-0001",
    referenceNumber: "24042025-029",
    studentId: "STU-000128",
    studentName: "Jairus Jin Rong",
    enrolmentId: "ENR-2026-0001",
    courseCode: "UATO",
    courseName: "UATO Theory Course",
    templateId: "TPL-UATO-THEORY",
    status: "Ready",
    issueDate: "2026-07-31",
    signatoryName: "Alan Low Kay Boon",
    signatoryTitle: "Accountable Manager",
    qrCodeValue: "AGA-CERT-2026-0001",
    updatedAt: "2026-07-31T09:12:00.000Z"
  },
  {
    certificateId: "CERT-2026-0002",
    referenceNumber: "24042025-030",
    studentId: "STU-000130",
    studentName: "Marcus Lee",
    enrolmentId: "ENR-2026-0003",
    courseCode: "FIC",
    courseName: "Flight Instructor Check",
    templateId: "TPL-UATO-THEORY",
    status: "Generated",
    issueDate: "2026-06-18",
    signatoryName: "Alan Low Kay Boon",
    signatoryTitle: "Accountable Manager",
    generatedPdfFileId: "PDF-CERT-0002",
    generatedPdfUrl: "https://drive.google.com/file/d/example-cert-2/view",
    qrCodeValue: "AGA-CERT-2026-0002",
    updatedAt: "2026-07-29T11:20:00.000Z"
  },
  {
    certificateId: "CERT-2026-0003",
    referenceNumber: "12052026-003",
    studentId: "STU-000132",
    studentName: "Daniel Koh",
    enrolmentId: "ENR-2026-0005",
    courseCode: "UATO",
    courseName: "UATO Theory Course",
    templateId: "TPL-UATO-THEORY",
    status: "Issued",
    issueDate: "2026-05-12",
    signatoryName: "Alan Low Kay Boon",
    signatoryTitle: "Accountable Manager",
    generatedPdfFileId: "PDF-CERT-0003",
    generatedPdfUrl: "https://drive.google.com/file/d/example-cert-3/view",
    qrCodeValue: "AGA-CERT-2026-0003",
    updatedAt: "2026-07-25T10:30:00.000Z"
  }
];
