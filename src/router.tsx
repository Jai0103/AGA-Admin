import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createHashRouter, Navigate } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { PlaceholderPage } from "./features/shared/PlaceholderPage";
import { navigationItems } from "./lib/navigation";

const DashboardPage = lazy(() =>
  import("./features/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage
  }))
);

const StudentsPage = lazy(() =>
  import("./features/students/StudentsPage").then((module) => ({
    default: module.StudentsPage
  }))
);

const TrainingEnrolmentsPage = lazy(() =>
  import("./features/training-enrolments/TrainingEnrolmentsPage").then(
    (module) => ({
      default: module.TrainingEnrolmentsPage
    })
  )
);

const TrainingRecordsPage = lazy(() =>
  import("./features/training-records/TrainingRecordsPage").then((module) => ({
    default: module.TrainingRecordsPage
  }))
);

const CertificatesPage = lazy(() =>
  import("./features/certificates/CertificatesPage").then((module) => ({
    default: module.CertificatesPage
  }))
);

function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-white/70 bg-white/86 p-8 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
          <div className="h-4 w-40 rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="mt-5 h-8 w-72 max-w-full rounded-full bg-slate-200 dark:bg-white/10" />
          <div className="mt-4 h-4 w-full max-w-xl rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

const implementedRoutes = [
  {
    path: "dashboard",
    element: (
      <LazyPage>
        <DashboardPage />
      </LazyPage>
    )
  },
  {
    path: "students",
    element: (
      <LazyPage>
        <StudentsPage />
      </LazyPage>
    )
  },
  {
    path: "training-enrolments",
    element: (
      <LazyPage>
        <TrainingEnrolmentsPage />
      </LazyPage>
    )
  },
  {
    path: "training-records",
    element: (
      <LazyPage>
        <TrainingRecordsPage />
      </LazyPage>
    )
  },
  {
    path: "certificates",
    element: (
      <LazyPage>
        <CertificatesPage />
      </LazyPage>
    )
  }
];

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      ...implementedRoutes,
      ...navigationItems
        .filter(
          (item) =>
            !implementedRoutes.some(
              (route) => route.path === item.href.replace("/", "")
            )
        )
        .map((item) => ({
          path: item.href.replace("/", ""),
          element: <PlaceholderPage title={item.label} />
        }))
    ]
  }
]);
