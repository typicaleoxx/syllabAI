"use client";

import { useEffect, useState } from "react";
import { Course } from "@/types";
import { loadCourses } from "@/lib/storage";
import ContactCards from "../components/ContactCards";
import AlertBanner from "../components/AlertBanner";

export default function SyllabiPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    setCourses(loadCourses());
  }, []);

  const assignments = courses.flatMap((course) => course.assignments);
  const contacts = courses.flatMap((course) => course.contacts);

  return (
    <main className="p-8 space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Syllabi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Uploaded syllabi are saved here so you can review every course in one
          place.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-500">
          Upload a syllabus on the dashboard first. This page will show your
          saved courses after that.
        </div>
      ) : (
        <>
          <AlertBanner assignments={assignments} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {course.fileName}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {course.assignments.length} deadlines,{" "}
                      {course.contacts.length} contacts
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600">
                    Saved
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-gray-600">
                  {course.assignments.slice(0, 5).map((assignment) => (
                    <li
                      key={`${course.id}-${assignment.name}-${assignment.due}`}
                      className="flex items-center justify-between gap-3">
                      <span className="truncate">{assignment.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">
                        {assignment.due}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ContactCards contacts={contacts} />
        </>
      )}
    </main>
  );
}
