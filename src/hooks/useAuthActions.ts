import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "./useAppDispatch";
import { clearAuth, setUser } from "../features/auth/authSlice";
import { mergeGuestCart } from "../features/cart/mergeGuestCart";
import { mergeGuestWishlist } from "../features/wishlist/mergeGuestWishlist";
import * as authService from "../services/auth.service";
import type {
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from "../types/auth.types";

// ---------------------------------------------------------------------------
// useAuthActions
// ---------------------------------------------------------------------------
// React Query mutation hooks for every auth action. Server interactions live in
// React Query (loading/error per call); on success they sync the user into the
// Redux auth slice (global UI state). Components own navigation via the
// `onSuccess` they pass to `.mutate()`.
// ---------------------------------------------------------------------------

/** Register → store user + merge any guest cart. */
export function useRegister() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: async (user) => {
      dispatch(setUser(user));
      await Promise.all([
        mergeGuestCart(queryClient),
        mergeGuestWishlist(queryClient),
      ]);
    },
  });
}

/** Login → store user + merge any guest cart. */
export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (user) => {
      dispatch(setUser(user));
      await Promise.all([
        mergeGuestCart(queryClient),
        mergeGuestWishlist(queryClient),
      ]);
    },
  });
}

/** Logout → clear auth + wipe any cached server state. */
export function useLogout() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    // Clear locally even if the network call fails — the user intends to leave.
    onSettled: () => {
      dispatch(clearAuth());
      queryClient.clear();
    },
  });
}

/** Forgot password → returns the backend's generic message. */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });
}

/** Reset password from the email token. */
export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      authService.resetPassword(payload),
  });
}

// Note: email verification is handled as a React Query *query* in
// VerifyEmailPage (one-shot, StrictMode-safe), not a mutation here.

/** Resend the verification email. */
export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  });
}
