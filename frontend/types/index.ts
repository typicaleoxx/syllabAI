export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface Assignment {
  name: string;
  due: string;
  risk: RiskLevel;
  weight?: number | null;
  course?: string;
}

export interface Contact {
  name: string;
  role: string;
  email: string;
  office_hours: string;
}

export interface UploadResponse {
  assignments: Assignment[];
  contacts: Contact[];
}

export interface Course {
  id: string;
  fileName: string;
  assignments: Assignment[];
  contacts: Contact[];
}

export interface CalendarTask {
  id: string;
  title: string;
  date: string;
  time: string;
  notes?: string;
  source: "manual" | "chat" | "assignment";
}
