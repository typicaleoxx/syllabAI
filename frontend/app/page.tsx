"use client";

import { useState, useRef } from "react";
import { uploadSyllabus } from "@/lib/api";
import { Course, Assignment } from "@/types";
import Timeline from "./components/Timeline";
import RiskPanel from "./components/RiskPanel";
import Loader from "./components/Loader";
import Dropzone from "./components/Dropzone";
import NextSevenDays from "./components/NextSevenDays";
import AlertBanner from "./components/AlertBanner";
import ContactCards from "./components/ContactCards";

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);

    try {
      const result = await uploadSyllabus(file);
      const newCourse: Course = {
        id: `${Date.now()}`,
        fileName: file.name,
        assignments: result.assignments,
        contacts: result.contacts ?? [],
      };
      setCourses((prev) => [...prev, newCourse]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  // Merge all assignments and contacts from all courses
  const allAssignments: Assignment[] = courses.flatMap((c) => c.assignments);
  const allContacts = courses.flatMap((c) => c.contacts);

  const today = new Date().setHours(0, 0, 0, 0);
  const highCount = allAssignments.filter((a) => a.risk === "HIGH").length;
  const nextDue = allAssignments
    .map((a) => { const [y, m, d] = a.due.split("-").map(Number); return new Date(y, m - 1, d).getTime(); })
    .filter((t) => t >= today)
    .sort((a, b) => a - b)[0];
  const daysToNext = nextDue
    ? Math.ceil((nextDue - today) / 86400000)
    : null;

  const hasCourses = courses.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-base font-bold text-gray-800">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {hasCourses ? `${courses.length} course${courses.length > 1 ? "s" : ""} loaded` : "No syllabi loaded"}
          </p>
        </div>

        {hasCourses && (
          <div className="flex items-center gap-3">
            {/* Course chips */}
            <div className="flex items-center gap-2">
              {courses.map((c) => (
                <span
                  key={c.id}
                  className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-600 font-medium px-2.5 py-1 rounded-full"
                >
                  {c.fileName.replace(".pdf", "")}
                  <button
                    type="button"
                    onClick={() => removeCourse(c.id)}
                    className="text-indigo-300 hover:text-indigo-600 transition-colors leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add another */}
            <button
              type="button"
              onClick={() => addInputRef.current?.click()}
              className="text-xs text-indigo-600 hover:text-indigo-500 font-medium border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors"
            >
              + Add syllabus
            </button>
            <input
              ref={addInputRef}
              type="file"
              accept=".pdf"
              aria-label="Add another syllabus PDF"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
        )}
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {loading && <Loader />}

        {!loading && !hasCourses && (
          <>
            <Dropzone onFile={handleFile} loading={loading} />
            {error && <p className="text-center text-sm text-red-500 -mt-4 pb-4">{error}</p>}
          </>
        )}

        {!loading && hasCourses && (
          <>
            <AlertBanner assignments={allAssignments} />
          <div className="p-8 space-y-5">
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                label="Total deadlines"
                value={allAssignments.length}
                sub={`Across ${courses.length} course${courses.length > 1 ? "s" : ""}`}
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

            {/* Next 7 Days */}
            <NextSevenDays assignments={allAssignments} />

            {/* Timeline + Risk panel */}
            <div className="flex gap-4">
              <Timeline assignments={allAssignments} />
              <RiskPanel assignments={allAssignments} />
            </div>

            {/* Contact cards */}
            <ContactCards contacts={allContacts} />
          </div>
          </>
        )}
      </div>
    </div>
  );
}
