import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";

// ---------------------------------------------------------------------------
// StatCard — a single dashboard KPI (icon + value + label).
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: string;
  icon: SvgIconComponent;
  /** Theme palette color key for the icon tint. */
  color?: "primary" | "secondary" | "success" | "warning" | "info";
}

const StatCard = ({ label, value, icon: Icon, color = "primary" }: StatCardProps) => (
  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, height: "100%" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: 2.5,
          display: "grid",
          placeItems: "center",
          color: `${color}.main`,
          bgcolor: (t) => alpha(t.palette[color].main, 0.12),
          flexShrink: 0,
        }}
      >
        <Icon />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export default StatCard;
