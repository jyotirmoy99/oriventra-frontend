import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import Instagram from "@mui/icons-material/Instagram";
import X from "@mui/icons-material/X";
import { brandGradient } from "../../theme/tokens";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
// Multi-column site footer: brand blurb, shop/account link columns, social
// icons, and a legal bar. Collapses to a single column under `sm`.
// ---------------------------------------------------------------------------

// Link columns kept as data so the markup stays tidy and easy to extend.
const COLUMNS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "All Products", to: PATHS.products },
      { label: "Cart", to: PATHS.cart },
      { label: "Wishlist", to: PATHS.wishlist },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Profile", to: PATHS.profile },
      { label: "Orders", to: PATHS.orders },
      { label: "Login", to: PATHS.login },
    ],
  },
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: "background.paper",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 4, sm: 2 }}
          sx={{ justifyContent: "space-between" }}
        >
          {/* Brand blurb + socials */}
          <Box sx={{ maxWidth: 320 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                background: brandGradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                mb: 1,
              }}
            >
              Oriventra
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Curated products, effortless shopping. Quality you can trust,
              delivered to your door.
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <IconButton aria-label="Facebook" size="small" color="inherit">
                <FacebookRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton aria-label="Instagram" size="small" color="inherit">
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton aria-label="X" size="small" color="inherit">
                <X fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          {/* Link columns */}
          <Stack direction="row" spacing={{ xs: 6, sm: 8 }}>
            {COLUMNS.map((col) => (
              <Box key={col.heading}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 700, mb: 1.5 }}
                >
                  {col.heading}
                </Typography>
                <Stack spacing={1}>
                  {col.links.map((l) => (
                    <Link
                      key={l.label}
                      component={RouterLink}
                      to={l.to}
                      underline="none"
                      color="text.secondary"
                      variant="body2"
                      sx={{ "&:hover": { color: "primary.main" } }}
                    >
                      {l.label}
                    </Link>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Typography variant="caption" color="text.secondary">
          © {new Date().getFullYear()} Oriventra. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
