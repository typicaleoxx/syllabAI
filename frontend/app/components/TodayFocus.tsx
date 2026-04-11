import { Assignment } from "@/types";
import { Tone, TONE } from "@/lib/tone";

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
  completed: Set<string>;
  onToggle: (key: string) => void;
  assignmentKey: (a: Assignment) => string;
}

export default function TodayFocus({
  assignments,
  tone,
  completed,
  onToggle,
  assignmentKey,
}: Props) {
  const upcoming = assignments
    .filter((a) => daysUntil(a.due) >= 0)
    .sort((a, b) => {
      const da = daysUntil(a.due),
        db = daysUntil(b.due);
      if (da !== db) return da - db;
      const rOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return rOrder[a.risk] - rOrder[b.risk];
    })
    .slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800">
          {TONE.today_header[tone]}
        </h2>
      </div>

      {upcoming.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <p className="text-sm font-medium text-gray-500">
            {TONE.today_clear[tone]}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {upcoming.map((a, i) => {
            const days = daysUntil(a.due);
            const dayLabel =
              days === 0
                ? "Due today"
                : days === 1
                  ? "Due tomorrow"
                  : `Due in ${days} days`;
            const insight = TONE.insight[tone](a.name, a.weight);
            const key = assignmentKey(a);
            const done = completed.has(key);

            return (
              <div
                key={i}
                className={`px-6 py-5 transition-opacity ${done ? "opacity-50" : ""}`}>
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => onToggle(key)}
                    aria-label={done ? "Mark as incomplete" : "Mark as done"}
                    className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      done
                        ? "bg-indigo-500 border-indigo-500"
                        : "border-gray-300 hover:border-indigo-400"
                    }`}>
                    {done && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Priority number */}
                  <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-base font-semibold text-gray-800 ${done ? "line-through" : ""}`}>
                        {a.name}
                      </p>
                      {a.course && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-500 uppercase tracking-wide">
                          {a.course}
                        </span>
                      )}
                      <span
                        className={`w-2 h-2 rounded-full ${RISK_DOT[a.risk]}`}
                      />
                      <span className="text-xs font-medium text-gray-400">
                        {dayLabel}
                      </span>
                    </div>
                    {!done && (
                      <p className="text-sm text-gray-500 mt-1">{insight}</p>
                    )}
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
