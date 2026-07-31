# AGA SIS Google Sheets Database Schema

This document defines the first planned Google Sheets database structure for
Apollo Global Academy's Student Information System.

Each section below represents one sheet tab inside the main AGA SIS spreadsheet.

## 1. Students

Sheet name:

```txt
Students
```

Columns:

```txt
studentId
studentNumber
firstName
lastName
preferredName
email
phone
nationality
dateOfBirth
idNumber
address
emergencyContactName
emergencyContactPhone
status
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Stores the main student profile.

## 2. TrainingEnrolments

Sheet name:

```txt
TrainingEnrolments
```

Columns:

```txt
enrolmentId
studentId
courseCode
courseName
trainingStatus
startDate
targetCompletionDate
completionDate
trainerId
teaStatus
registrationFormStatus
certificateStatus
paymentStatus
invoiceId
notes
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Tracks student enrolment into a course or training program.

## 3. TrainingRecords

Sheet name:

```txt
TrainingRecords
```

Columns:

```txt
recordId
studentId
enrolmentId
recordType
recordDate
moduleName
score
result
trainerId
remarks
pdfFileId
pdfUrl
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Stores lesson, assessment, completion, and supporting training records.

## 4. FlightLogs

Sheet name:

```txt
FlightLogs
```

Columns:

```txt
flightLogId
studentId
enrolmentId
flightDate
aircraftOrSimulator
location
durationMinutes
trainerId
trainingExercise
remarks
pdfFileId
pdfUrl
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Stores flight or simulator log entries.

## 5. Certificates

Sheet name:

```txt
Certificates
```

Columns:

```txt
certificateId
studentId
enrolmentId
certificateNumber
certificateType
issueDate
expiryDate
status
templateId
generatedPdfFileId
generatedPdfUrl
qrCodeValue
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Tracks generated certificates and QR validation data.

## 6. Invoices

Sheet name:

```txt
Invoices
```

Columns:

```txt
invoiceId
studentId
enrolmentId
invoiceNumber
invoiceDate
dueDate
currency
subtotal
tax
total
amountPaid
balance
paymentStatus
pdfFileId
pdfUrl
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Tracks billing and payment status.

## 7. Files

Sheet name:

```txt
Files
```

Columns:

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

Purpose:

Stores metadata for PDFs and uploaded files saved in Google Drive.

## 8. Trainers

Sheet name:

```txt
Trainers
```

Columns:

```txt
trainerId
firstName
lastName
email
phone
role
status
licenseNumber
licenseExpiryDate
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Stores trainer profiles and license validity.

## 9. Users

Sheet name:

```txt
Users
```

Columns:

```txt
userId
displayName
email
role
status
lastLoginAt
createdAt
updatedAt
createdBy
updatedBy
```

Purpose:

Stores application user accounts and roles.

## 10. AuditHistory

Sheet name:

```txt
AuditHistory
```

Columns:

```txt
auditId
timestamp
userId
userEmail
action
module
recordId
beforeJson
afterJson
ipAddress
userAgent
```

Purpose:

Tracks important changes for accountability and audit review.
