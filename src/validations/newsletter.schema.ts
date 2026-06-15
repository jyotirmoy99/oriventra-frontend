import { z } from "zod";

// ---------------------------------------------------------------------------
// Newsletter validation
// ---------------------------------------------------------------------------
// Just an email. (There is no backend newsletter endpoint yet — the form
// confirms locally; see Newsletter.tsx.)
// ---------------------------------------------------------------------------

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
