"use client";

import { Assignment } from "@/types";
import { Tone } from "@/lib/tone";

function parseLocalDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function daysUntil(d: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.ceil((parseLocalDate(d).getTime() - today.getTime()) / 86400000);
}

interface DayPlan {
  label: string;
  short: string;
  dayOffset: number;
  assignments: Assignment[];
}

function getSuggestion(day: DayPlan, tone: Tone): string {
  const has = day.assignments.length > 0;
  const names = day.assignments.map((a) => a.name);
  const high = day.assignments.filter((a) => a.risk === "HIGH");
  const isToday = day.dayOffset === 0;
  const isTomorrow = day.dayOffset === 1;

  if (!has) {
    if (tone === "serious") return "No deadlines. Review recent material or read ahead.";
    if (tone === "chill") return "Nothing due, good time to get ahead or just breathe.";
    return "free day, do whatever bestie";
  }

  const firstName = names[0];
  const count = day.assignments.length;

  if (high.length > 0) {
    const highName = high[0].name;
    if (tone === "serious") {
      if (isToday) return `${highName} is due today. Submit and confirm.`;
      if (isTomorrow) return `${highName} is due tomorrow. Finalize tonight.`;
      return `${highName} is high priority this day. Dedicate focused time.`;
    }
    if (tone === "chill") {
      if (isToday) return `${highName} is due today, get it in!`;
      if (isTomorrow) return `${highName} is tomorrow, wrap it up tonight.`;
      return `${highName} needs real attention this day.`;
    }
    // genz
    if (isToday) return `bro ${highName} is literally due TODAY go go go`;
    if (isTomorrow) return `${highName} is tomorrow, stop scrolling and finish it`;
    return `${highName} is coming up, it's giving urgent energy`;
  }

  // medium/low only
  if (tone === "serious") {
    if (count > 1) return `${count} items due. Prioritize and allocate time proportionally.`;
    return `${firstName} is due. Keep it on your radar.`;
  }
  if (tone === "chill") {
    if (count > 1) return `${count} things due, just stay organized and you're fine.`;
    return `${firstName} is due, shouldn't be too bad.`;
  }
  // genz
  if (count > 1) return `${count} things due, not gonna lie it's giving busy`;
  return `${firstName} is due, not a big deal but don't ghost it`;
}

interface Props {
  assignments: Assignment[];
  tone: Tone;
}

export default function WeeklyPlan({ assignments, tone }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: DayPlan[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      label: date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }),
      short: i === 0 ? "Today" : i === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "short" }),
      dayOffset: i,
      assignments: assignments.filter((a) => daysUntil(a.due) === i),
    };
  });

  const headers: Record<Tone, string> = {
    serious: "Weekly Plan",
    chill: "Your Week at a Glance",
    genz: "the week ahead",
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
          const suggestion = getSuggestion(day, tone);

          return (
            <div
              key={day.dayOffset}
              className={`px-6 py-4 flex gap-4 items-start ${isToday ? "bg-indigo-50/40" : ""}`}
            >
              {/* Day label */}
              <div className="w-24 shrink-0 pt-0.5">
                <p className={`text-xs font-bold ${isToday ? "text-indigo-600" : "text-gray-500"}`}>
                  {day.short}
                </p>
                {!["Today", "Tomorrow"].includes(day.short) && (
                  <p className="text-[10px] text-gray-300 mt-0.5">
                    {new Date(today.getTime() + day.dayOffset * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                )}
              </div>

              {/* Dot indicators */}
              <div className="flex gap-1 items-center pt-1 shrink-0 w-12">
                {high > 0 && <span className="w-2 h-2 rounded-full bg-red-400" />}
                {med > 0 && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                {low > 0 && <span className="w-2 h-2 rounded-full bg-green-400" />}
                {day.assignments.length === 0 && <span className="w-2 h-2 rounded-full bg-gray-100" />}
              </div>

              {/* Suggestion */}
              <p className="text-sm text-gray-600 flex-1 leading-relaxed">{suggestion}</p>

              {/* Count badge */}
              {day.assignments.length > 0 && (
                <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  {day.assignments.length} due
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
