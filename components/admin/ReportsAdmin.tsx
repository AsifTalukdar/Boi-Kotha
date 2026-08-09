"use client";

import { useState, useTransition } from "react";
import { resolveReport, dismissReport } from "@/lib/actions/admin";
import type { AdminReport } from "@/lib/supabase/admin_queries";

export function ReportsAdmin({ initialReports }: { initialReports: AdminReport[] }) {
  const [reports, setReports] = useState<AdminReport[]>(initialReports);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (id: string, action: "resolve" | "dismiss") => {
    startTransition(async () => {
      const res = action === "resolve" ? await resolveReport(id) : await dismissReport(id);
      if (!res.error) {
        setReports((current) =>
          current.map((r) =>
            r.id === id
              ? { ...r, status: action === "resolve" ? "resolved" : "dismissed" }
              : r
          )
        );
      }
    });
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-8">
      <div className="mb-7">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#c87845]">
          সেফটি
        </p>
        <h1 className="serif mt-2 text-3xl font-bold">রিপোর্টস</h1>
        <p className="mt-2 text-sm text-[#7d857e]">
          ব্যবহারকারীর পাঠানো কনটেন্ট রিপোর্টগুলো পর্যালোচনা করুন।
        </p>
      </div>
      <div className="space-y-3">
        {reports.map((report) => (
          <article
            key={report.id}
            className="rounded-2xl border border-[#dedfd9] bg-white p-5"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      report.status === "pending"
                        ? "bg-[#fff0da] text-[#a66a2d]"
                        : report.status === "resolved"
                          ? "bg-[#e5eee1] text-[#52704d]"
                          : "bg-[#f0eeea] text-[#737773]"
                    }`}
                  >
                    {report.status === "pending"
                      ? "অপেক্ষমাণ"
                      : report.status === "resolved"
                        ? "সমাধান"
                        : "বাতিল"}
                  </span>
                  <span className="text-xs text-[#858985]">
                    {new Date(report.created_at).toLocaleDateString("bn-BD")}
                  </span>
                </div>
                <h2 className="mt-3 font-bold">{report.recording_title}</h2>
                <p className="mt-1 text-sm text-[#6f746f]">
                  কারণ: {report.reason}
                </p>
                <p className="mt-2 text-xs text-[#90948f]">
                  রিপোর্ট করেছেন: {report.reporter_name}
                </p>
              </div>
              {report.status === "pending" && (
                <div className="flex h-fit gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(report.id, "resolve")}
                    disabled={isPending}
                    className="rounded-lg bg-[#303b36] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    সমাধান
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdate(report.id, "dismiss")}
                    disabled={isPending}
                    className="rounded-lg border border-[#dedfd9] px-3 py-2 text-xs font-bold disabled:opacity-50"
                  >
                    বাতিল
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
        {reports.length === 0 && (
          <p className="p-8 text-center text-sm text-[#7d857e]">
            কোনো সেফটি রিপোর্ট নেই।
          </p>
        )}
      </div>
    </div>
  );
}
