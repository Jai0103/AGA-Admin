# AGA SIS API Contract

This document defines the first planned REST-style API contract for the Google
Apps Script backend.

The frontend will call one deployed Google Apps Script web app URL:

```txt
VITE_APPS_SCRIPT_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

All responses should use this shape:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

Error response:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A readable error message."
  }
}
```

## Request Pattern

Google Apps Script web apps work well with query parameters for `GET` requests
and JSON payloads for `POST` requests.

Example:

```txt
GET /exec?action=listStudents
```

Example:

```txt
POST /exec?action=createStudent
```

## Student Endpoints

### List Students

```txt
GET /exec?action=listStudents
```

Response data:

```json
{
  "students": []
}
```

### Get Student

```txt
GET /exec?action=getStudent&studentId=STU-000001
```

Response data:

```json
{
  "student": {}
}
```

### Create Student

```txt
POST /exec?action=createStudent
```

Request body:

```json
{
  "firstName": "Jairus",
  "lastName": "Jin Rong",
  "email": "student@example.com",
  "phone": "+65 0000 0000",
  "nationality": "Singapore",
  "status": "Active"
}
```

Response data:

```json
{
  "student": {}
}
```

### Update Student

```txt
POST /exec?action=updateStudent
```

Request body:

```json
{
  "studentId": "STU-000001",
  "updates": {
    "phone": "+65 1111 1111",
    "status": "Active"
  }
}
```

Response data:

```json
{
  "student": {}
}
```

## Dashboard Endpoints

### Get Dashboard Summary

```txt
GET /exec?action=getDashboardSummary
```

Response data:

```json
{
  "stats": [],
  "activityTrend": [],
  "courseMix": [],
  "recentRecords": [],
  "complianceItems": []
}
```

## File Endpoints

### List Files

```txt
GET /exec?action=listFiles&studentId=STU-000001
```

Response data:

```json
{
  "files": []
}
```

### Upload File

```txt
POST /exec?action=uploadFile
```

Request body:

```json
{
  "studentId": "STU-000001",
  "enrolmentId": "ENR-000001",
  "module": "Certificates",
  "fileName": "certificate.pdf",
  "mimeType": "application/pdf",
  "base64": "BASE64_FILE_CONTENT"
}
```

Response data:

```json
{
  "file": {
    "driveFileId": "",
    "driveUrl": ""
  }
}
```

## Certificate Endpoints

### Generate Certificate

```txt
POST /exec?action=generateCertificate
```

Request body:

```json
{
  "studentId": "STU-000001",
  "enrolmentId": "ENR-000001",
  "certificateType": "UATO Completion"
}
```

Response data:

```json
{
  "certificate": {}
}
```

## Audit Rule

Every create, update, upload, and generate action should write a row into:

```txt
AuditHistory
```

The audit record should include:

```txt
timestamp
userId
userEmail
action
module
recordId
beforeJson
afterJson
```
