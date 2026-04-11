import { UploadResponse } from "@/types";

function resolveApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1";
    if (!isLocal) {
      throw new Error(
        "Missing NEXT_PUBLIC_API_BASE_URL. Set your deployed backend URL in frontend environment variables.",
      );
    }
  }

  return "http://localhost:8000";
}

function normalizeFetchError(err: unknown): Error {
  if (err instanceof Error) {
    if (err.message === "Failed to fetch") {
      return new Error(
        "Cannot reach backend API. Check NEXT_PUBLIC_API_BASE_URL and make sure the backend is running and publicly accessible.",
      );
    }
    return err;
  }
  return new Error("Network request failed");
}

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl();
}

export async function uploadSyllabus(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${resolveApiBaseUrl()}/upload`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    throw normalizeFetchError(err);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(err.detail ?? "Upload failed");
  }

  return res.json();
}

export async function parseSyllabusText(text: string): Promise<UploadResponse> {
  let res: Response;
  try {
    res = await fetch(`${resolveApiBaseUrl()}/parse-text`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    throw normalizeFetchError(err);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Parse failed" }));
    throw new Error(err.detail ?? "Parse failed");
  }

  return res.json();
}
