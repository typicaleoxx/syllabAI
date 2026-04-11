"use client";

import { useState } from "react";
import { uploadSyllabus } from "@/lib/api";
import { UploadResponse } from "@/types";
import Dropzone from "./components/Dropzone";
import Timeline from "./components/Timeline";
import RiskPanel from "./components/RiskPanel";
import Loader from "./components/Loader";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  async function handleFile(file: File) {
    setFileName(file.name);
    setLoading(true);
    setError(null);

    try {
      const result = await uploadSyllabus(file);
      console.log("SyllabAI response:", result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  // Derived stats
  const highCount = data?.assignments.filter((a) => a.risk === "HIGH").length ?? 0;
  const nextDue = data?.assignments
    .map((a) => new Date(a.due).getTime())
    .sort((a, b) => a - b)[0];
  const daysToNext = nextDue
    ? Math.ceil((nextDue - new Date().setHours(0, 0, 0, 0)) / 86400000)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-base font-bold text-gray-800">Dashboard</h1>
          {fileName && <p className="text-xs text-gray-400 mt-0.5">{fileName}</p>}
        </div>

        {data && (
          <button
            type="button"
            onClick={() => { setData(null); setFileName(""); setError(null); }}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-medium border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
          >
            + Upload new syllabus
          </button>
        )}
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading */}
        {loading && <Loader />}

        {/* Upload state */}
        {!loading && !data && (
          <>
            <Dropzone onFile={handleFile} loading={loading} />
            {error && (
              <p className="text-center text-sm text-red-500 -mt-4 pb-4">{error}</p>
            )}
          </>
        )}

        {/* Dashboard state */}
        {!loading && data && (
          <div className="p-8 space-y-5">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Total deadlines"
                value={data.assignments.length}
                sub="Extracted from syllabus"
              />
              <StatCard
                label="High risk"
                value={highCount}
                sub={highCount > 0 ? "Needs immediate attention" : "You're on track"}
              />
              <StatCard
                label="Next due in"
                value={daysToNext !== null ? `${daysToNext}d` : "—"}
                sub={daysToNext !== null && daysToNext <= 0 ? "Overdue!" : "Keep an eye on this"}
              />
            </div>

            {/* Timeline + Risk panel */}
            <div className="flex gap-4">
              <Timeline assignments={data.assignments} />
              <RiskPanel assignments={data.assignments} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
