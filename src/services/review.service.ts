import axiosInstance from "../utils/axiosInstance";
import type { ApiResponse } from "../types";
import type {
  CreateReviewPayload,
  MyReview,
  Review,
  ReviewListResult,
  ReviewQueryParams,
  UpdateReviewPayload,
} from "../types/review.types";

// ---------------------------------------------------------------------------
// review.service
// ---------------------------------------------------------------------------
// Public review listing for a product. `productId` must be the Mongo _id (the
// endpoint validates it), so callers pass product._id (not the slug).
// Create/update/delete arrive with Feature 10.
// ---------------------------------------------------------------------------

/** GET /reviews/product/:productId — reviews + pagination + rating summary. */
export async function listProductReviews(
  productId: string,
  params: ReviewQueryParams = {},
): Promise<ReviewListResult> {
  const { data } = await axiosInstance.get<ApiResponse<ReviewListResult>>(
    `/reviews/product/${productId}`,
    { params },
  );
  return data.data!;
}

/** GET /reviews/me — the current user's reviews (product populated). */
export async function listMyReviews(): Promise<MyReview[]> {
  const { data } = await axiosInstance.get<ApiResponse<{ reviews: MyReview[] }>>(
    "/reviews/me",
  );
  return data.data!.reviews;
}

/** POST /reviews/product/:productId — create a review (one per user/product). */
export async function createReview(
  productId: string,
  payload: CreateReviewPayload,
): Promise<Review> {
  const { data } = await axiosInstance.post<ApiResponse<{ review: Review }>>(
    `/reviews/product/${productId}`,
    payload,
  );
  return data.data!.review;
}

/** PATCH /reviews/:reviewId — edit your review. */
export async function updateReview(
  reviewId: string,
  payload: UpdateReviewPayload,
): Promise<Review> {
  const { data } = await axiosInstance.patch<ApiResponse<{ review: Review }>>(
    `/reviews/${reviewId}`,
    payload,
  );
  return data.data!.review;
}

/** DELETE /reviews/:reviewId — delete your review. */
export async function deleteReview(reviewId: string): Promise<void> {
  await axiosInstance.delete(`/reviews/${reviewId}`);
}
