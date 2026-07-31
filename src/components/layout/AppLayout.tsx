import { Menu, Moon, PanelLeftClose, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { clsx } from "clsx";

import { navigationItems } from "../../lib/navigation";

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,199,169,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,107,95,0.15),transparent_30%)]" />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/50 bg-white/82 shadow-panel backdrop-blur-xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-900/86 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-24 items-center gap-3 border-b border-slate-200 px-5 dark:border-white/10">
          <div className="flex h-14 w-32 items-center">
            <img
              src="/AGA-Admin/aga-logo-horizontal.png"
              alt="Apollo Global Academy"
              className="max-h-14 w-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-black leading-tight text-brand-navy dark:text-white">
              Student Information System
            </h1>
          </div>
          <button
            type="button"
            className="ml-auto rounded-xl border border-slate-200 p-2 text-slate-500 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <div className="mx-5 mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-sm font-semibold">Jairus Orolaza</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            System Administrator
          </p>
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-4 pb-5">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  isActive
                    ? "bg-brand-navy text-white shadow-glow"
                    : "text-slate-600 hover:bg-white hover:text-brand-blue dark:text-slate-300 dark:hover:bg-white/10"
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation overlay"
          type="button"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-white/76 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white/72 px-4 py-2 shadow-sm dark:border-white/10 dark:bg-white/5 sm:flex">
              <Search size={18} className="text-slate-400" />
              <input
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search students, invoices, certificates, PDFs..."
              />
            </div>

            <button
              type="button"
              onClick={() => setDarkMode((value) => !value)}
              className="ml-auto rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:text-brand-blue dark:border-white/10 dark:bg-white/5 dark:text-white"
              aria-label="Toggle color mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
