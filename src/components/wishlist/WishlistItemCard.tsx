import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ImageNotSupportedRoundedIcon from "@mui/icons-material/ImageNotSupportedRounded";
import { formatCurrency } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";
import type { WishlistItem } from "../../types/wishlist.types";

// ---------------------------------------------------------------------------
// WishlistItemCard — one product on the wishlist page.
// ---------------------------------------------------------------------------

interface WishlistItemCardProps {
  item: WishlistItem;
  onRemove: (productId: string) => void;
}

const WishlistItemCard = ({ item, onRemove }: WishlistItemCardProps) => {
  const to = PATHS.productDetail(item.slug);

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", position: "relative", borderRadius: 3 }}>
      <Tooltip title="Remove from wishlist">
        <IconButton
          onClick={() => onRemove(item.productId)}
          aria-label="Remove from wishlist"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
            "&:hover": { bgcolor: "background.paper" },
          }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box
        component={RouterLink}
        to={to}
        sx={{
          display: "flex",
          aspectRatio: "1 / 1",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          backgroundImage: item.image ? `url(${item.image})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!item.image && <ImageNotSupportedRoundedIcon sx={{ fontSize: 40, color: "text.disabled" }} />}
      </Box>

      <Box sx={{ p: 1.75, display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
        <Typography
          component={RouterLink}
          to={to}
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
          {item.name}
        </Typography>

        {item.ratingAverage > 0 && (
          <Rating value={item.ratingAverage} precision={0.5} size="small" readOnly />
        )}

        <Typography variant="h6" sx={{ fontWeight: 800, mt: "auto" }}>
          {formatCurrency(item.price)}
        </Typography>

        <Button component={RouterLink} to={to} variant="contained" fullWidth sx={{ mt: 1, borderRadius: 2 }}>
          View product
        </Button>
      </Box>
    </Card>
  );
};

export default WishlistItemCard;
