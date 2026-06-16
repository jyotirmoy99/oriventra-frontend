import { z } from "zod";

// ---------------------------------------------------------------------------
// Review validation (matches the backend createReviewSchema)
// ---------------------------------------------------------------------------

export const reviewSchema = z.object({
  rating: z
    .number({ message: "Please select a rating" })
    .int()
    .min(1, "Please select a rating")
    .max(5),
  comment: z.string().trim().max(1000, "Comment is too long").optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
