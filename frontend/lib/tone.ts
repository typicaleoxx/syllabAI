export type Tone = "direct" | "practical" | "genz";

export const TONE_OPTIONS: { value: Tone; label: string }[] = [
  { value: "direct", label: "Direct" },
  { value: "practical", label: "Practical" },
  { value: "genz", label: "Gen-Z" },
];

export const TONE = {
  loading: {
    direct: "Analyzing your syllabus...",
    practical: "Processing your syllabus...",
    genz: "lowkey scanning your syllabus rn",
  },
  status_good: {
    direct: "No critical deadlines this week.",
    practical: "You have breathing room this week.",
    genz: "you're actually chilling this week fr fr",
  },
  status_heavy: {
    direct: "Multiple high-priority items due this week.",
    practical: "This is a heavy week. Plan ahead.",
    genz: "not gonna lie this week is lowkey packed bro",
  },
  today_clear: {
    direct: "No tasks due today.",
    practical: "Nothing due today.",
    genz: "nothing due today my guy",
  },
  today_header: {
    direct: "Today",
    practical: "Today's tasks",
    genz: "what you should lowkey be doing today",
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
    genz: (name: string, weight: number | null | undefined) =>
      weight
        ? `${name} is ${weight}% of your grade bro. Don't sleep on it.`
        : `Lowkey start ${name} today so you don't get cooked later.`,
  },
  next_week_clear: {
    direct: "Next week is light.",
    practical: "Next week looks manageable.",
    genz: "next week lowkey looks chill ngl",
  },
  next_week_heavy: {
    direct: "Next week has major deadlines. Prepare now.",
    practical: "Next week is packed. Start preparing today.",
    genz: "next week is gonna hit different bro, prep now or get cooked",
  },
  plan_light: {
    direct: "Light day. Review or get ahead.",
    practical: "Use this time to catch up or prepare for next week.",
    genz: "free day fr, get ahead or just chill",
  },
};

export function t(tone: Tone, key: keyof typeof TONE): string {
  const entry = TONE[key];
  if (typeof entry === "object" && tone in entry) {
    return (entry as Record<Tone, string>)[tone];
  }
  return "";
}
