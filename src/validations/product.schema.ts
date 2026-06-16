import { z } from "zod";

// ---------------------------------------------------------------------------
// Admin product validation (matches the backend createProductSchema)
// ---------------------------------------------------------------------------
// Numeric fields are kept as validated STRINGS here (so the form's input and
// output types match — RHF + zodResolver dislike z.coerce's type divergence);
// the dialog converts them to numbers on submit. `tags` is comma-separated.
// ---------------------------------------------------------------------------

const isNonNegNumber = (v: string) => v.trim() !== "" && Number(v) >= 0 && !Number.isNaN(Number(v));

export const productSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(160),
  description: z.string().trim().min(10, "Description is too short (min 10 chars)"),
  brand: z.string().trim().max(80).optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(), // comma-separated
  price: z.string().refine(isNonNegNumber, "Enter a valid price"),
  compareAtPrice: z
    .string()
    .optional()
    .refine((v) => !v || isNonNegNumber(v), "Enter a valid amount"),
  stock: z
    .string()
    .refine(
      (v) => v.trim() !== "" && Number.isInteger(Number(v)) && Number(v) >= 0,
      "Enter a whole number ≥ 0",
    ),
  sku: z.string().trim().max(60).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
