import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import type { Category } from "../../types/category.types";
import { useCategories } from "../../hooks/useCategories";
import { productsSearchPath } from "../../routes/paths";
import SectionHeading from "./SectionHeading";

// ---------------------------------------------------------------------------
// CategoriesSection
// ---------------------------------------------------------------------------
// Minimalist round "category pill" rail (Myntra/Flipkart style): a circular
// image/icon with the name beneath it. Links to the listing filtered by that
// category. Skeletons while loading; hides itself entirely if there are none.
// ---------------------------------------------------------------------------

// Link to the product listing filtered by category slug.
const categoryPath = (slug: string) => `/products?category=${encodeURIComponent(slug)}`;

const PILL = { xs: 76, md: 96 };

const CategoryPill = ({ category }: { category: Category }) => {
  // The category's accent color drives the empty-state tint, icon, and hover
  // ring; falls back to the brand primary when no color is set.
  const accent = category.color;
  const hasImage = Boolean(category.image?.url);

  return (
  <Box
    component={RouterLink}
    to={categoryPath(category.slug)}
    sx={{
      textDecoration: "none",
      color: "text.primary",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      width: PILL,
      "&:hover .cat-circle": {
        transform: "translateY(-4px)",
        borderColor: accent ?? "primary.main",
        boxShadow: (t) =>
          `0 12px 24px -14px ${alpha(accent ?? t.palette.primary.main, 0.6)}`,
      },
      "&:hover .cat-label": { color: accent ?? "primary.main" },
    }}
  >
    <Box
      className="cat-circle"
      sx={{
        width: PILL,
        height: PILL,
        borderRadius: "50%",
        overflow: "hidden",
        border: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: accent && !hasImage ? alpha(accent, 0.12) : "background.paper",
        backgroundImage: hasImage ? `url(${category.image!.url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "grid",
        placeItems: "center",
        transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
      }}
    >
      {!hasImage && (
        <CategoryRoundedIcon
          sx={{ fontSize: 30, color: accent ?? "text.disabled" }}
        />
      )}
    </Box>
    <Typography
      className="cat-label"
      variant="caption"
      sx={{
        fontWeight: 600,
        textAlign: "center",
        lineHeight: 1.25,
        transition: "color .2s ease",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {category.name}
    </Typography>
  </Box>
  );
};

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

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2.5, md: 3.5 },
          justifyContent: { xs: "space-between", sm: "flex-start" },
        }}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: PILL }}>
                <Skeleton variant="circular" sx={{ width: PILL, height: PILL }} />
                <Skeleton width="80%" />
              </Box>
            ))
          : categories!.slice(0, 12).map((category) => (
              <CategoryPill key={category._id} category={category} />
            ))}
      </Box>
    </Container>
  );
};

export default CategoriesSection;
