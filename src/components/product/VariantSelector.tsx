import { useMemo } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import type { ProductVariant } from "../../types/product.types";

// ---------------------------------------------------------------------------
// VariantSelector
// ---------------------------------------------------------------------------
// Renders Size and/or Color choices derived from a product's variants. A value
// is disabled when no in-stock variant offers it (given the other current
// selection). Controlled by the parent, which resolves the matching variant.
// ---------------------------------------------------------------------------

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedSize?: string;
  selectedColor?: string;
  onSelectSize: (size?: string) => void;
  onSelectColor: (color?: string) => void;
}

const uniq = (values: (string | undefined)[]): string[] =>
  Array.from(new Set(values.filter((v): v is string => Boolean(v))));

const VariantSelector = ({
  variants,
  selectedSize,
  selectedColor,
  onSelectSize,
  onSelectColor,
}: VariantSelectorProps) => {
  const sizes = useMemo(() => uniq(variants.map((v) => v.size)), [variants]);
  const colors = useMemo(() => uniq(variants.map((v) => v.color)), [variants]);

  // A size is available if some in-stock variant has it (matching selected color).
  const sizeAvailable = (size: string) =>
    variants.some(
      (v) =>
        v.size === size &&
        v.stock > 0 &&
        (!selectedColor || v.color === selectedColor),
    );
  const colorAvailable = (color: string) =>
    variants.some(
      (v) =>
        v.color === color &&
        v.stock > 0 &&
        (!selectedSize || v.size === selectedSize),
    );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {sizes.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Size{selectedSize ? `: ${selectedSize}` : ""}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {sizes.map((size) => {
              const disabled = !sizeAvailable(size);
              const selected = selectedSize === size;
              return (
                <Chip
                  key={size}
                  label={size}
                  clickable={!disabled}
                  disabled={disabled}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                  onClick={() => onSelectSize(selected ? undefined : size)}
                />
              );
            })}
          </Box>
        </Box>
      )}

      {colors.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Color{selectedColor ? `: ${selectedColor}` : ""}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {colors.map((color) => {
              const disabled = !colorAvailable(color);
              const selected = selectedColor === color;
              return (
                <Chip
                  key={color}
                  label={color}
                  clickable={!disabled}
                  disabled={disabled}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                  onClick={() => onSelectColor(selected ? undefined : color)}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VariantSelector;
