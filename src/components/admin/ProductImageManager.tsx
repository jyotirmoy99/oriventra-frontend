import { useRef, useState, type ChangeEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useUploadProductImages, useRemoveProductImage } from "../../hooks/useAdmin";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import type { Product, ProductImage } from "../../types/product.types";

// ---------------------------------------------------------------------------
// ProductImageManager — upload (multipart, ≤6) and remove product images.
// ---------------------------------------------------------------------------

const MAX_IMAGES = 6;
const MAX_BYTES = 5 * 1024 * 1024;

const ProductImageManager = ({ product }: { product: Product }) => {
  const [images, setImages] = useState<ProductImage[]>(product.images);
  // Track the image currently being removed so we can show a spinner on it.
  const [removingId, setRemovingId] = useState<string | null>(null);
  const upload = useUploadProductImages();
  const remove = useRemoveProductImage();
  const { notify } = useSnackbar();
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    if (images.length + files.length > MAX_IMAGES) {
      notify(`Up to ${MAX_IMAGES} images per product`, "error");
      return;
    }
    if (files.some((f) => !f.type.startsWith("image/"))) {
      notify("Only image files are allowed", "error");
      return;
    }
    if (files.some((f) => f.size > MAX_BYTES)) {
      notify("Each image must be 5 MB or smaller", "error");
      return;
    }

    upload.mutate(
      { id: product._id, files },
      {
        onSuccess: (updated) => {
          setImages(updated.images);
          notify("Images uploaded", "success");
        },
        onError: (err) => notify(getErrorMessage(err), "error"),
      },
    );
  };

  const onRemove = (publicId: string) => {
    setRemovingId(publicId);
    remove.mutate(
      { id: product._id, publicId },
      {
        onSuccess: (updated) => {
          setImages(updated.images);
          notify("Image removed", "success");
        },
        onError: (err) => notify(getErrorMessage(err), "error"),
        onSettled: () => setRemovingId(null),
      },
    );
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        Images ({images.length}/{MAX_IMAGES})
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {images.map((img) => {
          const isRemoving = removingId === img.publicId;
          return (
            <Box
              key={img.publicId}
              sx={{
                position: "relative",
                width: 84,
                height: 84,
                borderRadius: 2,
                overflow: "hidden",
                border: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Box component="img" src={img.url} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <IconButton
                size="small"
                onClick={() => onRemove(img.publicId)}
                disabled={remove.isPending}
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

              {/* Loading overlay while this image is being removed */}
              {isRemoving && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: (t) => alpha(t.palette.background.paper, 0.6),
                  }}
                >
                  <CircularProgress size={22} />
                </Box>
              )}
            </Box>
          );
        })}

        {images.length < MAX_IMAGES && (
          <Button
            variant="outlined"
            onClick={() => inputRef.current?.click()}
            loading={upload.isPending}
            sx={{ width: 84, height: 84, minWidth: 0, flexDirection: "column", borderRadius: 2 }}
          >
            <AddPhotoAlternateRoundedIcon />
          </Button>
        )}
      </Box>
      <input ref={inputRef} type="file" accept="image/*" hidden multiple onChange={onPick} />
    </Box>
  );
};

export default ProductImageManager;
