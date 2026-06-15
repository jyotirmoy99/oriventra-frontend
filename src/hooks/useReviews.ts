import { keepPreviousData, useQuery } from "@tanstack/react-query";
import * as reviewService from "../services/review.service";
import type { ReviewQueryParams } from "../types/review.types";

// ---------------------------------------------------------------------------
// Review query hooks
// ---------------------------------------------------------------------------

export const reviewKeys = {
  all: ["reviews"] as const,
  product: (productId: string, params: ReviewQueryParams) =>
    [...reviewKeys.all, "product", productId, params] as const,
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
