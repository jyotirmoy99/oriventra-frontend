import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { User } from "../../types";
import type { AuthCredentials, AuthState } from "../../types/auth.types";

// ---------------------------------------------------------------------------
// authSlice  (global auth UI state)
// ---------------------------------------------------------------------------
// Minimal foundation used by the Navbar (user menu) and the route guards
// (PrivateRoute / AdminRoute). Feature 3 (Auth) adds the bootstrap that
// verifies the session on app load and the thunks/API wiring.
// ---------------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  // Re-hydrate the token so the Axios interceptor can use it immediately.
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: false,
  // Feature 2 has no session bootstrap yet, so start "settled" (false).
  // Feature 3 flips this to `true` during the on-load session check.
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Store user + token after a successful login or token refresh. */
    setCredentials(state, action: PayloadAction<AuthCredentials>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
    /** Update just the user profile (e.g. after a session restore). */
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    /** Toggle the boot/verification loading flag. */
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    /** Clear everything on logout. */
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, setUser, setAuthLoading, logout } =
  authSlice.actions;

// Selectors — typed against RootState (type-only import, erased at runtime).
export const selectAuth = (state: RootState): AuthState => state.auth;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState): User | null =>
  state.auth.user;

export default authSlice.reducer;
