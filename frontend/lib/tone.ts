export type Tone = "direct" | "practical" | "supportive";

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "direct", label: "Direct" },
  { value: "practical", label: "Practical" },
  { value: "supportive", label: "Supportive" },
];

export const TONE = {
  loading: {
    direct: "Analyzing your syllabus...",
    practical: "Processing your syllabus...",
    supportive: "Let me organize your syllabus...",
  },
  status_good: {
    direct: "No critical deadlines this week.",
    practical: "You have breathing room this week.",
    supportive: "You're in good shape this week.",
  },
  status_heavy: {
    direct: "Multiple high-priority items due this week.",
    practical: "This is a heavy week. Plan ahead.",
    supportive: "This week has several important deadlines. You can handle it.",
  },
  today_clear: {
    direct: "No tasks due today.",
    practical: "Nothing due today.",
    supportive: "You have a clear day today.",
  },
  today_header: {
    direct: "Today",
    practical: "Today's tasks",
    supportive: "What you're working on today",
  },
  insight: {
    direct: (name: string, weight: number | null | undefined) =>
      weight
        ? `${name} is ${weight}% of your grade.`
        : `${name} needs your attention soon.`,
    practical: (name: string, weight: number | null | undefined) =>
      weight
        ? `${name} counts for ${weight}% of your grade.`
        : `Start working on ${name} soon.`,
    supportive: (name: string, weight: number | null | undefined) =>
      weight
        ? `${name} is ${weight}% of your overall grade. You've got this.`
        : `Take time today or tomorrow to get started on ${name}.`,
  },
  next_week_clear: {
    direct: "Next week is light.",
    practical: "Next week looks manageable.",
    supportive: "Next week should be easier.",
  },
  next_week_heavy: {
    direct: "Next week has major deadlines. Prepare now.",
    practical: "Next week is packed. Start preparing today.",
    supportive: "Next week has a lot going on. Get a head start this week.",
  },
  plan_light: {
    direct: "Light day. Review or get ahead.",
    practical: "Use this time to catch up or prepare for next week.",
    supportive: "A good day to review material or work ahead.",
  },
};

export function t(tone: Tone, key: keyof typeof TONE): string {
  const entry = TONE[key];
  if (typeof entry === "object" && tone in entry) {
    return (entry as Record<Tone, string>)[tone];
  }
  return "";
}
