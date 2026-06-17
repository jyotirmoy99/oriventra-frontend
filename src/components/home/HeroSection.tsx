import { Link as RouterLink } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { alpha } from "@mui/material/styles";
import { brandGradient } from "../../theme/tokens";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
// Split photographic hero (minimalist/editorial): copy + CTAs on the clean
// canvas (left), a large lifestyle photo alongside (right) with a soft cool
// brand glow and a floating "rating" glass chip. The photo stacks below the
// copy on mobile. Staggered entrance for the copy; gentle scale-in for the art.
// ---------------------------------------------------------------------------

// Stable Unsplash CDN image (sized + format-optimized via query params).
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=80";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TRUST = ["Free shipping over $50", "Easy 30-day returns", "Secure checkout"];

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.default",
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
        // One subtle, cool brand glow — restrained, not colorful blobs.
        background: (t) =>
          `radial-gradient(900px 480px at 85% -10%, ${alpha(t.palette.primary.main, 0.1)}, transparent 60%)`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 12 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
            alignItems: "center",
            gap: { xs: 5, md: 8 },
          }}
        >
          {/* Copy */}
          <Stack
            component={motion.div}
            variants={container}
            initial="hidden"
            animate="show"
            spacing={3}
            sx={{ alignItems: { xs: "center", md: "flex-start" }, textAlign: { xs: "center", md: "left" } }}
          >
            <motion.div variants={item}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 1.75,
                  py: 0.5,
                  borderRadius: 999,
                  border: (t) => `1px solid ${alpha(t.palette.primary.main, 0.25)}`,
                  bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                  color: "primary.main",
                  fontWeight: 600,
                  fontSize: 13,
                  letterSpacing: 0.2,
                }}
              >
                <StarRoundedIcon sx={{ fontSize: 15 }} />
                New season · fresh finds
              </Box>
            </motion.div>

            <motion.div variants={item}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 40, sm: 54, md: 64 },
                  lineHeight: 1.05,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Everyday essentials,{" "}
                <Box
                  component="span"
                  sx={{
                    background: brandGradient,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  beautifully curated
                </Box>
              </Typography>
            </motion.div>

            <motion.div variants={item}>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontWeight: 400,
                  fontSize: { xs: 16, md: 18 },
                  maxWidth: 520,
                  lineHeight: 1.6,
                }}
              >
                A considered edit of products at honest prices — from the things
                you reach for daily to the pieces worth the wait.
              </Typography>
            </motion.div>

            <motion.div variants={item}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ pt: 0.5 }}
              >
                <Button
                  component={RouterLink}
                  to={PATHS.products}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ px: 3.5 }}
                >
                  Shop now
                </Button>
                <Button
                  component={RouterLink}
                  to={PATHS.products}
                  variant="outlined"
                  size="large"
                  color="inherit"
                  sx={{ px: 3.5, borderColor: "divider" }}
                >
                  Browse categories
                </Button>
              </Stack>
            </motion.div>

            <motion.div variants={item}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                  rowGap: 0.5,
                  color: "text.secondary",
                  fontSize: 13,
                }}
              >
                {TRUST.map((t, i) => (
                  <Box key={t} sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                    {i > 0 && (
                      <Box
                        component="span"
                        sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "text.disabled" }}
                      />
                    )}
                    <Box component="span">{t}</Box>
                  </Box>
                ))}
              </Stack>
            </motion.div>
          </Stack>

          {/* Photo */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            sx={{ position: "relative", order: { xs: -1, md: 0 } }}
          >
            {/* Soft brand glow offset behind the photo */}
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                transform: "translate(18px, 18px)",
                borderRadius: 6,
                background: brandGradient,
                opacity: 0.18,
                filter: "blur(8px)",
                display: { xs: "none", md: "block" },
              }}
            />
            <Box
              sx={{
                position: "relative",
                borderRadius: 6,
                overflow: "hidden",
                border: (t) => `1px solid ${t.palette.divider}`,
                boxShadow: (t) => `0 30px 60px -30px ${alpha(t.palette.common.black, 0.45)}`,
                aspectRatio: { xs: "16 / 11", md: "4 / 5" },
                bgcolor: "action.hover",
              }}
            >
              <Box
                component="img"
                src={HERO_IMAGE}
                alt="Curated seasonal fashion and lifestyle products"
                loading="eager"
                sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />

              {/* Floating glass rating chip */}
              <Box
                sx={{
                  position: "absolute",
                  left: 16,
                  bottom: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 3,
                  bgcolor: (t) => alpha(t.palette.background.paper, 0.85),
                  backdropFilter: "blur(8px)",
                  border: (t) => `1px solid ${alpha(t.palette.common.white, 0.4)}`,
                  boxShadow: (t) => `0 10px 24px -12px ${alpha(t.palette.common.black, 0.5)}`,
                }}
              >
                <StarRoundedIcon sx={{ fontSize: 18, color: "warning.main" }} />
                <Box sx={{ lineHeight: 1.1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    4.9 / 5
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    12k+ happy customers
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
