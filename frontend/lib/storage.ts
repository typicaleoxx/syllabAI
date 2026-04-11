import { CalendarTask, Course } from "@/types";

const COURSES_KEY = "syllabai_courses";
const CALENDAR_TASKS_KEY = "syllabai_calendar_tasks";

function emitCalendarUpdate() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("calendar-tasks-updated"));
}

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

export function loadCalendarTasks(): CalendarTask[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CALENDAR_TASKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CalendarTask[]) : [];
  } catch {
    return [];
  }
}

export function saveCalendarTasks(tasks: CalendarTask[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CALENDAR_TASKS_KEY, JSON.stringify(tasks));
    emitCalendarUpdate();
  } catch {
    // Ignore storage failures in private mode or when quota is exceeded.
  }
}

export function addCalendarTask(task: CalendarTask) {
  const tasks = loadCalendarTasks();
  saveCalendarTasks([task, ...tasks]);
}
