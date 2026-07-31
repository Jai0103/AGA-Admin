# AGA SIS Google Drive Folder Structure

This document defines the planned Google Drive folder structure for Apollo
Global Academy's Student Information System.

Create one top-level folder in Google Drive:

```txt
AGA SIS
```

Inside it, create these folders:

```txt
AGA SIS/
├─ 01 Students/
├─ 02 Training Enrolments/
├─ 03 Training Records/
├─ 04 Flight Logs/
├─ 05 Certificates/
├─ 06 Invoices/
├─ 07 TEA/
├─ 08 Registration Forms/
├─ 09 Templates/
├─ 10 Reports/
└─ 99 Archive/
```

## 1. Students

Folder:

```txt
AGA SIS/01 Students/
```

Purpose:

Stores student-specific folders.

Recommended student folder naming:

```txt
STU-000001 - FirstName LastName
```

Example:

```txt
STU-000128 - Jairus Jin Rong
```

Inside each student folder:

```txt
Profile/
Training Records/
Flight Logs/
Certificates/
Invoices/
TEA/
Registration Forms/
Other Documents/
```

## 2. Training Enrolments

Folder:

```txt
AGA SIS/02 Training Enrolments/
```

Purpose:

Stores enrolment-level documents that are not yet organized by student folder.

## 3. Training Records

Folder:

```txt
AGA SIS/03 Training Records/
```

Purpose:

Stores training record PDF uploads and exported reports.

## 4. Flight Logs

Folder:

```txt
AGA SIS/04 Flight Logs/
```

Purpose:

Stores flight log PDFs and supporting flight documentation.

## 5. Certificates

Folder:

```txt
AGA SIS/05 Certificates/
```

Purpose:

Stores generated certificate PDFs.

Recommended certificate file naming:

```txt
CERTIFICATE-NUMBER - Student Name - Course Code.pdf
```

Example:

```txt
CERT-2026-00034 - Jairus Jin Rong - UATO.pdf
```

## 6. Invoices

Folder:

```txt
AGA SIS/06 Invoices/
```

Purpose:

Stores invoice PDFs.

Recommended invoice file naming:

```txt
INV-YYYY-00001 - Student Name.pdf
```

Example:

```txt
INV-2026-00018 - Amelia Tan.pdf
```

## 7. TEA

Folder:

```txt
AGA SIS/07 TEA/
```

Purpose:

Stores Training Enrolment Agreement PDFs.

## 8. Registration Forms

Folder:

```txt
AGA SIS/08 Registration Forms/
```

Purpose:

Stores registration form PDFs.

## 9. Templates

Folder:

```txt
AGA SIS/09 Templates/
```

Purpose:

Stores reusable templates for:

- Certificates
- Invoices
- TEA
- Registration forms
- Reports

## 10. Reports

Folder:

```txt
AGA SIS/10 Reports/
```

Purpose:

Stores generated management, compliance, finance, and audit reports.

## 11. Archive

Folder:

```txt
AGA SIS/99 Archive/
```

Purpose:

Stores inactive, superseded, or migrated documents.

## Data To Save In Google Sheets

Every uploaded or generated file should save these values into the `Files`
sheet:

```txt
fileId
studentId
enrolmentId
module
fileName
mimeType
driveFileId
driveUrl
folderId
uploadedAt
uploadedBy
notes
```
