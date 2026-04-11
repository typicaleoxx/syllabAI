import { Assignment } from "@/types";

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

export default function AlertBanner({ assignments }: Props) {
  const criticalSoon = assignments.filter(
    (a) => a.risk === "HIGH" && daysUntil(a.due) >= 0 && daysUntil(a.due) <= 7
  );

  if (criticalSoon.length < 2) return null;

  const courses = Array.from(new Set(criticalSoon.map((a) => a.course).filter(Boolean)));

  return (
    <div className="mx-8 mt-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
      <span className="text-lg mt-0.5">⚠️</span>
      <div>
        <p className="text-sm font-semibold text-red-700">
          You have {criticalSoon.length} critical deadlines this week
        </p>
        <p className="text-xs text-red-500 mt-0.5">
          {criticalSoon.map((a) => a.name).join(", ")}
          {courses.length > 0 && ` — across ${courses.join(", ")}`}
        </p>
      </div>
    </div>
  );
}
