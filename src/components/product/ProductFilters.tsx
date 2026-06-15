import { useState, type KeyboardEvent } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { Category } from "../../types/category.types";
import type { ProductFiltersState } from "../../hooks/useProductFilters";

// ---------------------------------------------------------------------------
// ProductFilters
// ---------------------------------------------------------------------------
// Controlled filter sidebar. Category / price / tags / in-stock map to backend
// query params; the rating filter is client-side (the backend product query has
// no rating param) and is labelled as such.
// ---------------------------------------------------------------------------

interface ProductFiltersProps {
  filters: ProductFiltersState;
  update: (patch: Partial<ProductFiltersState>) => void;
  reset: () => void;
  hasActiveFilters: boolean;
  categories: Category[];
  /** Tag suggestions (derived from the current results). */
  tagSuggestions: string[];
}

// Small labelled group wrapper.
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box sx={{ py: 2 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const ProductFilters = ({
  filters,
  update,
  reset,
  hasActiveFilters,
  categories,
  tagSuggestions,
}: ProductFiltersProps) => {
  // Local, editable copies of the price inputs (commit on blur / Enter).
  const [minStr, setMinStr] = useState(filters.minPrice?.toString() ?? "");
  const [maxStr, setMaxStr] = useState(filters.maxPrice?.toString() ?? "");

  // Keep inputs in sync if the URL changes elsewhere (e.g. Clear all) by
  // adjusting state during render — React's recommended alternative to an
  // effect that just mirrors a prop.
  const [prevMin, setPrevMin] = useState(filters.minPrice);
  const [prevMax, setPrevMax] = useState(filters.maxPrice);
  if (filters.minPrice !== prevMin) {
    setPrevMin(filters.minPrice);
    setMinStr(filters.minPrice?.toString() ?? "");
  }
  if (filters.maxPrice !== prevMax) {
    setPrevMax(filters.maxPrice);
    setMaxStr(filters.maxPrice?.toString() ?? "");
  }

  const commitPrice = () => {
    update({
      minPrice: minStr.trim() ? Number(minStr) : undefined,
      maxPrice: maxStr.trim() ? Number(maxStr) : undefined,
    });
  };
  const onPriceKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") commitPrice();
  };

  const toggleTag = (tag: string) => {
    const next = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    update({ tags: next });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Filters
        </Typography>
        {hasActiveFilters && (
          <Button size="small" onClick={reset}>
            Clear all
          </Button>
        )}
      </Box>

      <Divider />

      {/* Category */}
      <Section title="Category">
        <RadioGroup
          value={filters.category}
          onChange={(e) => update({ category: e.target.value })}
        >
          <FormControlLabel value="" control={<Radio size="small" />} label="All categories" />
          {categories.map((c) => (
            <FormControlLabel
              key={c._id}
              value={c.slug}
              control={<Radio size="small" />}
              label={c.name}
            />
          ))}
        </RadioGroup>
      </Section>

      <Divider />

      {/* Price range */}
      <Section title="Price range">
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <TextField
            size="small"
            type="number"
            label="Min"
            value={minStr}
            onChange={(e) => setMinStr(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={onPriceKeyDown}
            slotProps={{ htmlInput: { min: 0 } }}
          />
          <Typography color="text.secondary">–</Typography>
          <TextField
            size="small"
            type="number"
            label="Max"
            value={maxStr}
            onChange={(e) => setMaxStr(e.target.value)}
            onBlur={commitPrice}
            onKeyDown={onPriceKeyDown}
            slotProps={{ htmlInput: { min: 0 } }}
          />
        </Stack>
      </Section>

      <Divider />

      {/* Rating (client-side) */}
      <Section title="Rating">
        <RadioGroup
          value={String(filters.rating)}
          onChange={(e) => update({ rating: Number(e.target.value) })}
        >
          <FormControlLabel value="0" control={<Radio size="small" />} label="Any rating" />
          {[4, 3, 2, 1].map((r) => (
            <FormControlLabel
              key={r}
              value={String(r)}
              control={<Radio size="small" />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Rating value={r} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    &amp; up
                  </Typography>
                </Box>
              }
            />
          ))}
        </RadioGroup>
      </Section>

      {tagSuggestions.length > 0 && (
        <>
          <Divider />
          <Section title="Tags">
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {tagSuggestions.map((tag) => {
                const active = filters.tags.includes(tag);
                return (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    color={active ? "primary" : "default"}
                    variant={active ? "filled" : "outlined"}
                    onClick={() => toggleTag(tag)}
                  />
                );
              })}
            </Box>
          </Section>
        </>
      )}

      <Divider />

      {/* In stock */}
      <Section title="Availability">
        <FormControlLabel
          control={
            <Switch
              checked={filters.inStock}
              onChange={(e) => update({ inStock: e.target.checked })}
            />
          }
          label="In stock only"
        />
      </Section>
    </Box>
  );
};

export default ProductFilters;
