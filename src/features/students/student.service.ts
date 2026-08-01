import { apiGet, apiPost } from "../../services/api/client";
import type {
  CertificateStatus,
  IdType,
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

export type StudentMutationPayload = {
  nameAsPerId?: string;
  preferredName?: string;
  idType?: IdType;
  idLast4?: string;
  dateOfBirth?: string;
  nationality?: string;
  contactNumber?: string;
  email?: string;
  residentialAddress?: string;
  isCompanySponsored?: boolean;
  companyName?: string;
  companyUen?: string;
  companyContactPerson?: string;
  companyEmail?: string;
  companyContactNumber?: string;
  companyMailingAddress?: string;
  studentStatus?: StudentStatus;
  trainingStatus?: TrainingStatus;
  activeCourse?: string;
  startDate?: string;
  targetCompletionDate?: string;
  completionDate?: string;
  certificateStatus?: CertificateStatus;
  invoicePdfStatus?: InvoicePdfStatus;
  invoicePdfCount?: number;
  uploadedFileCount?: number;
  qrCodeValue?: string;

  firstName?: string;
  lastName?: string;
  phone?: string;
  idNumber?: string;
  address?: string;
  status?: StudentStatus;
  companyContactFax?: string;
  uploadedPdfCount?: number;
};

export type CreateStudentPayload = StudentMutationPayload & {
  nameAsPerId?: string;
  firstName?: string;
  lastName?: string;
};

export type UpdateStudentPayload = StudentMutationPayload & {
  studentId: string;
  studentNumber?: string;
  createdAt?: string;
  createdBy?: string;
};

export type CreateStudentResponse = {
  student: Student;
};

export type UpdateStudentResponse = {
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

export function updateStudentInApi(payload: UpdateStudentPayload) {
  return apiPost<UpdateStudentResponse>("updateStudent", payload);
}
