import { apiGet, apiPost } from "../../services/api/client";

export type StudentFile = {
  fileId: string;
  studentId: string;
  enrolmentId?: string;
  module: string;
  fileName: string;
  mimeType: string;
  driveFileId: string;
  driveUrl: string;
  folderId: string;
  uploadedAt: string;
  uploadedBy: string;
  notes?: string;
};

export type ListStudentFilesResponse = {
  files: StudentFile[];
};

export type UploadStudentFilePayload = {
  studentId: string;
  enrolmentId?: string;
  module?: string;
  fileName: string;
  mimeType: string;
  base64Data: string;
  notes?: string;
};

export type UploadStudentFileResponse = {
  file: StudentFile;
};

export function listStudentFilesFromApi(studentId: string) {
  return apiGet<ListStudentFilesResponse>("listStudentFiles", { studentId });
}

export function uploadStudentFileToApi(payload: UploadStudentFilePayload) {
  return apiPost<UploadStudentFileResponse>("uploadStudentFile", payload);
}

export function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const [, base64Data = ""] = result.split(",");
      resolve(base64Data);
    };

    reader.onerror = () => {
      reject(new Error("Could not read selected file."));
    };

    reader.readAsDataURL(file);
  });
}
