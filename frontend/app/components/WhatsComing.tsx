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

const RISK_DOT: Record<string, string> = {
  HIGH: "bg-red-400",
  MEDIUM: "bg-amber-400",
  LOW: "bg-green-400",
};

interface Props {
  assignments: Assignment[];
  tone: Tone;
}

export default function WhatsComing({ assignments, tone }: Props) {
  const nextWeek = assignments
    .filter((a) => {
      const d = daysUntil(a.due);
      return d >= 7 && d <= 14;
    })
    .sort((a, b) => daysUntil(a.due) - daysUntil(b.due));

  const highCount = nextWeek.filter((a) => a.risk === "HIGH").length;
  const isHeavy = highCount >= 2;

  const headers: Record<Tone, string> = {
    direct: "Next Week",
    practical: "What's Coming",
    supportive: "Looking Ahead",
  };

  const emptyMsg: Record<Tone, string> = {
    direct: "Nothing significant next week.",
    practical: "Nothing major coming up next week.",
    supportive: "Next week is looking clear.",
  };

  const heavyMsg: Record<Tone, string> = {
    direct: `${highCount} high-priority items next week. Start preparing now.`,
    practical: "Next week has several important deadlines. Begin prep today.",
    supportive: `Next week will be busy with ${highCount} important items. You have time to prepare.`,
  };

  const lightMsg: Record<Tone, string> = {
    direct: "Next week is manageable.",
    practical: "Next week looks lighter than this one.",
    supportive: "Next week should be easier.",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-800">{headers[tone]}</h2>
        <span className="text-xs text-gray-400">Days 7-14</span>
      </div>

      {nextWeek.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm text-gray-500">{emptyMsg[tone]}</p>
        </div>
      ) : (
        <>
          <div
            className={`px-6 py-3 text-sm font-medium ${isHeavy ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
            {isHeavy ? heavyMsg[tone] : lightMsg[tone]}
          </div>

          <ul className="divide-y divide-gray-50">
            {nextWeek.map((a, i) => {
              const d = daysUntil(a.due);
              return (
                <li key={i} className="px-6 py-3.5 flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${RISK_DOT[a.risk]}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {a.name}
                      </p>
                      {a.course && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-500 uppercase tracking-wide shrink-0">
                          {a.course}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    in {d} days
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
