import { apiGet, apiPost } from "../../services/api/client";
import type {
  CertificateStatus,
  EnrolmentInvoicePdfStatus,
  EnrolmentPaymentStatus,
  EnrolmentStatus,
  RegistrationFormStatus,
  TeaStatus,
  TrainingEnrolment,
  TrainingStatus
} from "./enrolment.types";

export type ListTrainingEnrolmentsResponse = {
  enrolments: TrainingEnrolment[];
};

export type GetTrainingEnrolmentResponse = {
  enrolment: TrainingEnrolment;
};

export type TrainingEnrolmentMutationPayload = {
  enrolmentId?: string;
  enrolmentNumber?: string;
  studentId: string;
  courseCode?: string;
  courseName: string;
  intakeName?: string;
  trainerId?: string;
  trainerName?: string;
  enrolmentStatus?: EnrolmentStatus;
  status?: EnrolmentStatus;
  trainingStatus?: TrainingStatus;
  startDate?: string;
  targetCompletionDate?: string;
  completionDate?: string;
  teaStatus?: TeaStatus;
  registrationFormStatus?: RegistrationFormStatus;
  certificateStatus?: CertificateStatus;
  invoicePdfStatus?: EnrolmentInvoicePdfStatus;
  invoicePdfCount?: number;
  paymentStatus?: EnrolmentPaymentStatus;
  notes?: string;
  createdAt?: string;
  createdBy?: string;
};

export type CreateTrainingEnrolmentResponse = {
  enrolment: TrainingEnrolment;
};

export type UpdateTrainingEnrolmentResponse = {
  enrolment: TrainingEnrolment;
};

export type ArchiveTrainingEnrolmentResponse = {
  enrolment: TrainingEnrolment;
};

export function listTrainingEnrolmentsFromApi() {
  return apiGet<ListTrainingEnrolmentsResponse>("listTrainingEnrolments");
}

export function getTrainingEnrolmentFromApi(enrolmentId: string) {
  return apiGet<GetTrainingEnrolmentResponse>("getTrainingEnrolment", {
    enrolmentId
  });
}

export function createTrainingEnrolmentInApi(
  payload: TrainingEnrolmentMutationPayload
) {
  return apiPost<CreateTrainingEnrolmentResponse>(
    "createTrainingEnrolment",
    payload
  );
}

export function updateTrainingEnrolmentInApi(
  payload: TrainingEnrolmentMutationPayload & { enrolmentId: string }
) {
  return apiPost<UpdateTrainingEnrolmentResponse>(
    "updateTrainingEnrolment",
    payload
  );
}

export function archiveTrainingEnrolmentInApi(enrolmentId: string) {
  return apiPost<ArchiveTrainingEnrolmentResponse>("archiveTrainingEnrolment", {
    enrolmentId
  });
}
