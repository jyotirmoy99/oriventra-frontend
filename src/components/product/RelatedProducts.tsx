import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useProducts } from "../../hooks/useProducts";
import ProductGrid from "./ProductGrid";

// ---------------------------------------------------------------------------
// RelatedProducts
// ---------------------------------------------------------------------------
// Products from the same category, excluding the one being viewed. Hides itself
// when there are no others to show.
// ---------------------------------------------------------------------------

interface RelatedProductsProps {
  categorySlug: string;
  currentProductId: string;
}

const RelatedProducts = ({ categorySlug, currentProductId }: RelatedProductsProps) => {
  const { data, isLoading } = useProducts({ category: categorySlug, limit: 8 });

  // Drop the current product from the list.
  const related = useMemo(
    () => (data?.products ?? []).filter((p) => p._id !== currentProductId).slice(0, 4),
    [data, currentProductId],
  );

  // Nothing related (once loaded) → render nothing.
  if (!isLoading && related.length === 0) return null;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        You may also like
      </Typography>
      <ProductGrid products={related} isLoading={isLoading} skeletonCount={4} />
    </Box>
  );
};

export default RelatedProducts;
