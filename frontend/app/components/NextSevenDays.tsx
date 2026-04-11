import { Assignment } from "@/types";

const RISK_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

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

interface Props {
  assignments: Assignment[];
}

export default function NextSevenDays({ assignments }: Props) {
  const upcoming = assignments
    .filter((a) => {
      const d = daysUntil(a.due);
      return d >= 0 && d <= 7;
    })
    .sort((a, b) =>
      RISK_ORDER[a.risk] - RISK_ORDER[b.risk] ||
      parseLocalDate(a.due).getTime() - parseLocalDate(b.due).getTime()
    );

  return (
    <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-orange-100 flex items-center justify-between bg-orange-50/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-gray-800">Focus Now — Next 7 Days</h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {upcoming.length === 0
              ? "Nothing due in the next 7 days"
              : `${upcoming.length} item${upcoming.length > 1 ? "s" : ""} coming up — sorted by priority`}
          </p>
        </div>
        <span className="text-xs font-semibold text-orange-500 bg-orange-100 px-2.5 py-1 rounded-full">
          {upcoming.length} urgent
        </span>
      </div>

      {/* Empty state */}
      {upcoming.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-sm font-medium text-gray-600">You&apos;re clear for the next 7 days</p>
          <p className="text-xs text-gray-400 mt-0.5">Check the full timeline below for upcoming deadlines</p>
        </div>
      )}

      {/* Items */}
      {upcoming.length > 0 && (
        <ul>
          {upcoming.map((a, i) => {
            const days = daysUntil(a.due);
            const label = days === 0 ? "Due today!" : days === 1 ? "Due tomorrow" : `${days} days left`;
            const labelColor = days <= 1 ? "text-red-500 font-semibold" : "text-orange-500";

            return (
              <li
                key={i}
                className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    a.risk === "HIGH" ? "bg-red-500" :
                    a.risk === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"
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
                    <p className={`text-xs mt-0.5 ${labelColor}`}>{label}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${RISK_STYLES[a.risk]}`}>
                  {a.risk}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
