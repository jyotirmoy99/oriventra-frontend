import { useMemo, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { useProduct } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { useWishlistToggle } from "../../hooks/useWishlist";
import ProductGallery from "../../components/product/ProductGallery";
import VariantSelector from "../../components/product/VariantSelector";
import QuantityPicker from "../../components/product/QuantityPicker";
import ReviewsSection from "../../components/product/ReviewsSection";
import RelatedProducts from "../../components/product/RelatedProducts";
import { formatCurrency, discountPercent } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// ProductDetailPage  (/products/:slug)
// ---------------------------------------------------------------------------
// Gallery + buy box (price, variant selector, quantity, add-to-cart, wishlist)
// + description, then reviews and related products. The route param is the
// product slug, but `useProduct` accepts an id or slug, so both work.
// ---------------------------------------------------------------------------

const uniq = (values: (string | undefined)[]): string[] =>
  Array.from(new Set(values.filter((v): v is string => Boolean(v))));

const ProductDetailPage = () => {
  const { slug = "" } = useParams();
  const { data: product, isLoading, isError } = useProduct(slug);

  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlistToggle(product);

  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);

  const variants = useMemo(() => product?.variants ?? [], [product]);
  const sizes = useMemo(() => uniq(variants.map((v) => v.size)), [variants]);
  const colors = useMemo(() => uniq(variants.map((v) => v.color)), [variants]);

  // Resolve the chosen variant once the required dimensions are picked.
  const selectionComplete =
    (sizes.length === 0 || !!selectedSize) && (colors.length === 0 || !!selectedColor);
  const selectedVariant =
    variants.length > 0 && selectionComplete
      ? variants.find(
          (v) =>
            (sizes.length === 0 || v.size === selectedSize) &&
            (colors.length === 0 || v.color === selectedColor),
        )
      : undefined;

  // --- Loading / error states ----------------------------------------------
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="rounded" sx={{ aspectRatio: "1 / 1", width: "100%" }} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton width="40%" height={20} />
            <Skeleton width="80%" height={48} />
            <Skeleton width="30%" height={36} sx={{ my: 2 }} />
            <Skeleton width="100%" height={80} />
            <Skeleton variant="rounded" height={48} sx={{ mt: 3 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Product not found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          This product may have been removed or the link is incorrect.
        </Typography>
        <Button component={RouterLink} to={PATHS.products} variant="contained">
          Back to shop
        </Button>
      </Container>
    );
  }

  const discount = discountPercent(product.price, product.compareAtPrice);
  const effectivePrice = selectedVariant?.price ?? product.price;
  const effectiveStock =
    variants.length > 0 ? selectedVariant?.stock ?? 0 : product.stock;
  const needsSelection = variants.length > 0 && !selectedVariant;
  const inStock = effectiveStock > 0;
  const canAddToCart = inStock && !needsSelection;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, Math.min(quantity, effectiveStock || 1));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to={PATHS.home} underline="hover" color="text.secondary">
          Home
        </Link>
        <Link component={RouterLink} to={PATHS.products} underline="hover" color="text.secondary">
          Shop
        </Link>
        {product.category && (
          <Link
            component={RouterLink}
            to={`/products?category=${product.category.slug}`}
            underline="hover"
            color="text.secondary"
          >
            {product.category.name}
          </Link>
        )}
        <Typography color="text.primary" noWrap sx={{ maxWidth: 200 }}>
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 3, md: 5 }}>
        {/* Gallery */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ProductGallery images={product.images} alt={product.name} />
        </Grid>

        {/* Buy box */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2}>
            {product.brand && (
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                {product.brand}
              </Typography>
            )}

            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {product.name}
            </Typography>

            {/* Rating */}
            {product.ratingCount > 0 && (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Rating value={product.ratingAverage} precision={0.5} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {product.ratingAverage.toFixed(1)} ({product.ratingCount} review
                  {product.ratingCount === 1 ? "" : "s"})
                </Typography>
              </Stack>
            )}

            {/* Price */}
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "baseline" }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {formatCurrency(effectivePrice)}
              </Typography>
              {discount > 0 && product.compareAtPrice && (
                <>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through", fontWeight: 400 }}
                  >
                    {formatCurrency(product.compareAtPrice)}
                  </Typography>
                  <Chip label={`-${discount}%`} color="secondary" size="small" />
                </>
              )}
            </Stack>

            <Typography variant="body1" color="text.secondary">
              {product.description}
            </Typography>

            {variants.length > 0 && (
              <>
                <Divider />
                <VariantSelector
                  variants={variants}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  onSelectSize={setSelectedSize}
                  onSelectColor={setSelectedColor}
                />
              </>
            )}

            {/* Stock hint */}
            <Typography variant="body2" sx={{ color: inStock ? "success.main" : "error.main", fontWeight: 600 }}>
              {needsSelection
                ? "Select options to see availability"
                : inStock
                  ? `In stock${effectiveStock <= 5 ? ` — only ${effectiveStock} left` : ""}`
                  : "Out of stock"}
            </Typography>

            {/* Quantity + actions */}
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <QuantityPicker
                value={Math.min(quantity, Math.max(effectiveStock, 1))}
                max={Math.max(effectiveStock, 1)}
                onChange={setQuantity}
              />
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartRoundedIcon />}
                disabled={!canAddToCart}
                onClick={handleAddToCart}
                sx={{ flex: 1, minWidth: 180 }}
              >
                {needsSelection ? "Select options" : inStock ? "Add to cart" : "Out of stock"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={toggle}
                aria-label="Toggle wishlist"
                sx={{ minWidth: 0, px: 2 }}
              >
                {isWishlisted ? (
                  <FavoriteRoundedIcon color="secondary" />
                ) : (
                  <FavoriteBorderRoundedIcon />
                )}
              </Button>
            </Stack>

            {/* Tags */}
            {product.tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, pt: 1 }}>
                {product.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    component={RouterLink}
                    to={`/products?tags=${encodeURIComponent(tag)}`}
                    clickable
                  />
                ))}
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      <Divider sx={{ my: { xs: 5, md: 7 } }} />
      <ReviewsSection productId={product._id} />

      <Divider sx={{ my: { xs: 5, md: 7 } }} />
      <RelatedProducts categorySlug={product.category.slug} currentProductId={product._id} />
    </Container>
  );
};

export default ProductDetailPage;
