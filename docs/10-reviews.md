# Feature 10 — Reviews (write)

Add / edit / delete a product review with an interactive star rating, on the
product detail page. Builds on the read side from Feature 5.

---

## 1. File map

| File | Responsibility |
| --- | --- |
| `src/types/review.types.ts` | + `CreateReviewPayload`, `UpdateReviewPayload`, `MyReview`. |
| `src/services/review.service.ts` | + `listMyReviews`, `createReview`, `updateReview`, `deleteReview`. |
| `src/hooks/useReviews.ts` | + `useMyReviews`, `useCreateReview`, `useUpdateReview`, `useDeleteReview`. |
| `src/validations/review.schema.ts` | Rating (1–5) + optional comment. |
| `src/components/product/ReviewForm.tsx` | RHF + Zod form with MUI `Rating`. |
| `src/components/product/ReviewComposer.tsx` | Write surface (sign-in prompt / write / your-review + edit/delete). |
| `src/components/product/ReviewsSection.tsx` | Now renders the composer + filters out the user's own review. |

---

## 2. Behaviour

- **One review per product** (backend-enforced). `useMyReviews` (`GET /reviews/me`,
  product populated) finds the user's review for the current product by id.
- **`ReviewComposer`** states:
  - **Guest** → "Sign in to write a review" (links to login).
  - **No review yet** → "Write a review" → `ReviewForm` (create).
  - **Has a review** → a "Your review" card with **Edit** (inline form) and
    **Delete** (confirm dialog).
- **Star rating**: MUI `Rating` wired into RHF via `Controller` (required, 1–5);
  comment is optional (≤ 1000 chars).
- **Cache sync**: every write invalidates the product's review lists, the user's
  reviews, and **all product queries** (`productKeys.all`) — the product's
  `ratingAverage`/`ratingCount` (recomputed server-side) refresh on the detail
  page, cards, and listings.
- **No duplication**: the user's own review shows in the composer, so it's
  filtered out of the paginated list (the empty state adapts to "No other
  reviews yet").

---

## 3. How to test it

1. Sign in, open a product → scroll to **Customer reviews**.
2. **Write a review** → pick stars + comment → submit → it appears as "Your
   review"; the product's average rating updates (detail header, cards).
3. **Edit** it → change the rating → save → average updates.
4. **Delete** it (confirm) → it's gone; you can write a new one.
5. Sign out → the composer shows the sign-in prompt; reviews remain readable.
6. Try submitting with no stars → inline "Please select a rating".

---

## 4. Flags / decisions

- **One-per-product** matches the backend (a second create returns 409, surfaced
  as a toast). Admins can delete any review server-side; the UI exposes
  edit/delete only for the user's own.
- No external setup.
