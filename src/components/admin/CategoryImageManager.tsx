import { useRef, type ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import { useUploadCategoryImage, useRemoveCategoryImage } from "../../hooks/useCategories";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Category } from "../../types/category.types";

// ---------------------------------------------------------------------------
// CategoryImageManager — upload / replace / remove a single category image.
// ---------------------------------------------------------------------------

const MAX_BYTES = 2 * 1024 * 1024; // matches the backend multer limit

const CategoryImageManager = ({ category }: { category: Category }) => {
  const upload = useUploadCategoryImage();
  const remove = useRemoveCategoryImage();
  const { notify } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  const imageUrl = category.image?.url;
  const busy = upload.isPending || remove.isPending;

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Only image files are allowed", "error");
      return;
    }
    if (file.size > MAX_BYTES) {
      notify("Image must be 2 MB or smaller", "error");
      return;
    }

    upload.mutate(
      { id: category._id, file },
      {
        onSuccess: () => notify("Category image updated", "success"),
        onError: (err) => notify(getErrorMessage(err), "error"),
      },
    );
  };

  const onRemove = () => {
    remove.mutate(category._id, {
      onSuccess: () => notify("Category image removed", "success"),
      onError: (err) => notify(getErrorMessage(err), "error"),
    });
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Image
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            position: "relative",
            width: 96,
            height: 96,
            borderRadius: 2,
            overflow: "hidden",
            border: (t) => `1px solid ${t.palette.divider}`,
            bgcolor: "action.hover",
            display: "grid",
            placeItems: "center",
          }}
        >
          {imageUrl ? (
            <>
              <Box component="img" src={imageUrl} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <IconButton
                size="small"
                onClick={onRemove}
                disabled={busy}
                aria-label="Remove image"
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
                  "&:hover": { bgcolor: "background.paper" },
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </>
          ) : (
            <CategoryRoundedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
          )}

          {busy && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                bgcolor: (t) => alpha(t.palette.background.paper, 0.6),
              }}
            >
              <CircularProgress size={22} />
            </Box>
          )}
        </Box>

        <Box>
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateRoundedIcon />}
            onClick={() => inputRef.current?.click()}
            loading={upload.isPending}
            disabled={busy}
          >
            {imageUrl ? "Replace image" : "Upload image"}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
            JPG or PNG, up to 2 MB.
          </Typography>
        </Box>
      </Box>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />
    </Box>
  );
};

export default CategoryImageManager;
