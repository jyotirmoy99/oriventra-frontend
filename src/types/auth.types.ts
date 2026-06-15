import type { User } from "./index";

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------
// IMPORTANT: this backend issues tokens as httpOnly cookies — JavaScript cannot
// read them. So the frontend never stores an access token; the browser sends
// the cookies automatically (axios `withCredentials`). The auth slice therefore
// tracks only the user + derived flags, NOT a token.
// ---------------------------------------------------------------------------

export interface AuthState {
  /** Signed-in user, or null when logged out / not yet known. */
  user: User | null;
  /** True once a user is confirmed signed in. */
  isAuthenticated: boolean;
  /** True while the app verifies an existing session on boot. */
  isLoading: boolean;
}

// --- Request payloads (match the backend auth validation schemas) ----------

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

// --- Response payloads ------------------------------------------------------

/** `data` shape returned by register/login/refresh/getCurrentUser. */
export interface AuthUserData {
  user: User;
}
