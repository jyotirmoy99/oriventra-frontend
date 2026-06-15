import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import type { Product } from "../../types/product.types";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

// ---------------------------------------------------------------------------
// ProductGrid
// ---------------------------------------------------------------------------
// Responsive grid of ProductCards with loading skeletons and an empty state.
// Shared by the listing page and the related-products rail.
// ---------------------------------------------------------------------------

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
  /** Columns at the md breakpoint (12-grid units per card). Default 3. */
  mdSize?: number;
}

const ProductGrid = ({
  products,
  isLoading = false,
  skeletonCount = 12,
  emptyMessage = "No products found.",
  mdSize = 3,
}: ProductGridProps) => {
  if (isLoading) {
    return (
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: mdSize }}>
            <ProductCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
        <SearchOffRoundedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.6 }} />
        <Typography>{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {products.map((product) => (
        <Grid key={product._id} size={{ xs: 6, sm: 4, md: mdSize }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid;
