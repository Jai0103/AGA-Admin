# AGA SIS Workflow

This document defines the intended workflow for Apollo Global Academy's Student
Information System.

The system should not behave like separate duplicated lists. The main workflow
should follow the student lifecycle from profile creation to course completion
and certificate generation.

## Core Workflow

```txt
Student Profile
  -> Training Enrolment
    -> Training Records
      -> Completion Review
        -> Certificate Generation
          -> PDF Storage
            -> Audit History
```

## 1. Student Profile

The student profile is the main master record.

The Students module should be the primary place to manage:

```txt
Personal details
Contact details
Status
Course history
Training status
Certificate status
Uploaded PDFs
Invoice PDFs from finance
QR code identity
Audit history
```

Recommended student profile tabs:

```txt
Profile
Enrolments
Training Records
Files
Certificates
Invoice PDFs
Audit
```

## 2. Training Enrolment

Training Enrolments should not duplicate the Students page.

This module should work as an operational enrolment queue for admin.

Primary purpose:

```txt
Track whether a student is ready to start or continue a course.
```

Main workflow states:

```txt
Draft
Pending Review
Approved
In Training
Completed
Cancelled
```

Admin checks:

```txt
Student profile exists
Course selected
Trainer assigned
Start date confirmed
Target completion date confirmed
TEA uploaded or signed
Registration form uploaded and verified
Finance invoice PDF uploaded if available
Supporting PDFs uploaded
```

The Training Enrolments page should focus on:

```txt
Pending review queue
Missing TEA
Missing registration form
Missing invoice PDF
Ready to start training
In training
Completed enrolments
```

## 3. Training Records

Training Records should not duplicate Students or Enrolments.

This module should work as the training progress and compliance record.

Primary purpose:

```txt
Record what happened during the course.
```

Training record types:

```txt
Theory Lesson
Practical Lesson
Assessment
Remedial
Completion
```

Each training record should track:

```txt
Student
Enrolment
Course
Module
Trainer
Record date
Duration
Score if applicable
Result
Trainer remarks
Supporting PDF
```

The Training Records page should focus on:

```txt
Course progress
Assessment results
Missing training evidence
Trainer remarks
Completion evidence
PDF attachments
```

## 4. Completion Review

Before a certificate is generated, admin should confirm:

```txt
Student profile is complete
Training enrolment is completed
Required training records exist
Required assessments are passed
Required PDFs are uploaded
TEA is signed or uploaded
Registration form is verified
Certificate template exists for the course
```

Only after these checks should a certificate become:

```txt
Ready
```

## 5. Certificate Generation

Certificates depend on the course enrolled by the student.

The Certificates module should manage:

```txt
Certificate templates by course
Certificate reference numbers
Student name
Course name
Issue date
Expiry date if applicable
Signatory
QR code value
Generated PDF link
Certificate status
```

Certificate statuses:

```txt
Draft
Ready
Generated
Issued
Expired
Revoked
```

Certificate generation workflow:

```txt
Admin selects completed enrolment
System selects matching course template
Admin previews certificate
System generates PDF
System saves PDF to Google Drive
System saves PDF link to Google Sheets
System writes audit history
```

## 6. File Manager

The File Manager is a central PDF library.

It should not replace the student profile. It should help admin find and manage
all documents across the system.

File categories:

```txt
Student Profile
Training Enrolment
Training Record
Certificate
Invoice PDF
TEA
Registration Form
Other
```

Important invoice rule:

```txt
Invoices are created and processed in the finance system.
AGA Admin only stores uploaded invoice PDFs and their Google Drive links.
```

## 7. Audit History

Every important action should write an audit entry:

```txt
Create student
Update student
Create enrolment
Update enrolment
Upload PDF
Replace PDF
Archive PDF
Create training record
Update training record
Generate certificate
Issue certificate
Revoke certificate
```

Audit records should include:

```txt
Timestamp
User
Action
Module
Record ID
Before value
After value
```

## Recommended UI Refactor

The current frontend pages are useful as early screens, but the long-term UI
should be adjusted:

## Students Module

Should become the main student master module with a detail page:

```txt
/students
/students/:studentId
```

The detail page should contain tabs:

```txt
Profile
Enrolments
Training Records
Files
Certificates
Invoice PDFs
Audit
```

## Training Enrolments Module

Should become an operational queue:

```txt
Pending Review
Missing Documents
Ready To Start
In Training
Completed
```

## Training Records Module

Should become a progress and evidence module:

```txt
Lessons
Assessments
Completion Evidence
Missing PDFs
Trainer Remarks
```

## Certificates Module

Should become a certificate generation and template management module:

```txt
Templates
Ready To Generate
Generated
Issued
Revoked
```
