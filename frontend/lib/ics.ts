import { Assignment } from "@/types";

function formatICSDate(dateStr: string): string {
  // YYYY-MM-DD → YYYYMMDD
  return dateStr.replace(/-/g, "");
}

function escapeICS(str: string): string {
  return str.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export function generateICS(assignments: Assignment[]): string {
  const events = assignments.map((a) => {
    const start = formatICSDate(a.due);
    // End date = next day (ICS all-day events are exclusive end)
    const [y, m, d] = a.due.split("-").map(Number);
    const endDate = new Date(y, m - 1, d + 1);
    const end = [
      endDate.getFullYear(),
      String(endDate.getMonth() + 1).padStart(2, "0"),
      String(endDate.getDate()).padStart(2, "0"),
    ].join("");

    const summary = a.course ? `${escapeICS(a.name)} [${a.course}]` : escapeICS(a.name);
    const description = [
      `Risk: ${a.risk}`,
      a.weight != null ? `Weight: ${a.weight}%` : "",
      a.course ? `Course: ${a.course}` : "",
    ]
      .filter(Boolean)
      .join("\\n");

    return [
      "BEGIN:VEVENT",
      `SUMMARY:${summary}`,
      `DTSTART;VALUE=DATE:${start}`,
      `DTEND;VALUE=DATE:${end}`,
      `DESCRIPTION:${description}`,
      `STATUS:CONFIRMED`,
      "END:VEVENT",
    ].join("\r\n");
  });

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SyllabAI//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...events,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(assignments: Assignment[], filename = "syllabai.ics"): void {
  const content = generateICS(assignments);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
