import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";
import type { User } from "../../types";
import type { AuthState } from "../../types/auth.types";
import * as authService from "../../services/auth.service";

// ---------------------------------------------------------------------------
// authSlice  (global auth UI state)
// ---------------------------------------------------------------------------
// Tracks the signed-in user and derived flags. There is NO access token here —
// the backend uses httpOnly cookies the browser sends automatically (see
// axiosInstance). Login/register/etc. are React Query mutations (useAuthActions)
// that dispatch `setUser` on success; `restoreSession` runs once on app load.
// ---------------------------------------------------------------------------

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  // Start "loading" so guards wait for the boot-time session check below
  // instead of bouncing a returning user to /login on first paint.
  isLoading: true,
};

/**
 * Boot-time session restore. Calls GET /users/me; if a valid session cookie
 * exists (or can be refreshed by the interceptor) the user is returned, else it
 * rejects and we treat the visitor as logged out.
 */
export const restoreSession = createAsyncThunk<User>(
  "auth/restoreSession",
  async () => authService.getCurrentUser(),
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Set the signed-in user (after login/register/profile update). */
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    /** Clear everything (logout, or session irrecoverably lost). */
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    /** Manually toggle the loading flag if ever needed. */
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { setUser, clearAuth, setAuthLoading } = authSlice.actions;

// Selectors.
export const selectAuth = (state: RootState): AuthState => state.auth;
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState): User | null =>
  state.auth.user;

export default authSlice.reducer;
