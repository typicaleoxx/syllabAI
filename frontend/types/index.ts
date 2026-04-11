export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export interface Assignment {
  name: string;
  due: string;
  risk: RiskLevel;
}

export interface UploadResponse {
  assignments: Assignment[];
}
