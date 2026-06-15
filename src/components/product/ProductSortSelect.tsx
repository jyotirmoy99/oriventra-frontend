import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { ProductSort } from "../../types/product.types";

// ---------------------------------------------------------------------------
// ProductSortSelect
// ---------------------------------------------------------------------------
// Sort dropdown for the listing. Values map 1:1 to the backend's PRODUCT_SORTS.
// ---------------------------------------------------------------------------

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "name", label: "Name: A–Z" },
];

interface ProductSortSelectProps {
  value: ProductSort;
  onChange: (sort: ProductSort) => void;
}

const ProductSortSelect = ({ value, onChange }: ProductSortSelectProps) => {
  return (
    <TextField
      select
      size="small"
      label="Sort by"
      value={value}
      onChange={(e) => onChange(e.target.value as ProductSort)}
      sx={{ minWidth: 190 }}
    >
      {SORT_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ProductSortSelect;
