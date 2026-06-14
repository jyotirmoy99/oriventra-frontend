import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ThemeToggleButton from "../components/common/ThemeToggleButton";
import { brandGradient } from "../theme/tokens";

// NOTE: Temporary demo content for verifying the Feature 1 theme system.
// This is replaced by the real Home feature (hero, featured grid, etc.) later.
const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
        {/* Brand-gradient headline to confirm tokens + gradient render */}
        <Typography
          variant="h1"
          sx={{
            background: brandGradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Oriventra
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Theme system is live. Toggle below — MUI components and Tailwind
          utilities both react to the same light/dark tokens, and your choice
          persists across reloads.
        </Typography>

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <ThemeToggleButton />
          <Chip label="Light / Dark" color="primary" variant="outlined" />
        </Stack>

        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: "wrap" }}>
          <Button variant="contained">Primary</Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="outlined">Outlined</Button>
        </Stack>

        {/* MUI Card (theme-driven) next to a Tailwind-only card (token-driven) */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: "100%" }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">MUI Card</Typography>
              <Typography variant="body2" color="text.secondary">
                Styled via the MUI theme palette.
              </Typography>
            </CardContent>
          </Card>

          <Box className="flex-1 rounded-xl border border-border bg-paper p-4">
            <p className="text-foreground font-semibold">Tailwind Card</p>
            <p className="text-muted text-sm">
              Styled via shared CSS-variable tokens.
            </p>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default HomePage;
