import { z } from "zod";

// ---------------------------------------------------------------------------
// Profile validation (matches the backend updateProfileSchema)
// ---------------------------------------------------------------------------
// Name is required here (always present); phone is optional but, when given,
// must be 5–20 chars. Empty phone is allowed and omitted on submit.
// ---------------------------------------------------------------------------

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  phone: z
    .string()
    .trim()
    .max(20, "Phone is too long")
    .refine((v) => v === "" || v.length >= 5, "Phone must be at least 5 characters")
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
