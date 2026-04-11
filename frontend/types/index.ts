export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface Assignment {
  name: string;
  due: string;
  risk: RiskLevel;
  weight?: number | null;
}

export interface UploadResponse {
  assignments: Assignment[];
}
