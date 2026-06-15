import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";

// ---------------------------------------------------------------------------
// ProductCardSkeleton
// ---------------------------------------------------------------------------
// Loading placeholder matching ProductCard's shape, so grids don't jump when
// data arrives.
// ---------------------------------------------------------------------------

const ProductCardSkeleton = () => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Skeleton variant="rectangular" sx={{ aspectRatio: "1 / 1", width: "100%" }} />
      <CardContent sx={{ flex: 1 }}>
        <Skeleton width="40%" height={16} />
        <Skeleton width="90%" height={22} />
        <Skeleton width="60%" height={22} />
        <Box sx={{ mt: 1 }}>
          <Skeleton width="30%" height={28} />
        </Box>
      </CardContent>
      <Box sx={{ p: 1.5, pt: 0 }}>
        <Skeleton variant="rounded" height={40} />
      </Box>
    </Card>
  );
};

export default ProductCardSkeleton;
