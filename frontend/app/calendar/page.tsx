"use client";

import { useEffect, useMemo, useState } from "react";
import { Assignment, CalendarTask, Course } from "@/types";
import { addCalendarTask, loadCalendarTasks, loadCourses } from "@/lib/storage";
import { downloadICS } from "@/lib/ics";

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil(
    (parseLocalDate(dateStr).getTime() - today.getTime()) / 86400000,
  );
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getStartTime(daysLeft: number, weight?: number | null): string {
  if (daysLeft <= 1 || (weight ?? 0) >= 30) return "6:00 PM";
  if (daysLeft <= 3 || (weight ?? 0) >= 15) return "7:00 PM";
  return "8:00 PM";
}

function getStudyTaskPlan(assignments: Assignment[]): CalendarTask[] {
  return assignments
    .filter((assignment) => daysUntil(assignment.due) >= 0)
    .map((assignment) => {
      const daysLeft = daysUntil(assignment.due);
      const date = new Date(parseLocalDate(assignment.due));
      const offset = daysLeft <= 1 ? 0 : daysLeft <= 3 ? 2 : 4;
      date.setDate(date.getDate() - offset);

      return {
        id: `plan-${assignment.name}-${assignment.due}`,
        title: `Work on ${assignment.name}`,
        date: date.toISOString().slice(0, 10),
        time: getStartTime(daysLeft, assignment.weight),
        notes:
          assignment.course && assignment.weight != null
            ? `${assignment.course} · ${assignment.weight}% of grade`
            : (assignment.course ?? "Auto-generated study block"),
        source: "assignment" as const,
      };
    });
}

function groupByDate(tasks: CalendarTask[]) {
  return tasks.reduce<Record<string, CalendarTask[]>>((acc, task) => {
    (acc[task.date] ??= []).push(task);
    return acc;
  }, {});
}

export default function CalendarPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTask[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("6:00 PM");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setCourses(loadCourses());
    setCalendarTasks(loadCalendarTasks());

    const sync = () => setCalendarTasks(loadCalendarTasks());
    window.addEventListener("calendar-tasks-updated", sync);
    return () => window.removeEventListener("calendar-tasks-updated", sync);
  }, []);

  const assignments: Assignment[] = useMemo(
    () => courses.flatMap((course) => course.assignments),
    [courses],
  );

  const plannedTasks = useMemo(
    () => getStudyTaskPlan(assignments),
    [assignments],
  );

  const mergedTasks = useMemo(
    () =>
      [...calendarTasks, ...plannedTasks].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      }),
    [calendarTasks, plannedTasks],
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    const dateKey = day.toISOString().slice(0, 10);
    return {
      dateKey,
      label: formatDayLabel(day),
      tasks: groupByDate(mergedTasks)[dateKey] ?? [],
    };
  });

  function handleAddTask() {
    if (!title.trim() || !date.trim()) return;

    addCalendarTask({
      id: `manual-${Date.now()}`,
      title: title.trim(),
      date,
      time: time.trim() || "6:00 PM",
      notes: notes.trim(),
      source: "manual",
    });

    setTitle("");
    setDate("");
    setTime("6:00 PM");
    setNotes("");
  }

  return (
    <main className="p-8 space-y-6 max-w-6xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Weekly planner with auto-scheduled study blocks and manual tasks.
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

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-800">Week plan</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              What to work on each day and when to start.
            </p>
          </div>

          <div className="divide-y divide-gray-50">
            {weekDays.map((day) => (
              <div key={day.dateKey} className="px-6 py-4">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {day.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {day.tasks.length === 0
                        ? "No tasks scheduled"
                        : `${day.tasks.length} item${day.tasks.length > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {day.dateKey === today.toISOString().slice(0, 10)
                      ? "Today"
                      : ""}
                  </span>
                </div>

                {day.tasks.length === 0 ? (
                  <div className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
                    Use this day to review, catch up, or add a task.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {task.time}
                            {task.notes ? ` · ${task.notes}` : ""}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${task.source === "manual" ? "bg-indigo-50 text-indigo-600" : task.source === "chat" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                          {task.source}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-800">Add a task</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Add homework, gym, meetings, or anything the AI chat suggests.
            </p>

            <div className="mt-4 space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  aria-label="Task date"
                  title="Task date"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="6:00 PM"
                  aria-label="Task time"
                  title="Task time"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
              />
              <button
                type="button"
                onClick={handleAddTask}
                disabled={!title.trim() || !date.trim()}
                className="w-full rounded-xl bg-indigo-600 text-white font-medium text-sm py-2.5 hover:bg-indigo-500 disabled:opacity-50 transition-colors">
                Add to calendar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800">Due soon</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Auto-scheduled blocks from your uploaded syllabi.
              </p>
            </div>
            <ul className="divide-y divide-gray-50">
              {mergedTasks.slice(0, 8).map((task) => (
                <li
                  key={task.id}
                  className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.date} · {task.time}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${task.source === "manual" ? "bg-indigo-50 text-indigo-600" : task.source === "chat" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                    {task.source}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
