const DEFAULT_API_URL =
  "https://script.google.com/macros/s/AKfycbx_z3VigMeh2IL3nRoDzhV21ickKRj4zYWASCuMFGedYfrLph7rr1j5gqIX19CxZ3ey_g/exec";

const API_URL = import.meta.env.VITE_APPS_SCRIPT_API_URL || DEFAULT_API_URL;

export type ApiError = {
  code: string;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
};

function buildUrl(action: string, params?: Record<string, string>) {
  const url = new URL(API_URL);
  url.searchParams.set("action", action);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;

  if (!payload.success || payload.error) {
    throw new Error(payload.error?.message || "API request failed.");
  }

  return payload.data as T;
}

export async function apiGet<T>(
  action: string,
  params?: Record<string, string>
): Promise<T> {
  const response = await fetch(buildUrl(action, params), {
    method: "GET"
  });

  return parseApiResponse<T>(response);
}

export async function apiPost<T>(
  action: string,
  payload: Record<string, unknown>
): Promise<T> {
  const response = await fetch(buildUrl(action), {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  return parseApiResponse<T>(response);
}
