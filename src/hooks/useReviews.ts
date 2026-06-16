import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAppSelector } from "./useAppSelector";
import { selectIsAuthenticated } from "../features/auth/authSlice";
import { productKeys } from "./useProducts";
import * as reviewService from "../services/review.service";
import type {
  CreateReviewPayload,
  ReviewQueryParams,
  UpdateReviewPayload,
} from "../types/review.types";

// ---------------------------------------------------------------------------
// Review hooks (read in Feature 5; write — create/edit/delete — here)
// ---------------------------------------------------------------------------

export const reviewKeys = {
  all: ["reviews"] as const,
  mine: ["reviews", "me"] as const,
  /** Prefix for all paginated lists of a product's reviews (for invalidation). */
  productAll: (productId: string) =>
    [...reviewKeys.all, "product", productId] as const,
  product: (productId: string, params: ReviewQueryParams) =>
    [...reviewKeys.productAll(productId), params] as const,
};

/** A product's reviews (+ pagination + summary). Pass the product's _id. */
export function useProductReviews(
  productId: string,
  params: ReviewQueryParams = {},
) {
  return useQuery({
    queryKey: reviewKeys.product(productId, params),
    queryFn: () => reviewService.listProductReviews(productId, params),
    enabled: Boolean(productId),
    placeholderData: keepPreviousData,
  });
}

/** The signed-in user's reviews (used to find their review for a product). */
export function useMyReviews() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return useQuery({
    queryKey: reviewKeys.mine,
    queryFn: reviewService.listMyReviews,
    enabled: isAuthenticated,
  });
}

// After any write, a product's rating changes — refresh its reviews, the user's
// reviews, and product data (detail/lists show ratingAverage/ratingCount).
function useReviewInvalidation(productId: string) {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: reviewKeys.productAll(productId) });
    queryClient.invalidateQueries({ queryKey: reviewKeys.mine });
    queryClient.invalidateQueries({ queryKey: productKeys.all });
  };
}

export function useCreateReview(productId: string) {
  const invalidate = useReviewInvalidation(productId);
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      reviewService.createReview(productId, payload),
    onSuccess: invalidate,
  });
}

export function useUpdateReview(productId: string) {
  const invalidate = useReviewInvalidation(productId);
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: string; payload: UpdateReviewPayload }) =>
      reviewService.updateReview(reviewId, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteReview(productId: string) {
  const invalidate = useReviewInvalidation(productId);
  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: invalidate,
  });
}
