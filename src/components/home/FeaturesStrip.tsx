import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import type { SvgIconComponent } from "@mui/icons-material";

// ---------------------------------------------------------------------------
// FeaturesStrip
// ---------------------------------------------------------------------------
// Trust signals (shipping, secure checkout, returns, support). Sits under the
// hero. Four across on md+, two on xs.
// ---------------------------------------------------------------------------

const FEATURES: { icon: SvgIconComponent; title: string; subtitle: string }[] = [
  { icon: LocalShippingRoundedIcon, title: "Free shipping", subtitle: "On orders over $50" },
  { icon: LockRoundedIcon, title: "Secure checkout", subtitle: "Encrypted payments" },
  { icon: AutorenewRoundedIcon, title: "Easy returns", subtitle: "30-day policy" },
  { icon: SupportAgentRoundedIcon, title: "24/7 support", subtitle: "We're here to help" },
];

const FeaturesStrip = () => {
  return (
    <Box sx={{ borderBottom: (t) => `1px solid ${t.palette.divider}`, bgcolor: "background.paper" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Grid container spacing={2}>
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <Grid key={f.title} size={{ xs: 6, md: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      color: "primary.main",
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.1),
                    }}
                  >
                    <Icon />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }} noWrap>
                      {f.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {f.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesStrip;
