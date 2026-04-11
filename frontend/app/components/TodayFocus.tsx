import { Assignment } from "@/types";
import { Tone, TONE } from "@/lib/tone";

function parseLocalDate(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function daysUntil(d: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((parseLocalDate(d).getTime() - today.getTime()) / 86400000);
}

const RISK_DOT: Record<string, string> = {
  HIGH: "bg-red-400", MEDIUM: "bg-amber-400", LOW: "bg-green-400",
};

interface Props { assignments: Assignment[]; tone: Tone; }

export default function TodayFocus({ assignments, tone }: Props) {
  // Pick top 3: today first, then soonest HIGH, then soonest overall
  const upcoming = assignments
    .filter(a => daysUntil(a.due) >= 0)
    .sort((a, b) => {
      const da = daysUntil(a.due), db = daysUntil(b.due);
      if (da !== db) return da - db;
      const rOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return rOrder[a.risk] - rOrder[b.risk];
    })
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">{TONE.today_header[tone]}</h2>
      </div>

      {upcoming.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-2xl mb-2">😌</p>
          <p className="text-sm font-medium text-gray-600">{TONE.today_clear[tone]}</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {upcoming.map((a, i) => {
            const days = daysUntil(a.due);
            const dayLabel = days === 0 ? "Due today!" : days === 1 ? "Due tomorrow" : `${days} days away`;
            const insight = TONE.insight[tone](a.name, a.weight);

            return (
              <div key={i} className="px-6 py-5">
                {/* Priority number */}
                <div className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-semibold text-gray-800">{a.name}</p>
                      {a.course && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-500 uppercase tracking-wide">
                          {a.course}
                        </span>
                      )}
                      <span className={`w-2 h-2 rounded-full ${RISK_DOT[a.risk]}`} />
                      <span className="text-xs font-medium text-gray-400">{dayLabel}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{insight}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
