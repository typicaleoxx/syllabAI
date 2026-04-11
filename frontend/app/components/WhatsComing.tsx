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

const RISK_DOT: Record<string, string> = {
  HIGH: "bg-red-400", MEDIUM: "bg-amber-400", LOW: "bg-green-400",
};

interface Props { assignments: Assignment[]; tone: Tone; }

export default function WhatsComing({ assignments, tone }: Props) {
  const nextWeek = assignments
    .filter((a) => { const d = daysUntil(a.due); return d >= 7 && d <= 14; })
    .sort((a, b) => daysUntil(a.due) - daysUntil(b.due));

  const highCount = nextWeek.filter((a) => a.risk === "HIGH").length;
  const isHeavy = highCount >= 2;

  const headers: Record<Tone, string> = {
    serious: "What's Coming",
    chill: "On the horizon",
    genz: "what's coming up next week",
  };

  const emptyMsg: Record<Tone, string> = {
    serious: "Nothing significant in the next two weeks.",
    chill:   "Nothing big coming up, enjoy the breather.",
    genz:    "next week is looking chill ngl",
  };

  const heavyMsg: Record<Tone, string> = {
    serious: `${highCount} high-priority items next week. Begin preparation now.`,
    chill:   "Heads up, next week is looking busy. Start prepping soon.",
    genz:    "next week is gonna hit different, prep now not later",
  };

  const lightMsg: Record<Tone, string> = {
    serious: "Next week appears manageable. Stay consistent.",
    chill:   "Next week looks pretty light, you've got this.",
    genz:    "next week lowkey looks chill ngl",
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
          <div className={`px-6 py-3 text-sm font-medium ${isHeavy ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
            {isHeavy ? heavyMsg[tone] : lightMsg[tone]}
          </div>

          <ul className="divide-y divide-gray-50">
            {nextWeek.map((a, i) => {
              const d = daysUntil(a.due);
              return (
                <li key={i} className="px-6 py-3.5 flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${RISK_DOT[a.risk]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-800 truncate">{a.name}</p>
                      {a.course && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-500 uppercase tracking-wide shrink-0">
                          {a.course}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">in {d} days</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
