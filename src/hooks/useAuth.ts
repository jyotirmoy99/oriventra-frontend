import { useAppSelector } from "./useAppSelector";
import { selectAuth } from "../features/auth/authSlice";
import type { AuthState } from "../types/auth.types";

// ---------------------------------------------------------------------------
// useAuth
// ---------------------------------------------------------------------------
// Convenience accessor for the auth slice: { user, isAuthenticated, isLoading }.
// ---------------------------------------------------------------------------

export function useAuth(): AuthState {
  return useAppSelector(selectAuth);
}
