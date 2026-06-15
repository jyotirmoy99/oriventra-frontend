import { useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useProductReviews } from "../../hooks/useReviews";
import type { Review, ReviewSort } from "../../types/review.types";

// ---------------------------------------------------------------------------
// ReviewsSection  (read-only — write/edit/delete arrive in Feature 10)
// ---------------------------------------------------------------------------
// Rating summary + sortable, paginated review list for a product. Takes the
// product's _id (the reviews endpoint requires it).
// ---------------------------------------------------------------------------

const PAGE_SIZE = 5;

const SORTS: { value: ReviewSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const ReviewItem = ({ review }: { review: Review }) => (
  <Box sx={{ py: 2 }}>
    <Stack direction="row" spacing={1.5}>
      <Avatar src={review.user.avatar?.url} alt={review.user.name} sx={{ width: 40, height: 40 }}>
        {review.user.name?.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
            {review.user.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(review.createdAt)}
          </Typography>
        </Box>
        <Rating value={review.rating} readOnly size="small" sx={{ my: 0.5 }} />
        {review.comment && (
          <Typography variant="body2" color="text.secondary">
            {review.comment}
          </Typography>
        )}
      </Box>
    </Stack>
  </Box>
);

interface ReviewsSectionProps {
  productId: string;
}

const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
  const [sort, setSort] = useState<ReviewSort>("newest");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useProductReviews(productId, {
    sort,
    page,
    limit: PAGE_SIZE,
  });

  const summary = data?.summary;
  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Customer reviews
      </Typography>

      {/* Summary header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 1 }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {(summary?.ratingAverage ?? 0).toFixed(1)}
          </Typography>
          <Box>
            <Rating value={summary?.ratingAverage ?? 0} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              {summary?.ratingCount ?? 0} review{summary?.ratingCount === 1 ? "" : "s"}
            </Typography>
          </Box>
        </Stack>

        {reviews.length > 0 && (
          <TextField
            select
            size="small"
            label="Sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as ReviewSort);
              setPage(1);
            }}
            sx={{ minWidth: 170 }}
          >
            {SORTS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>

      <Divider />

      {isError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Couldn’t load reviews right now.
        </Alert>
      ) : isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          No reviews yet — be the first to share your thoughts.
        </Typography>
      ) : (
        <Stack divider={<Divider />}>
          {reviews.map((review) => (
            <ReviewItem key={review._id} review={review} />
          ))}
        </Stack>
      )}

      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

export default ReviewsSection;
