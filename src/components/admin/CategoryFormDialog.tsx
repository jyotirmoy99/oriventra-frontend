import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useCreateCategory, useUpdateCategory } from "../../hooks/useCategories";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import RHFTextField from "../form/RHFTextField";
import CategoryImageManager from "./CategoryImageManager";
import {
  categorySchema,
  type CategoryFormValues,
} from "../../validations/category.schema";
import type { Category, CategoryInput } from "../../types/category.types";

// ---------------------------------------------------------------------------
// CategoryFormDialog — create or edit a category (admin).
// ---------------------------------------------------------------------------
// The image is managed (upload/replace/remove) only when editing, since the
// image endpoint needs a category id. Create first, then edit to add an image.
// ---------------------------------------------------------------------------

// Cool, theme-friendly accent presets for the category pill.
const PRESET_COLORS = [
  "#4F46E5", // indigo
  "#0EA5E9", // sky
  "#14B8A6", // teal
  "#10B981", // emerald
  "#7C3AED", // violet
  "#F43F5E", // rose
  "#F59E0B", // amber
  "#0F172A", // ink
];

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category; // present → edit mode
}

const toFormValues = (category?: Category): CategoryFormValues =>
  category
    ? {
        name: category.name,
        description: category.description ?? "",
        color: category.color ?? "",
        isActive: category.isActive,
      }
    : { name: "", description: "", color: "", isActive: true };

const CategoryFormDialog = ({ open, onClose, category }: CategoryFormDialogProps) => {
  const isEdit = Boolean(category);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const { notify } = useSnackbar();

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    // `values` re-syncs the form when switching which category is edited.
    values: toFormValues(category),
  });

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const onSubmit = (values: CategoryFormValues) => {
    const payload: CategoryInput = {
      name: values.name,
      description: values.description?.trim() || undefined,
      // Send "" to clear an existing color; omit when creating without one.
      color: isEdit ? (values.color ?? "") : values.color || undefined,
      isActive: values.isActive,
    };

    const onError = (err: unknown) => notify(getErrorMessage(err), "error");
    if (isEdit && category) {
      updateCategory.mutate(
        { id: category._id, payload },
        {
          onSuccess: () => {
            notify("Category updated", "success");
            onClose();
          },
          onError,
        },
      );
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => {
          notify("Category created — edit it to add an image", "success");
          onClose();
        },
        onError,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit category" : "New category"}</DialogTitle>
      <DialogContent dividers>
        <FormProvider {...methods}>
          <Box component="form" id="category-form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <RHFTextField name="name" label="Name" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <RHFTextField name="description" label="Description (optional)" multiline minRows={3} />
              </Grid>

              {/* Accent color */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Accent color
                </Typography>
                <Controller
                  name="color"
                  control={methods.control}
                  render={({ field }) => (
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                      {PRESET_COLORS.map((c) => {
                        const selected = field.value?.toLowerCase() === c.toLowerCase();
                        return (
                          <Tooltip key={c} title={c}>
                            <Box
                              role="button"
                              aria-label={`Use ${c}`}
                              onClick={() => field.onChange(c)}
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: "50%",
                                cursor: "pointer",
                                bgcolor: c,
                                display: "grid",
                                placeItems: "center",
                                color: "#fff",
                                boxShadow: selected
                                  ? (t) => `0 0 0 2px ${t.palette.background.paper}, 0 0 0 4px ${c}`
                                  : "none",
                                transition: "transform .15s ease",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                            >
                              {selected && <CheckRoundedIcon sx={{ fontSize: 16 }} />}
                            </Box>
                          </Tooltip>
                        );
                      })}

                      {/* Custom color */}
                      <Tooltip title="Custom color">
                        <Box
                          component="label"
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            cursor: "pointer",
                            border: (t) => `1px dashed ${t.palette.divider}`,
                            display: "grid",
                            placeItems: "center",
                            overflow: "hidden",
                            background:
                              "conic-gradient(red, orange, yellow, lime, aqua, blue, magenta, red)",
                          }}
                        >
                          <Box
                            component="input"
                            type="color"
                            value={/^#[0-9a-fA-F]{6}$/.test(field.value ?? "") ? field.value : "#4F46E5"}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value)}
                            sx={{ opacity: 0, width: "100%", height: "100%", cursor: "pointer", border: 0, p: 0 }}
                          />
                        </Box>
                      </Tooltip>

                      {field.value ? (
                        <Button size="small" color="inherit" onClick={() => field.onChange("")}>
                          Clear
                        </Button>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          None
                        </Typography>
                      )}
                    </Stack>
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="isActive"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={!!field.value} onChange={field.onChange} />}
                      label="Active (visible in the storefront)"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
        </FormProvider>

        {/* Image (edit only) */}
        {isEdit && category && (
          <>
            <Divider sx={{ my: 3 }} />
            <CategoryImageManager category={category} />
          </>
        )}

        {!isEdit && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: (t) => alpha(t.palette.info.main, 0.08) }}>
            <Typography variant="caption" color="text.secondary">
              Save the category first, then edit it to upload an image.
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Close
        </Button>
        <Button type="submit" form="category-form" variant="contained" loading={isSubmitting}>
          {isEdit ? "Save changes" : "Create category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryFormDialog;
