# AGA Student Information System - Enterprise Workflow

This document defines the operating workflow for Apollo Global Academy's Student Information System. It keeps each module focused, avoids duplicate workflows, and gives the implementation a clear direction before adding more features.

## Core Principle

The system should follow the real training lifecycle:

1. A student is registered.
2. The student is enrolled into one or more courses.
3. Training activity and evidence are recorded against an enrolment.
4. Completion is reviewed.
5. A certificate is generated from a completed enrolment.
6. Files, invoices, certificates, and audit history remain traceable.

## Module Responsibilities

### 1. Students

The Students module is the master profile area.

It owns:

- Applicant particulars
- Company sponsored application details
- Contact information
- Student lifecycle status
- Student-level files
- Student overview and history

It should not own:

- Detailed course progress
- Trainer assessments
- Completion evidence
- Certificate generation rules

Those belong to Training Enrolments, Training Records, and Certificates.

Recommended student statuses:

- Pending
- Active
- Completed
- On Hold
- Withdrawn

Status meaning:

- Pending: student profile created but enrolment is not fully ready.
- Active: student has at least one active enrolment.
- Completed: student has completed all intended training.
- On Hold: student is paused but not withdrawn.
- Withdrawn: student is no longer continuing.

### 2. Training Enrolments

Training Enrolments represent course registration.

A student can have more than one enrolment.

Example:

- Jairus is enrolled in UATO Theory Course.
- Jairus later enrols in UAPL Practical Training.

Each enrolment owns:

- Enrolment number
- Student ID
- Course
- Intake or batch
- Assigned trainer
- Start date
- Target completion date
- Completion date
- Enrolment status
- Payment or invoice reference status
- TEA status
- Required document checklist

Recommended enrolment statuses:

- Draft
- Pending Review
- Approved
- In Training
- Completed
- Cancelled
- Suspended

Status meaning:

- Draft: enrolment is being prepared.
- Pending Review: submitted but admin has not approved.
- Approved: ready to start.
- In Training: training has started.
- Completed: course requirements are completed.
- Cancelled: enrolment was cancelled before completion.
- Suspended: enrolment is paused due to operational, compliance, or payment issue.

### 3. Training Records

Training Records are evidence and progress entries under a specific enrolment.

Each record must link to:

- Student ID
- Enrolment ID
- Course/module
- Trainer
- Record type
- Record date
- Result or completion status

Examples of training record types:

- Attendance
- Theory Lesson
- Practical Flight
- Assessment
- Remedial Training
- Trainer Review
- Completion Review

Recommended record results:

- Scheduled
- Attended
- Completed
- Passed
- Failed
- Absent
- Requires Follow Up

Important rule:

Training Records should not duplicate student profile data. They should only record what happened during training.

### 4. Certificates

Certificates should be generated from completed enrolments.

Each certificate must link to:

- Student ID
- Enrolment ID
- Course
- Certificate template
- Reference number
- Issue date
- Expiry date, if applicable
- Certificate PDF Drive file
- QR code verification value

Recommended certificate statuses:

- Not Eligible
- Ready
- Generated
- Issued
- Expired
- Revoked

Certificate rules:

- A certificate cannot be generated unless the enrolment is Completed or marked Ready for Certificate.
- Certificate layout is controlled by the certificate template selected for the course.
- Admin should be able to preview before generating the final PDF.
- Generated PDFs should be stored in Google Drive and linked in Google Sheets.

### 5. Files

Files are a global document library.

Files can link to:

- Student ID
- Enrolment ID
- Training record ID
- Certificate ID

Current minimum file fields:

- fileId
- studentId
- enrolmentId
- module
- fileName
- mimeType
- driveFileId
- driveUrl
- folderId
- uploadedAt
- uploadedBy
- notes

Recommended file modules:

- Registration Form
- NRIC/Passport
- Company Letter
- Invoice PDF
- Training Agreement
- Training Record Evidence
- Certificate PDF
- Other

Important invoice rule:

Invoices are not processed inside this system. Invoice PDFs are uploaded from the finance system and attached to the student or enrolment for reference only.

### 6. TEA

The Training Enrolment Agreement belongs mainly to the enrolment workflow.

It should link to:

- Student ID
- Enrolment ID
- Course
- Agreement status
- Signed PDF file
- Signed date

Recommended TEA statuses:

- Not Required
- Pending
- Sent
- Signed
- Expired
- Cancelled

### 7. Registration Forms

Registration Forms are evidence of application submission.

They should be uploaded during:

- Add Student
- Student Detail Files tab
- Enrolment Detail Files tab, later

They should not be a separate workflow unless AGA needs a public applicant intake form later.

### 8. Reports

Reports should read from all modules and not own operational data.

Recommended reports:

- Active students
- Students by course
- Enrolments by status
- Training completion report
- Certificate issuance report
- Missing document report
- Invoice PDF attachment report
- Audit activity report

### 9. Audit History

Audit History should track important changes.

Examples:

- Student created
- Student updated
- Student archived
- File uploaded
- File deleted
- Enrolment created
- Enrolment approved
- Training record added
- Certificate generated

Audit records should include:

- timestamp
- user
- action
- entity type
- entity ID
- before value
- after value

## Recommended Page Workflow

### Student List

Purpose:

- Find student profiles quickly.
- View student status.
- Open detail, edit, or archive.

Actions:

- Add student
- View
- Edit
- Archive

Should show:

- Name
- Student number
- Contact
- Active course summary
- Student status
- Training status summary
- Uploaded file count

### Student Detail

Purpose:

- View the complete student profile and linked records.

Tabs:

- Profile
- Enrolments
- Training Records
- Files
- Certificates
- Invoice PDFs
- Audit

Important rule:

Student Detail should summarize enrolments and records. Creation of detailed training progress should happen inside Enrolment Detail later.

### Add Student

Purpose:

- Register applicant profile.
- Upload registration documents.

After submit:

- Create student.
- Upload selected files.
- Return to Students list.

Later enhancement:

- Offer "Create first enrolment" immediately after student creation.

### Training Enrolments List

Purpose:

- Manage course registrations.

Actions:

- New enrolment
- View enrolment
- Edit enrolment
- Approve enrolment
- Cancel/Suspend enrolment

Should show:

- Enrolment number
- Student
- Course
- Trainer
- Status
- Start date
- Target completion
- Required document status
- Certificate readiness

### Enrolment Detail

Purpose:

- Become the main course journey page.

Tabs:

- Overview
- Training Records
- Files
- TEA
- Invoice PDF
- Certificate
- Audit

Actions:

- Add training record
- Upload file
- Mark complete
- Generate certificate, when eligible

### Training Records List

Purpose:

- Global searchable history of training evidence.

Actions:

- View record
- Add record
- Edit record

Recommended behavior:

- Most training records should be created from Enrolment Detail.
- The global list is mainly for search, reporting, and audit visibility.

### Certificate List

Purpose:

- Manage certificate readiness, generation, issue, and verification.

Actions:

- Preview certificate
- Generate PDF
- View PDF
- Revoke certificate

Important rule:

Certificates should come from enrolments, not standalone manual entries.

## Google Sheet Relationship Model

Recommended relationships:

- Students.studentId -> TrainingEnrolments.studentId
- Students.studentId -> Files.studentId
- Students.studentId -> Certificates.studentId
- TrainingEnrolments.enrolmentId -> TrainingRecords.enrolmentId
- TrainingEnrolments.enrolmentId -> Files.enrolmentId
- TrainingEnrolments.enrolmentId -> Certificates.enrolmentId
- Certificates.certificateId -> Files.certificateId, later

## Implementation Order From Here

Recommended next build order:

1. Finalize File Manager polish.
2. Build live Training Enrolments backend.
3. Build live Training Enrolments page.
4. Add Enrolment Detail page.
5. Move course journey actions into Enrolment Detail.
6. Build live Training Records linked to enrolments.
7. Connect Certificate generation to completed enrolments.
8. Build TEA workflow under enrolments.
9. Build reports.
10. Build audit history UI.

## Immediate Next Implementation Decision

The next major module should be Training Enrolments.

Reason:

- Students and Files already work.
- Enrolments are the missing bridge between student profile, training records, certificates, TEA, and invoice PDFs.
- Fixing Enrolments next will make the whole SIS feel like a real enterprise workflow instead of separate pages.
