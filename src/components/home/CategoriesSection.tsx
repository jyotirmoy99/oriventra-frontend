import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import type { Category } from "../../types/category.types";
import { useCategories } from "../../hooks/useCategories";
import { productsSearchPath } from "../../routes/paths";
import SectionHeading from "./SectionHeading";

// ---------------------------------------------------------------------------
// CategoriesSection
// ---------------------------------------------------------------------------
// Grid of category tiles linking to the listing filtered by that category.
// Shows skeletons while loading and hides itself entirely if there are none.
// ---------------------------------------------------------------------------

// Link to the product listing filtered by category slug.
const categoryPath = (slug: string) => `/products?category=${encodeURIComponent(slug)}`;

const CategoryTile = ({ category }: { category: Category }) => (
  <Card sx={{ height: "100%" }}>
    <CardActionArea component={RouterLink} to={categoryPath(category.slug)} sx={{ height: "100%" }}>
      <Box
        sx={{
          aspectRatio: "4 / 3",
          backgroundImage: category.image?.url ? `url(${category.image.url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
          bgcolor: "action.hover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!category.image?.url && (
          <CategoryRoundedIcon sx={{ fontSize: 36, color: "text.disabled" }} />
        )}
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }} noWrap>
          {category.name}
        </Typography>
      </Box>
    </CardActionArea>
  </Card>
);

const CategoriesSection = () => {
  const { data: categories, isLoading, isError } = useCategories();

  // Nothing to show (and nothing useful to say) → render nothing.
  if (isError) return null;
  if (!isLoading && (!categories || categories.length === 0)) return null;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <SectionHeading
        title="Shop by category"
        subtitle="Find exactly what you’re looking for"
        actionLabel="All products"
        actionTo={productsSearchPath("")}
      />

      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 6, sm: 4, md: 2 }}>
                <Skeleton variant="rounded" sx={{ aspectRatio: "4 / 3", width: "100%" }} />
                <Skeleton width="70%" sx={{ mt: 1 }} />
              </Grid>
            ))
          : categories!.slice(0, 12).map((category) => (
              <Grid key={category._id} size={{ xs: 6, sm: 4, md: 2 }}>
                <CategoryTile category={category} />
              </Grid>
            ))}
      </Grid>
    </Container>
  );
};

export default CategoriesSection;
