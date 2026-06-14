import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ErrorBoundary from "../common/ErrorBoundary";
import AnimatedOutlet from "../common/AnimatedOutlet";
import { brandGradient } from "../../theme/tokens";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// AuthLayout
// ---------------------------------------------------------------------------
// Minimal, distraction-free shell for the auth pages (login, register, forgot/
// reset password, verify email). A soft brand-gradient backdrop with a centered
// card; no Navbar/Footer so users stay focused on the form. The actual forms
// render through the animated <Outlet /> (Feature 3).
// ---------------------------------------------------------------------------

const AuthLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
        // Faint brand wash behind the card.
        background: (t) =>
          `radial-gradient(1200px 600px at 50% -10%, ${t.palette.primary.main}22, transparent), ${t.palette.background.default}`,
      }}
    >
      <Container maxWidth="xs" disableGutters>
        {/* Brand mark links back to the storefront */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            component={RouterLink}
            to={PATHS.home}
            sx={{
              fontWeight: 800,
              textDecoration: "none",
              background: brandGradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Oriventra
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            border: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <ErrorBoundary>
            <AnimatedOutlet />
          </ErrorBoundary>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
