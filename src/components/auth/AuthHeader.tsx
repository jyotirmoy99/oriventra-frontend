import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// ---------------------------------------------------------------------------
// AuthHeader
// ---------------------------------------------------------------------------
// Consistent title + subtitle block at the top of each auth form.
// ---------------------------------------------------------------------------

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
}

const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => (
  <Box sx={{ mb: 3, textAlign: "center" }}>
    <Typography variant="h5" sx={{ fontWeight: 700 }}>
      {title}
    </Typography>
    {subtitle ? (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {subtitle}
      </Typography>
    ) : null}
  </Box>
);

export default AuthHeader;
