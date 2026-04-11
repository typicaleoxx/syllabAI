import { Tone } from "@/lib/tone";

const LOADING_MSG: Record<Tone, string> = {
  serious: "Analyzing your syllabus...",
  chill:   "Getting your plan ready...",
  genz:    "lowkey scanning your syllabus rn 👀",
};

interface Props { tone?: Tone; }

export default function Loader({ tone = "chill" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
      <p className="text-sm text-gray-500">{LOADING_MSG[tone]}</p>
    </div>
  );
}
