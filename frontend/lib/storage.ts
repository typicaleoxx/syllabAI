import { Course } from "@/types";

const COURSES_KEY = "syllabai_courses";

export function loadCourses(): Course[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(COURSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Course[]) : [];
  } catch {
    return [];
  }
}

export function saveCourses(courses: Course[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch {
    // Ignore storage failures in private mode or when quota is exceeded.
  }
}
