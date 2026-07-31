import {
  BarChart3,
  BookOpenCheck,
  ClipboardList,
  FileArchive,
  FileClock,
  FilePenLine,
  FileText,
  GraduationCap,
  History,
  LayoutDashboard,
  Plane,
  ReceiptText,
  Settings,
  ShieldCheck,
  UserCog,
  UsersRound
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/students", icon: GraduationCap },
  {
    label: "Training Enrolments",
    href: "/training-enrolments",
    icon: BookOpenCheck
  },
  {
    label: "Training Records",
    href: "/training-records",
    icon: ClipboardList
  },
  { label: "Flight Logs", href: "/flight-logs", icon: Plane },
  { label: "Certificates", href: "/certificates", icon: ShieldCheck },
  { label: "Invoices", href: "/invoices", icon: ReceiptText },
  { label: "TEA", href: "/training-enrolment-agreement", icon: FilePenLine },
  { label: "Registration Forms", href: "/registration-forms", icon: FileText },
  { label: "File Manager", href: "/file-manager", icon: FileArchive },
  { label: "Trainers", href: "/trainers", icon: UsersRound },
  { label: "Users", href: "/users", icon: UserCog },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Audit History", href: "/audit-history", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Document Queue", href: "/document-queue", icon: FileClock }
] as const;
