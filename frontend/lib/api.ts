import { UploadResponse } from "@/types";

const BASE_URL = "http://localhost:8000";

export async function uploadSyllabus(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail ?? "Upload failed");
  }

  return res.json();
}

export async function parseSyllabusText(text: string): Promise<UploadResponse> {
  const res = await fetch(`${BASE_URL}/parse-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Parse failed" }));
    throw new Error(err.detail ?? "Parse failed");
  }

  return res.json();
}
