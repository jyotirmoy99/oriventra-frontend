import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { productsSearchPath, PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// PromoBanners
// ---------------------------------------------------------------------------
// Two editorial promo cards (static marketing content) that animate in on
// scroll and link into the catalog. Stacks on mobile, side-by-side on md+.
// ---------------------------------------------------------------------------

interface Banner {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  to: string;
  gradient: string;
}

const BANNERS: Banner[] = [
  {
    eyebrow: "Limited time",
    title: "Season sale — up to 40% off",
    body: "Refresh your essentials with deals across every category.",
    cta: "Shop the sale",
    to: productsSearchPath(""),
    gradient: "linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)",
  },
  {
    eyebrow: "Just landed",
    title: "New arrivals you’ll love",
    body: "Be the first to explore our latest additions.",
    cta: "Explore new",
    to: PATHS.products,
    gradient: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
  },
];

const PromoBanners = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {BANNERS.map((banner, i) => (
          <Grid key={banner.title} size={{ xs: 12, md: 6 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                p: { xs: 3.5, md: 5 },
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "#fff",
                background: banner.gradient,
                // Soft light flares for depth.
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(420px 220px at 110% -10%, rgba(255,255,255,0.28), transparent 60%), radial-gradient(320px 200px at -10% 120%, rgba(255,255,255,0.18), transparent 60%)",
                  pointerEvents: "none",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Typography variant="overline" sx={{ opacity: 0.95, fontWeight: 700, letterSpacing: 1.5 }}>
                  {banner.eyebrow}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, maxWidth: 420, lineHeight: 1.15 }}>
                  {banner.title}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.95, mb: 3, maxWidth: 420 }}>
                  {banner.body}
                </Typography>
                <Button
                  component={RouterLink}
                  to={banner.to}
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    bgcolor: "#fff",
                    // Always-dark label so it stays readable on the white button
                    // in BOTH light and dark themes (don't use theme text color).
                    color: "#0F172A",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.88)" },
                  }}
                >
                  {banner.cta}
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PromoBanners;
