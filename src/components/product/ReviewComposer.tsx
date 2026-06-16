import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsAuthenticated } from "../../features/auth/authSlice";
import {
  useCreateReview,
  useDeleteReview,
  useMyReviews,
  useUpdateReview,
} from "../../hooks/useReviews";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import ReviewForm from "./ReviewForm";
import { PATHS } from "../../routes/paths";
import type { ReviewFormValues } from "../../validations/review.schema";

// ---------------------------------------------------------------------------
// ReviewComposer
// ---------------------------------------------------------------------------
// The write surface above the review list: prompts sign-in for guests; lets a
// signed-in user write one review, then edit/delete it (one review per product,
// enforced by the backend). `productId` is the product's _id.
// ---------------------------------------------------------------------------

const ReviewComposer = ({ productId }: { productId: string }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: myReviews } = useMyReviews();
  const myReview = myReviews?.find((r) => r.product?._id === productId);

  const createReview = useCreateReview(productId);
  const updateReview = useUpdateReview(productId);
  const deleteReview = useDeleteReview(productId);
  const { notify } = useSnackbar();

  const [mode, setMode] = useState<"idle" | "writing" | "editing">("idle");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const onError = (err: unknown) => notify(getErrorMessage(err), "error");

  // --- Guests --------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        <Link component={RouterLink} to={PATHS.login} underline="hover">
          Sign in
        </Link>{" "}
        to write a review.
      </Alert>
    );
  }

  const handleCreate = (values: ReviewFormValues) =>
    createReview.mutate(values, {
      onSuccess: () => {
        setMode("idle");
        notify("Review submitted", "success");
      },
      onError,
    });

  const handleUpdate = (values: ReviewFormValues) => {
    if (!myReview) return;
    updateReview.mutate(
      { reviewId: myReview._id, payload: values },
      {
        onSuccess: () => {
          setMode("idle");
          notify("Review updated", "success");
        },
        onError,
      },
    );
  };

  const handleDelete = () => {
    if (!myReview) return;
    deleteReview.mutate(myReview._id, {
      onSuccess: () => {
        setConfirmDelete(false);
        notify("Review deleted", "success");
      },
      onError,
    });
  };

  // --- Editing existing review ---------------------------------------------
  if (myReview && mode === "editing") {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Edit your review
        </Typography>
        <ReviewForm
          defaultValues={{ rating: myReview.rating, comment: myReview.comment ?? "" }}
          onSubmit={handleUpdate}
          onCancel={() => setMode("idle")}
          isSubmitting={updateReview.isPending}
          submitLabel="Save changes"
        />
      </Paper>
    );
  }

  // --- Existing review (read view + actions) -------------------------------
  if (myReview) {
    return (
      <>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 2 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Your review
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => setMode("editing")}>
                Edit
              </Button>
              <Button size="small" color="error" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            </Stack>
          </Stack>
          <Rating value={myReview.rating} readOnly size="small" sx={{ my: 1 }} />
          {myReview.comment && (
            <Typography variant="body2" color="text.secondary">
              {myReview.comment}
            </Typography>
          )}
        </Paper>

        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Delete your review?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              This can’t be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)} disabled={deleteReview.isPending}>
              Keep
            </Button>
            <Button color="error" variant="contained" onClick={handleDelete} loading={deleteReview.isPending}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // --- No review yet -------------------------------------------------------
  if (mode === "writing") {
    return (
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Write a review
        </Typography>
        <ReviewForm
          onSubmit={handleCreate}
          onCancel={() => setMode("idle")}
          isSubmitting={createReview.isPending}
        />
      </Paper>
    );
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Button variant="contained" onClick={() => setMode("writing")}>
        Write a review
      </Button>
    </Box>
  );
};

export default ReviewComposer;
