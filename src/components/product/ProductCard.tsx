import { memo, type MouseEvent } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";
import type { Product } from "../../types/product.types";
import { useWishlistToggle } from "../../hooks/useWishlist";
import { useAddToCart } from "../../hooks/useCart";
import { formatCurrency, discountPercent } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// ProductCard  (shared — Home grid now, listing/related later)
// ---------------------------------------------------------------------------
// Modern storefront card: image with hover zoom, floating wishlist heart,
// discount/stock badges, clamped title, rating, price, and a full-width
// add-to-cart button. The image + text link to the detail page; the heart and
// cart button stop propagation. Memoized since grids render many.
// ---------------------------------------------------------------------------

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isWishlisted, toggle } = useWishlistToggle(product._id);
  const { addToCart } = useAddToCart();

  const discount = discountPercent(product.price, product.compareAtPrice);
  const cover = product.images[0]?.url;
  const outOfStock =
    product.stock <= 0 && product.variants.every((v) => v.stock <= 0);

  const onWishlist = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle();
  };
  const onAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Card
      component={motion.div}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        transition: "box-shadow .25s ease, border-color .25s ease",
        "&:hover": {
          boxShadow: (t) => `0 18px 40px -18px ${alpha(t.palette.primary.main, 0.45)}`,
          borderColor: (t) => alpha(t.palette.primary.main, 0.4),
        },
        // Zoom the cover on card hover.
        "&:hover .pc-image": { transform: "scale(1.07)" },
      }}
    >
      {/* Wishlist heart, floating top-right */}
      <Tooltip title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
        <IconButton
          onClick={onWishlist}
          aria-label="Toggle wishlist"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
            backdropFilter: "blur(4px)",
            "&:hover": { bgcolor: "background.paper" },
          }}
        >
          {isWishlisted ? (
            <FavoriteRoundedIcon fontSize="small" color="secondary" />
          ) : (
            <FavoriteBorderRoundedIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {/* Image (links to detail) */}
      <Box
        component={RouterLink}
        to={PATHS.productDetail(product.slug)}
        sx={{
          display: "block",
          position: "relative",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          bgcolor: "action.hover",
        }}
      >
        <Box
          className="pc-image"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: cover ? `url(${cover})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "transform .45s cubic-bezier(.2,.8,.2,1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!cover && (
            <ImageNotSupportedRoundedIcon sx={{ fontSize: 40, color: "text.disabled" }} />
          )}
        </Box>

        {/* Badges */}
        <Box sx={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 0.5, zIndex: 1 }}>
          {discount > 0 && (
            <Chip label={`-${discount}%`} color="secondary" size="small" sx={{ fontWeight: 700 }} />
          )}
          {outOfStock && (
            <Chip
              label="Sold out"
              size="small"
              sx={{ bgcolor: "rgba(0,0,0,0.7)", color: "#fff", fontWeight: 600 }}
            />
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 1.75, display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600 }}
          noWrap
        >
          {product.category?.name ?? " "}
        </Typography>

        <Typography
          component={RouterLink}
          to={PATHS.productDetail(product.slug)}
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            textDecoration: "none",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 40,
            "&:hover": { color: "primary.main" },
          }}
        >
          {product.name}
        </Typography>

        {/* Rating (reserve height so price rows align across cards) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minHeight: 22 }}>
          {product.ratingCount > 0 && (
            <>
              <Rating value={product.ratingAverage} precision={0.5} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                ({product.ratingCount})
              </Typography>
            </>
          )}
        </Box>

        {/* Price */}
        <Box sx={{ mt: "auto", display: "flex", alignItems: "baseline", gap: 1, pt: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {formatCurrency(product.price)}
          </Typography>
          {discount > 0 && product.compareAtPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              {formatCurrency(product.compareAtPrice)}
            </Typography>
          )}
        </Box>

        {/* Add to cart */}
        <Button
          onClick={onAddToCart}
          disabled={outOfStock}
          variant="contained"
          fullWidth
          disableElevation
          startIcon={<AddShoppingCartRoundedIcon />}
          sx={{ mt: 1.25, borderRadius: 2 }}
        >
          {outOfStock ? "Sold out" : "Add to cart"}
        </Button>
      </Box>
    </Card>
  );
};

export default memo(ProductCard);
