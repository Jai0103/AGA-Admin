import { CheckCircle2, Loader2, ServerCrash, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

import { apiGet } from "../../services/api/client";

type HealthResponse = {
  status: string;
  apiVersion: string;
  timestamp: string;
};

type StatusState =
  | { type: "loading" }
  | { type: "online"; data: HealthResponse }
  | { type: "error"; message: string };

export function BackendStatusCard() {
  const [status, setStatus] = useState<StatusState>({ type: "loading" });

  useEffect(() => {
    let mounted = true;

    apiGet<HealthResponse>("health")
      .then((data) => {
        if (mounted) {
          setStatus({ type: "online", data });
        }
      })
      .catch((error: Error) => {
        if (mounted) {
          setStatus({ type: "error", message: error.message });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <article className="rounded-3xl border border-white/70 bg-white/86 p-5 shadow-panel backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-sky/10 text-brand-blue">
          {status.type === "loading" ? (
            <Loader2 size={22} className="animate-spin" />
          ) : status.type === "online" ? (
            <CheckCircle2 size={22} />
          ) : (
            <ServerCrash size={22} />
          )}
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-brand-blue">
            Backend Status
          </p>
          <h3 className="mt-2 text-xl font-black">
            {status.type === "loading" && "Checking Apps Script API"}
            {status.type === "online" && "Apps Script API Online"}
            {status.type === "error" && "Apps Script API Error"}
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {status.type === "loading" && "Connecting to the deployed API..."}
            {status.type === "online" &&
              `Version ${status.data.apiVersion} responded at ${status.data.timestamp}`}
            {status.type === "error" && status.message}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
            <Wifi size={14} />
            Google Apps Script
          </div>
        </div>
      </div>
    </article>
  );
}
