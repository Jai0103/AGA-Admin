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

export const router = createHashRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: "dashboard",
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        )
      },
      ...navigationItems
        .filter((item) => item.href !== "/dashboard")
        .map((item) => ({
          path: item.href.replace("/", ""),
          element: <PlaceholderPage title={item.label} />
        }))
    ]
  }
]);
