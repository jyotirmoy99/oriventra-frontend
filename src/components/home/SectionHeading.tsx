import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

// ---------------------------------------------------------------------------
// SectionHeading
// ---------------------------------------------------------------------------
// Consistent title row for Home sections, with an optional "view all" link.
// ---------------------------------------------------------------------------

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionTo?: string;
}

const SectionHeading = ({ title, subtitle, actionLabel, actionTo }: SectionHeadingProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "flex-end" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {actionLabel && actionTo && (
        <Link
          component={RouterLink}
          to={actionTo}
          underline="hover"
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontWeight: 600, whiteSpace: "nowrap" }}
        >
          {actionLabel}
          <ArrowForwardRoundedIcon fontSize="small" />
        </Link>
      )}
    </Box>
  );
};

export default SectionHeading;
