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

interface Props { assignments: Assignment[]; tone: Tone; }

export default function StatusCard({ assignments, tone }: Props) {
  const urgentThisWeek = assignments.filter(a => {
    const d = daysUntil(a.due);
    return d >= 0 && d <= 7 && a.risk === "HIGH";
  });

  const isHeavy = urgentThisWeek.length >= 2;

  const message = isHeavy ? TONE.status_heavy[tone] : TONE.status_good[tone];
  const icon = isHeavy ? "⚠️" : "✅";
  const bg = isHeavy
    ? "bg-amber-50 border-amber-200"
    : "bg-green-50 border-green-200";
  const textColor = isHeavy ? "text-amber-800" : "text-green-800";

  return (
    <div className={`rounded-2xl border px-6 py-5 flex items-center gap-4 ${bg}`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className={`text-base font-semibold ${textColor}`}>{message}</p>
        {isHeavy && (
          <p className="text-sm text-amber-600 mt-0.5">
            {urgentThisWeek.length} high-priority items need your attention this week
          </p>
        )}
      </div>
    </div>
  );
}
