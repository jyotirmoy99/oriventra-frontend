import { z } from "zod";

// ---------------------------------------------------------------------------
// Auth form schemas (Zod v4)
// ---------------------------------------------------------------------------
// Mirror the backend's auth validation, plus frontend-only UX niceties like a
// confirm-password field. Field rules (email format, password length) match the
// backend so the client never accepts something the server will reject.
// ---------------------------------------------------------------------------

// Reusable field schemas.
const email = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .toLowerCase();

// Backend requires 8–128 chars; we match it (and message accordingly).
const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

// --- Register ---------------------------------------------------------------
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name is too long"),
    email,
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attach the error to the confirm field
  });

// --- Login ------------------------------------------------------------------
export const loginSchema = z.object({
  email,
  // Don't reveal length rules on login — any non-empty password is allowed.
  password: z.string().min(1, "Password is required"),
});

// --- Forgot password --------------------------------------------------------
export const forgotPasswordSchema = z.object({ email });

// --- Reset password (token comes from the URL, not the form) ----------------
export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// --- Resend verification ----------------------------------------------------
export const resendVerificationSchema = z.object({ email });

// Inferred form-value types (used with React Hook Form).
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ResendVerificationFormValues = z.infer<
  typeof resendVerificationSchema
>;
