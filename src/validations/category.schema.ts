import { z } from "zod";

// ---------------------------------------------------------------------------
// Category validation (admin create/edit) — mirrors the backend category schema
// ---------------------------------------------------------------------------

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name cannot exceed 80 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  // Empty string = "no accent color"; otherwise a 6-digit hex.
  color: z
    .union([
      z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex color"),
      z.literal(""),
    ])
    .optional(),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
