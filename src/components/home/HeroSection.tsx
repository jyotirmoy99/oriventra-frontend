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
// Two-column landing hero: copy + CTAs on the left, an animated abstract
// visual on the right (md+). Soft brand-gradient backdrop, staggered entrance,
// and gently floating glass chips for a modern, "cool" feel. Fully responsive
// (the visual hides on small screens).
// ---------------------------------------------------------------------------

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const HeroSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background: (t) =>
          `radial-gradient(900px 500px at 15% 0%, ${alpha(t.palette.primary.main, 0.16)}, transparent 60%),
           radial-gradient(700px 500px at 100% 20%, ${alpha(t.palette.secondary.main, 0.14)}, transparent 55%)`,
      }}
    >
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 14 } }}>
        <Stack
          component={motion.div}
          variants={container}
          initial="hidden"
          animate="show"
          spacing={3}
          sx={{ alignItems: "center", textAlign: "center" }}
        >
          <motion.div variants={item}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                color: "primary.main",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 16 }} />
              New season, fresh finds
            </Box>
          </motion.div>

          <motion.div variants={item}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: 40, sm: 58, md: 72 },
                lineHeight: 1.05,
                fontWeight: 800,
              }}
            >
              Shop smarter with{" "}
              <Box
                component="span"
                sx={{
                  background: brandGradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Oriventra
              </Box>
            </Typography>
          </motion.div>

          <motion.div variants={item}>
            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                maxWidth: 620,
                mx: "auto",
              }}
            >
              Discover thoughtfully selected products at honest prices — from
              everyday essentials to standout finds, delivered to your door.
            </Typography>
          </motion.div>

          <motion.div variants={item}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 1, justifyContent: "center" }}
            >
              <Button
                component={RouterLink}
                to={PATHS.products}
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
              >
                Shop now
              </Button>
              <Button
                component={RouterLink}
                to={PATHS.products}
                variant="outlined"
                size="large"
              >
                Explore categories
              </Button>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
