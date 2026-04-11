"use client";

import { useEffect, useMemo, useState } from "react";
import { Course, Assignment } from "@/types";
import { loadCourses } from "@/lib/storage";
import { downloadICS } from "@/lib/ics";
import NextSevenDays from "../components/NextSevenDays";

export default function CalendarPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(loadCourses());
  }, []);

  const assignments: Assignment[] = useMemo(
    () => courses.flatMap((course) => course.assignments),
    [courses],
  );

  return (
    <main className="p-8 space-y-6 max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your deadlines and the next seven days, all in one place.
          </p>
        </div>

        {assignments.length > 0 && (
          <button
            type="button"
            onClick={() => downloadICS(assignments)}
            className="text-xs text-gray-600 hover:text-gray-800 font-medium border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
            Export .ics
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
          Upload a syllabus on the dashboard first. Then this page will show
          your deadline calendar.
        </div>
      ) : (
        <NextSevenDays assignments={assignments} />
      )}
    </main>
  );
}
