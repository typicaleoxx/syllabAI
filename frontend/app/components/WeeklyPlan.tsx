"use client";

import { Assignment } from "@/types";
import { Tone } from "@/lib/tone";

function parseLocalDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function daysUntil(d: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((parseLocalDate(d).getTime() - today.getTime()) / 86400000);
}

interface DayPlan {
  short: string;
  dayOffset: number;
  date: Date;
  assignments: Assignment[];
}

function getTimeBlock(dayOffset: number): string {
  // Suggest time blocks based on day of week
  const day = new Date();
  day.setDate(day.getDate() + dayOffset);
  const weekday = day.getDay(); // 0=Sun, 1=Mon...
  if (weekday === 0 || weekday === 6) return "afternoon"; // weekend
  if (weekday === 5) return "evening"; // Friday, keep it light
  return "evening"; // weekday default
}

function getSuggestion(day: DayPlan, tone: Tone, allDone: boolean): string {
  if (allDone && day.assignments.length > 0) {
    if (tone === "direct") return "All tasks for this day are done.";
    if (tone === "practical") return "You have completed everything for today.";
    return "You finished all your tasks today. Good work.";
  }

  const activeTasks = day.assignments;
  const has = activeTasks.length > 0;
  const names = activeTasks.map((a) => a.name);
  const high = activeTasks.filter((a) => a.risk === "HIGH");
  const isToday = day.dayOffset === 0;
  const isTomorrow = day.dayOffset === 1;
  const time = getTimeBlock(day.dayOffset);

  if (!has) {
    if (tone === "direct")
      return "No deadlines. Review material or work ahead.";
    if (tone === "practical")
      return "Nothing due. Good time to prepare for later in the week.";
    return "No deadlines today. Use this time to review or get ahead.";
  }

  const firstName = names[0];
  const count = activeTasks.length;

  if (high.length > 0) {
    const highName = high[0].name;
    if (tone === "direct") {
      if (isToday) return `${highName} is due today. Complete and submit now.`;
      if (isTomorrow)
        return `${highName} is due tomorrow. Finish it in your evening.`;
      return `Block 2-3 hours this ${time} for ${highName}.`;
    }
    if (tone === "practical") {
      if (isToday) return `${highName} is due today. Finalize and submit.`;
      if (isTomorrow) return `${highName} is due tomorrow. Work on it tonight.`;
      return `Set aside ${time} time this week for ${highName}.`;
    }
    if (isToday) return `${highName} is due today. You can submit it now.`;
    if (isTomorrow) return `${highName} is due tomorrow. Finish it up tonight.`;
    return `Plan to start ${highName} soon so you're confident when it's due.`;
  }

  if (tone === "direct") {
    if (count > 1) return `${count} items due. Split your time across each.`;
    return `${firstName} is due. Plan an hour this ${time}.`;
  }
  if (tone === "practical") {
    if (count > 1) return `${count} tasks due. Break them into smaller chunks.`;
    return `${firstName} is due. An hour of focused work should cover it.`;
  }
  if (count > 1)
    return `${count} assignments due. You can spread the work across the day.`;
  return `${firstName} is due. Take time this ${time} to complete it.`;
}

interface Props {
  assignments: Assignment[];
  tone: Tone;
  completed: Set<string>;
  assignmentKey: (a: Assignment) => string;
}

export default function WeeklyPlan({
  assignments,
  tone,
  completed,
  assignmentKey,
}: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: DayPlan[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      short:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", { weekday: "short" }),
      dayOffset: i,
      date,
      assignments: assignments.filter((a) => daysUntil(a.due) === i),
    };
  });

  const headers: Record<Tone, string> = {
    direct: "Weekly Plan",
    practical: "Your Week",
    genz: "Your Week Ahead",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">{headers[tone]}</h2>
        <p className="text-xs text-gray-400 mt-0.5">Next 7 days</p>
      </div>

      <div className="divide-y divide-gray-50">
        {days.map((day) => {
          const isToday = day.dayOffset === 0;
          const high = day.assignments.filter((a) => a.risk === "HIGH").length;
          const med = day.assignments.filter((a) => a.risk === "MEDIUM").length;
          const low = day.assignments.filter((a) => a.risk === "LOW").length;
          const allDone =
            day.assignments.length > 0 &&
            day.assignments.every((a) => completed.has(assignmentKey(a)));
          const suggestion = getSuggestion(day, tone, allDone);

          return (
            <div
              key={day.dayOffset}
              className={`px-6 py-4 flex gap-4 items-start ${isToday ? "bg-indigo-50/40" : ""} ${allDone ? "opacity-60" : ""}`}>
              {/* Day label */}
              <div className="w-24 shrink-0 pt-0.5">
                <p
                  className={`text-xs font-bold ${isToday ? "text-indigo-600" : "text-gray-500"}`}>
                  {day.short}
                </p>
                {!["Today", "Tomorrow"].includes(day.short) && (
                  <p className="text-[10px] text-gray-300 mt-0.5">
                    {day.date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                )}
              </div>

              {/* Risk dots */}
              <div className="flex gap-1 items-center pt-1 shrink-0 w-12">
                {high > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                )}
                {med > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
                {low > 0 && (
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                )}
                {day.assignments.length === 0 && (
                  <span className="w-2 h-2 rounded-full bg-gray-100" />
                )}
                {allDone && (
                  <span
                    className="w-2 h-2 rounded-full bg-indigo-400 ml-1"
                    title="All done"
                  />
                )}
              </div>

              {/* Suggestion */}
              <p className="text-sm text-gray-600 flex-1 leading-relaxed">
                {suggestion}
              </p>

              {/* Count badge */}
              {day.assignments.length > 0 && (
                <span
                  className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    allDone
                      ? "bg-indigo-100 text-indigo-500"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                  {allDone ? "done" : `${day.assignments.length} due`}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
