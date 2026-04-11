"use client";

import { useState } from "react";
import { Assignment } from "@/types";

const RISK_STYLES: Record<string, string> = {
  HIGH:   "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW:    "bg-green-100 text-green-700",
};

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((parseLocalDate(dateStr).getTime() - today.getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function Row({ a }: { a: Assignment }) {
  const days = daysUntil(a.due);
  const urgency = days === 0 ? "Due today!" : days === 1 ? "Tomorrow" : `${days} days left`;
  const urgencyColor = days <= 1 ? "text-red-500 font-semibold" : days <= 7 ? "text-orange-500" : "text-gray-400";

  return (
    <li className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${
          a.risk === "HIGH" ? "bg-red-500" : a.risk === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
        }`} />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-800">{a.name}</p>
            {a.course && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-500">
                {a.course}
              </span>
            )}
          </div>
          <p className={`text-xs mt-0.5 ${urgencyColor}`}>{urgency}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{formatDate(a.due)}</span>
        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${RISK_STYLES[a.risk]}`}>
          {a.risk}
        </span>
      </div>
    </li>
  );
}

interface TimelineProps {
  assignments: Assignment[];
}

export default function Timeline({ assignments }: TimelineProps) {
  const [showOverdue, setShowOverdue] = useState(false);

  const upcoming = assignments
    .filter((a) => daysUntil(a.due) >= 0)
    .sort((a, b) => parseLocalDate(a.due).getTime() - parseLocalDate(b.due).getTime());

  const overdue = assignments
    .filter((a) => daysUntil(a.due) < 0)
    .sort((a, b) => parseLocalDate(b.due).getTime() - parseLocalDate(a.due).getTime()); // most recent first

  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Upcoming Deadlines</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {upcoming.length} upcoming — sorted by due date
          </p>
        </div>
        <span className="text-xs text-gray-400">Due date</span>
      </div>

      {/* Upcoming */}
      {upcoming.length === 0 ? (
        <p className="px-5 py-6 text-sm text-gray-400 text-center">No upcoming deadlines</p>
      ) : (
        <ul>{upcoming.map((a, i) => <Row key={i} a={a} />)}</ul>
      )}

      {/* Overdue toggle */}
      {overdue.length > 0 && (
        <div className="border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowOverdue((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-red-400">
              {overdue.length} overdue item{overdue.length > 1 ? "s" : ""}
            </span>
            <span>{showOverdue ? "▲ hide" : "▼ show"}</span>
          </button>
          {showOverdue && (
            <ul className="opacity-50">
              {overdue.map((a, i) => <Row key={i} a={a} />)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
