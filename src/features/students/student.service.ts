import { apiGet, apiPost } from "../../services/api/client";
import type {
  CertificateStatus,
  InvoicePdfStatus,
  Student,
  StudentStatus,
  TrainingStatus
} from "./student.types";

export type ListStudentsResponse = {
  students: Student[];
};

export type GetStudentResponse = {
  student: Student;
};

export type CreateStudentPayload = {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  idNumber?: string;
  address?: string;
  companyName?: string;
  companyUen?: string;
  companyContactPerson?: string;
  companyEmail?: string;
  companyContactFax?: string;
  companyMailingAddress?: string;
  status?: StudentStatus;
  trainingStatus?: TrainingStatus;
  startDate?: string;
  targetCompletionDate?: string;
  completionDate?: string;
  activeCourse?: string;
  certificateStatus?: CertificateStatus;
  invoicePdfStatus?: InvoicePdfStatus;
  invoicePdfCount?: number;
  uploadedPdfCount?: number;
};

export type CreateStudentResponse = {
  student: Student;
};

export function listStudentsFromApi() {
  return apiGet<ListStudentsResponse>("listStudents");
}

export function getStudentFromApi(studentId: string) {
  return apiGet<GetStudentResponse>("getStudent", { studentId });
}

export function createStudentInApi(payload: CreateStudentPayload) {
  return apiPost<CreateStudentResponse>("createStudent", payload);
}
