import type { User } from "./index";

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------
// Shape of the global auth slice and the payloads used to mutate it. The slice
// holds only auth-related GLOBAL UI state — server data (profile, etc.) that
// can be refetched is owned by TanStack Query in later features.
// ---------------------------------------------------------------------------

export interface AuthState {
  /** Signed-in user, or null when logged out. */
  user: User | null;
  /** Short-lived JWT access token (also mirrored to localStorage). */
  accessToken: string | null;
  /** True once the user is verified as signed in. */
  isAuthenticated: boolean;
  /** True while the app is verifying an existing session on boot (Feature 3). */
  isLoading: boolean;
}

/** Payload for a successful login/refresh. */
export interface AuthCredentials {
  user: User;
  accessToken: string;
}
