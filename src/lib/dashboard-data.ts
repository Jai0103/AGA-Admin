export const dashboardStats = [
  {
    label: "Active Students",
    value: "128",
    detail: "Across 9 current courses",
    tone: "blue"
  },
  {
    label: "Pending Enrolments",
    value: "18",
    detail: "Awaiting review or signature",
    tone: "amber"
  },
  {
    label: "Certificates Ready",
    value: "34",
    detail: "Eligible for template generation",
    tone: "emerald"
  },
  {
    label: "Invoices Due",
    value: "$42.8k",
    detail: "Due within the next 30 days",
    tone: "rose"
  },
  {
    label: "Uploaded PDFs",
    value: "612",
    detail: "Stored in Google Drive folders",
    tone: "violet"
  },
  {
    label: "Flight Hours",
    value: "1,286h",
    detail: "Logged this training year",
    tone: "cyan"
  }
] as const;

export const activityTrend = [
  { month: "Feb", enrolments: 16, completions: 9, invoices: 21 },
  { month: "Mar", enrolments: 22, completions: 13, invoices: 25 },
  { month: "Apr", enrolments: 18, completions: 16, invoices: 19 },
  { month: "May", enrolments: 27, completions: 18, invoices: 31 },
  { month: "Jun", enrolments: 31, completions: 24, invoices: 36 },
  { month: "Jul", enrolments: 36, completions: 29, invoices: 42 }
];

export const courseMix = [
  { name: "UATO", value: 42 },
  { name: "CAAS", value: 28 },
  { name: "Simulator", value: 19 },
  { name: "Refresher", value: 11 }
];

export const recentRecords = [
  {
    student: "Jairus Jin Rong",
    course: "UATO Remote Pilot Course",
    status: "Ready for certificate",
    updatedAt: "Today, 4:12 PM"
  },
  {
    student: "Amelia Tan",
    course: "CAAS Practical Assessment",
    status: "Invoice pending",
    updatedAt: "Today, 2:45 PM"
  },
  {
    student: "Marcus Lee",
    course: "Flight Instructor Check",
    status: "PDF uploaded",
    updatedAt: "Yesterday, 6:20 PM"
  }
];

export const complianceItems = [
  { label: "Student records with complete IDs", value: 94 },
  { label: "Certificates inside active validity period", value: 88 },
  { label: "Invoices matched to enrolments", value: 81 }
];
