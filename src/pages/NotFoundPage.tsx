import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { brandGradient } from "../theme/tokens";
import { PATHS } from "../routes/paths";

// ---------------------------------------------------------------------------
// NotFoundPage
// ---------------------------------------------------------------------------
// 404 page rendered as the storefront catch-all (inside RootLayout, so it keeps
// the Navbar/Footer chrome).
// ---------------------------------------------------------------------------

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: { xs: 8, md: 12 },
        px: 2,
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 96, md: 140 },
          fontWeight: 900,
          lineHeight: 1,
          background: brandGradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        404
      </Typography>
      <Typography variant="h4">Page not found</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420 }}>
        The page you’re looking for doesn’t exist or has been moved.
      </Typography>
      <Button component={RouterLink} to={PATHS.home} variant="contained" size="large">
        Back to home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
