export type TrainingRecordType =
  | "Theory Lesson"
  | "Practical Lesson"
  | "Assessment"
  | "Remedial"
  | "Completion";

export type TrainingRecordResult =
  | "Pending"
  | "Passed"
  | "Failed"
  | "Completed"
  | "Requires Follow Up";

export type TrainingRecord = {
  recordId: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  enrolmentId: string;
  courseCode: string;
  courseName: string;
  recordType: TrainingRecordType;
  recordDate: string;
  moduleName: string;
  score?: number;
  result: TrainingRecordResult;
  trainerName: string;
  durationMinutes: number;
  remarks: string;
  pdfFileId?: string;
  pdfUrl?: string;
  updatedAt: string;
};

export type TrainingRecordFilters = {
  search: string;
  recordType: "All" | TrainingRecordType;
  result: "All" | TrainingRecordResult;
  courseCode: "All" | string;
};
