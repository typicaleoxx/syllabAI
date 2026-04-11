"use client";

import { useEffect, useRef, useState } from "react";
import { uploadSyllabus, parseSyllabusText } from "@/lib/api";
import { Course, Assignment } from "@/types";
import { downloadICS } from "@/lib/ics";
import { Tone, TONE_OPTIONS } from "@/lib/tone";
import Loader from "./components/Loader";
import Dropzone from "./components/Dropzone";
import ContactCards from "./components/ContactCards";
import StatusCard from "./components/StatusCard";
import TodayFocus from "./components/TodayFocus";
import WeeklyPlan from "./components/WeeklyPlan";
import WhatsComing from "./components/WhatsComing";
import RiskPanel from "./components/RiskPanel";
import Chat from "./components/Chat";
import {
  clearCalendarTasks,
  clearCourses,
  loadCourses,
  saveCourses,
} from "@/lib/storage";

function assignmentKey(a: Assignment) {
  return `${a.name}|${a.due}`;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tone, setTone] = useState<Tone>("genz");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const addInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCourses(loadCourses());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveCourses(courses);
  }, [courses, hydrated]);

  function toggleComplete(key: string) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadSyllabus(file);
      setCourses((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          fileName: file.name,
          assignments: result.assignments,
          contacts: result.contacts ?? [],
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleText(text: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await parseSyllabusText(text);
      setCourses((prev) => [
        ...prev,
        {
          id: `${Date.now()}`,
          fileName: "Pasted syllabus",
          assignments: result.assignments,
          contacts: result.contacts ?? [],
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function removeCourse(id: string) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function resetAllData() {
    clearCourses();
    clearCalendarTasks();
    setCourses([]);
    setCompleted(new Set());
    setError(null);
  }

  const allAssignments: Assignment[] = courses.flatMap((c) => c.assignments);
  const allContacts = courses.flatMap((c) => c.contacts);
  const hasCourses = courses.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div>
          <h1 className="text-base font-bold text-gray-800">SyllabAI</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {hasCourses
              ? `${courses.length} course${courses.length > 1 ? "s" : ""} loaded`
              : "Your academic coach"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tone selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {TONE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setTone(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tone === opt.value
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>

          {hasCourses && (
            <>
              {/* Course chips */}
              <div className="flex items-center gap-2">
                {courses.map((c) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-1.5 text-xs bg-indigo-50 text-indigo-600 font-medium px-2.5 py-1 rounded-full">
                    {c.fileName.replace(".pdf", "")}
                    <button
                      type="button"
                      onClick={() => removeCourse(c.id)}
                      className="text-indigo-300 hover:text-indigo-600 transition-colors leading-none">
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Export calendar */}
              <button
                type="button"
                onClick={() => downloadICS(allAssignments)}
                className="text-xs text-gray-600 hover:text-gray-800 font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export .ics
              </button>

              {/* Add another */}
              <button
                type="button"
                onClick={() => addInputRef.current?.click()}
                className="text-xs text-indigo-600 hover:text-indigo-500 font-medium border border-indigo-200 rounded-lg px-3 py-1.5 hover:bg-indigo-50 transition-colors">
                + Add syllabus
              </button>
              <button
                type="button"
                onClick={resetAllData}
                className="text-xs text-red-600 hover:text-red-500 font-medium border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-50 transition-colors">
                Reset all
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
            </>
          )}
        </div>
      </header>

      {/* Body with Chat Sidebar */}
      <div className="flex-1 overflow-hidden flex bg-gray-50/50">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {loading && <Loader tone={tone} />}

          {!loading && !hasCourses && (
            <>
              <Dropzone
                onFile={handleFile}
                onText={handleText}
                loading={loading}
              />
              {error && (
                <p className="text-center text-sm text-red-500 -mt-4 pb-4">
                  {error}
                </p>
              )}
            </>
          )}

          {!loading && hasCourses && (
            <div className="p-8 space-y-5 max-w-4xl">
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Status */}
              <StatusCard assignments={allAssignments} tone={tone} />

              {/* Today + What's Coming */}
              <div className="grid grid-cols-2 gap-5">
                <TodayFocus
                  assignments={allAssignments}
                  tone={tone}
                  completed={completed}
                  onToggle={toggleComplete}
                  assignmentKey={assignmentKey}
                />
                <WhatsComing assignments={allAssignments} tone={tone} />
              </div>

              {/* Weekly Game Plan + Risk Breakdown */}
              <div className="flex gap-5 items-start">
                <div className="flex-1">
                  <WeeklyPlan
                    assignments={allAssignments}
                    tone={tone}
                    completed={completed}
                    assignmentKey={assignmentKey}
                  />
                </div>
                <RiskPanel assignments={allAssignments} />
              </div>

              {/* Contact cards */}
              <ContactCards contacts={allContacts} />
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        {hasCourses && (
          <div className="w-80 border-l border-gray-100 bg-white overflow-hidden flex flex-col">
            <Chat tone={tone} />
          </div>
        )}
      </div>
    </div>
  );
}
