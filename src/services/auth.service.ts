import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse, User } from "../types";
import type {
  AuthUserData,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

// ---------------------------------------------------------------------------
// auth.service
// ---------------------------------------------------------------------------
// Thin wrappers over the backend /auth and /users/me endpoints. Tokens live in
// httpOnly cookies, so these functions only ever return the `user` (or nothing).
// Each returns the unwrapped payload; callers handle errors via getErrorMessage.
// ---------------------------------------------------------------------------

/** POST /auth/register — creates the account, sets cookies, emails verification. */
export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await axiosInstance.post<ApiResponse<AuthUserData>>(
    "/auth/register",
    payload,
  );
  return data.data!.user;
}

/** POST /auth/login — authenticates and sets cookies. */
export async function login(payload: LoginPayload): Promise<User> {
  const { data } = await axiosInstance.post<ApiResponse<AuthUserData>>(
    "/auth/login",
    payload,
  );
  return data.data!.user;
}

/** POST /auth/logout — clears the session cookies server-side. */
export async function logout(): Promise<void> {
  await axiosInstance.post("/auth/logout");
}

/** POST /auth/refresh — rotates cookies; returns the user. (Usually handled by
 *  the interceptor, exposed here for completeness.) */
export async function refresh(): Promise<User> {
  const { data } = await axiosInstance.post<ApiResponse<AuthUserData>>(
    "/auth/refresh",
  );
  return data.data!.user;
}

/** GET /users/me — the current session's user (used for session restore). */
export async function getCurrentUser(): Promise<User> {
  const { data } = await axiosInstance.get<ApiResponse<AuthUserData>>(
    "/users/me",
  );
  return data.data!.user;
}

/** POST /auth/forgot-password — emails a reset link (always succeeds). */
export async function forgotPassword(email: string): Promise<string> {
  const { data } = await axiosInstance.post<ApiResponse<never>>(
    "/auth/forgot-password",
    { email },
  );
  return data.message;
}

/** POST /auth/reset-password — sets a new password from the email token. */
export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<string> {
  const { data } = await axiosInstance.post<ApiResponse<never>>(
    "/auth/reset-password",
    payload,
  );
  return data.message;
}

/** POST /auth/verify-email — verifies the address from the email token. */
export async function verifyEmail(token: string): Promise<string> {
  const { data } = await axiosInstance.post<ApiResponse<never>>(
    "/auth/verify-email",
    { token },
  );
  return data.message;
}

/** POST /auth/resend-verification — re-sends the verification email. */
export async function resendVerification(email: string): Promise<string> {
  const { data } = await axiosInstance.post<ApiResponse<never>>(
    "/auth/resend-verification",
    { email },
  );
  return data.message;
}
