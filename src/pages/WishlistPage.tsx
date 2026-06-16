import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useWishlist } from "../hooks/useWishlist";
import WishlistItemCard from "../components/wishlist/WishlistItemCard";
import { PATHS } from "../routes/paths";

// ---------------------------------------------------------------------------
// WishlistPage  (/wishlist — public; guests see their local wishlist)
// ---------------------------------------------------------------------------

const WishlistPage = () => {
  const { items, isLoading, isEmpty, remove } = useWishlist();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5 }}>
        Wishlist
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Products you’ve saved for later.
      </Typography>

      {isLoading ? (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
              <Skeleton variant="rounded" sx={{ aspectRatio: "3 / 4", width: "100%" }} />
            </Grid>
          ))}
        </Grid>
      ) : isEmpty ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <FavoriteBorderRoundedIcon sx={{ fontSize: 56, mb: 1, opacity: 0.6 }} />
          <Typography sx={{ mb: 2 }}>Your wishlist is empty.</Typography>
          <Button component={RouterLink} to={PATHS.products} variant="contained">
            Discover products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {items.map((item) => (
            <Grid key={item.productId} size={{ xs: 6, sm: 4, md: 3 }}>
              <WishlistItemCard item={item} onRemove={remove} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WishlistPage;
