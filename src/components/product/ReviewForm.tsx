import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  reviewSchema,
  type ReviewFormValues,
} from "../../validations/review.schema";

// ---------------------------------------------------------------------------
// ReviewForm  (add / edit)
// ---------------------------------------------------------------------------
// Interactive star rating (MUI Rating via RHF Controller) + optional comment.
// The parent owns persistence (create vs update) and passes `onSubmit`.
// ---------------------------------------------------------------------------

interface ReviewFormProps {
  defaultValues?: Partial<ReviewFormValues>;
  onSubmit: (values: ReviewFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const ReviewForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = "Submit review",
}: ReviewFormProps) => {
  const { control, handleSubmit, register, formState } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: "", ...defaultValues },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Your rating
          </Typography>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <Rating
                value={field.value || 0}
                onChange={(_, value) => field.onChange(value ?? 0)}
                size="large"
              />
            )}
          />
          {formState.errors.rating && (
            <FormHelperText error>{formState.errors.rating.message}</FormHelperText>
          )}
        </Box>

        <TextField
          {...register("comment")}
          label="Your review (optional)"
          placeholder="Share your experience with this product…"
          fullWidth
          multiline
          minRows={3}
          error={Boolean(formState.errors.comment)}
          helperText={formState.errors.comment?.message}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
        />

        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ReviewForm;
