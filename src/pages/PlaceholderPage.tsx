import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

// ---------------------------------------------------------------------------
// PlaceholderPage
// ---------------------------------------------------------------------------
// Temporary stand-in used while a feature's real pages are still pending. Lets
// us wire and test the routing/layout/guards now; each usage is replaced by the
// real page in its feature.
// ---------------------------------------------------------------------------

interface PlaceholderPageProps {
  title: string;
  /** Which upcoming feature will flesh this out. */
  feature: string;
}

const PlaceholderPage = ({ title, feature }: PlaceholderPageProps) => {
  return (
    <Box sx={{ textAlign: "center", py: { xs: 6, md: 10 }, px: 2 }}>
      <Chip label={feature} color="primary" variant="outlined" sx={{ mb: 2 }} />
      <Typography variant="h3" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This page is coming soon.
      </Typography>
    </Box>
  );
};

export default PlaceholderPage;
