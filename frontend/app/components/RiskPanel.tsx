import { Assignment, RiskLevel } from "@/types";

const LEVELS: { level: RiskLevel; label: string; bar: string; bg: string; text: string }[] = [
  { level: "HIGH",   label: "High Risk",   bar: "bg-red-500",    bg: "bg-red-50",    text: "text-red-700" },
  { level: "MEDIUM", label: "Medium Risk", bar: "bg-yellow-400", bg: "bg-yellow-50", text: "text-yellow-700" },
  { level: "LOW",    label: "Low Risk",    bar: "bg-green-500",  bg: "bg-green-50",  text: "text-green-700" },
];

interface RiskPanelProps {
  assignments: Assignment[];
}

export default function RiskPanel({ assignments }: RiskPanelProps) {
  const counts = assignments.reduce<Record<string, number>>(
    (acc, a) => ({ ...acc, [a.risk]: (acc[a.risk] ?? 0) + 1 }),
    {}
  );
  const total = assignments.length;

  return (
    <div className="w-64 shrink-0 bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Risk Breakdown</h3>
        <p className="text-xs text-gray-400 mt-0.5">By urgency level</p>
      </div>

      {/* Risk rows */}
      <div className="px-5 py-4 space-y-4">
        {LEVELS.map(({ level, label, bar, bg, text }) => {
          const count = counts[level] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={level}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-600">{label}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${bg} ${text}`}>{count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider + summary */}
      <div className="px-5 pb-5 pt-1 border-t border-gray-100 mt-1">
        <p className="text-[11px] text-gray-400 mb-3 pt-3">Color guide</p>
        <div className="space-y-1.5">
          {LEVELS.map(({ level, bar }) => (
            <div key={level} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${bar}`} />
              <span className="text-xs text-gray-500">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
