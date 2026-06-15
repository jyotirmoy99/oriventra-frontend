import { AxiosError } from "axios";
import type { ApiErrorBody } from "../types";

// ---------------------------------------------------------------------------
// getErrorMessage
// ---------------------------------------------------------------------------
// Normalizes any thrown value (Axios error, Error, unknown) into a single
// user-facing string. Prefers the backend's `message`; if the backend returned
// field-level validation errors, surfaces the first one. Used by forms and
// toasts app-wide so error handling stays consistent.
// ---------------------------------------------------------------------------

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof AxiosError) {
    const body = error.response?.data as ApiErrorBody | undefined;
    if (body?.errors?.length) return body.errors[0].message;
    if (body?.message) return body.message;
    // Network / no-response errors (server down, CORS, offline).
    if (error.code === "ERR_NETWORK") {
      return "Can't reach the server. Check your connection and try again.";
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
