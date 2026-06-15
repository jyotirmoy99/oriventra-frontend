import { useState } from "react";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";
import type { ProductImage } from "../../types/product.types";

// ---------------------------------------------------------------------------
// ProductGallery
// ---------------------------------------------------------------------------
// Main image + thumbnail strip. Clicking/hovering a thumbnail swaps the main
// image. Falls back to a placeholder when a product has no images.
// ---------------------------------------------------------------------------

interface ProductGalleryProps {
  images: ProductImage[];
  alt: string;
}

const ProductGallery = ({ images, alt }: ProductGalleryProps) => {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <Box>
      {/* Main image */}
      <Box
        sx={{
          aspectRatio: "1 / 1",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        {current ? (
          <Box
            component="img"
            src={current.url}
            alt={alt}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ImageNotSupportedRoundedIcon sx={{ fontSize: 56, color: "text.disabled" }} />
        )}
      </Box>

      {/* Thumbnails */}
      {images.length > 1 && (
        <Box sx={{ display: "flex", gap: 1, mt: 1.5, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <Box
              key={img.publicId || i}
              component="button"
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              sx={{
                p: 0,
                width: 64,
                height: 64,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "action.hover",
                border: (t) =>
                  `2px solid ${i === active ? t.palette.primary.main : "transparent"}`,
                boxShadow: (t) =>
                  i === active ? `0 0 0 1px ${alpha(t.palette.primary.main, 0.4)}` : "none",
              }}
            >
              <Box
                component="img"
                src={img.url}
                alt={`${alt} thumbnail ${i + 1}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductGallery;
