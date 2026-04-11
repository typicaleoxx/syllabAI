export type Tone = "serious" | "chill" | "genz";

export const TONE_OPTIONS: { value: Tone; label: string; emoji: string }[] = [
  { value: "serious", label: "Serious", emoji: "🧠" },
  { value: "chill",   label: "Chill",   emoji: "😎" },
  { value: "genz",    label: "Gen-Z",   emoji: "🔥" },
];

export const TONE = {
  loading: {
    serious: "Analyzing your syllabus...",
    chill:   "Getting your plan ready...",
    genz:    "lowkey scanning your syllabus rn",
  },
  status_good: {
    serious: "No critical deadlines this week. Stay ahead of schedule.",
    chill:   "You're in a safe zone this week.",
    genz:    "you're actually chilling rn fr fr",
  },
  status_heavy: {
    serious: "This week contains multiple high-priority assessments. Plan carefully.",
    chill:   "This week is heavy, plan carefully.",
    genz:    "not gonna lie this week is a lot",
  },
  today_clear: {
    serious: "No urgent tasks due today.",
    chill:   "Nothing pressing today, you're good.",
    genz:    "nothing due today, you're in your bag",
  },
  today_header: {
    serious: "Today's Priorities",
    chill:   "Focus on this today",
    genz:    "lowkey what you should do today",
  },
  insight: {
    serious: (name: string, weight: number | null | undefined) =>
      weight ? `${name} accounts for ${weight}% of your grade. Starting today is advised.`
             : `${name} is coming up, allocate time now.`,
    chill: (name: string, weight: number | null | undefined) =>
      weight ? `${name} is ${weight}% of your grade, worth putting time into.`
             : `${name} is coming up soon, get a head start.`,
    genz: (name: string, weight: number | null | undefined) =>
      weight ? `${name} is ${weight}% of your grade bro, don't sleep on this`
             : `${name} is literally coming up, do something about it`,
  },
  next_week_clear: {
    serious: "Next week appears manageable.",
    chill:   "Next week looks pretty light.",
    genz:    "next week lowkey looks chill ngl",
  },
  next_week_heavy: {
    serious: "Next week contains significant assessments. Begin preparation this week.",
    chill:   "Heads up, next week is looking busy.",
    genz:    "next week is gonna hit different, prep now",
  },
  plan_light: {
    serious: "Light day, use this time to review material.",
    chill:   "Light day, maybe get ahead?",
    genz:    "free day, get ahead or just vibe",
  },
};

export function t(tone: Tone, key: keyof typeof TONE): string {
  const entry = TONE[key];
  if (typeof entry === "object" && tone in entry) {
    return (entry as Record<Tone, string>)[tone];
  }
  return "";
}
