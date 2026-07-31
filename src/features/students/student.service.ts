import { apiGet, apiPost } from "../../services/api/client";
import type { Student } from "./student.types";

export type ListStudentsResponse = {
  students: Student[];
};

export type GetStudentResponse = {
  student: Student;
};

export type CreateStudentPayload = Partial<Student> & {
  firstName: string;
  lastName: string;
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
