import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useFeaturedProducts } from "../../hooks/useProducts";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton";
import SectionHeading from "./SectionHeading";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// FeaturedProducts
// ---------------------------------------------------------------------------
// Grid of featured products for the Home page. Skeletons while loading, a quiet
// error alert on failure, and a friendly empty state when none are featured.
// ---------------------------------------------------------------------------

const SKELETON_COUNT = 8;

const FeaturedProducts = () => {
  const { data, isLoading, isError } = useFeaturedProducts(SKELETON_COUNT);
  const products = data?.products ?? [];

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <SectionHeading
          title="Featured products"
          subtitle="Hand-picked favourites our customers love"
          actionLabel="View all"
          actionTo={PATHS.products}
        />

        {isError ? (
          <Alert severity="error">
            We couldn’t load featured products right now. Please try again later.
          </Alert>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {isLoading
              ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                  <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
                    <ProductCardSkeleton />
                  </Grid>
                ))
              : products.map((product) => (
                  <Grid key={product._id} size={{ xs: 6, sm: 4, md: 3 }}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
          </Grid>
        )}

        {/* Empty state (loaded, no featured products) */}
        {!isLoading && !isError && products.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            No featured products yet — check back soon.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default FeaturedProducts;
