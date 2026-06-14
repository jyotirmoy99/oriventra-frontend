import { memo } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeMode } from "../../hooks/useThemeMode";

// ---------------------------------------------------------------------------
// ThemeToggleButton
// ---------------------------------------------------------------------------
// Header control that flips light/dark. The icon swaps with a small
// rotate + fade (Framer Motion) so the transition feels intentional. Memoized
// because it only depends on the theme context, not on parent re-renders.
// ---------------------------------------------------------------------------

const ThemeToggleButton = () => {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        aria-label="Toggle color theme"
        sx={{ width: 40, height: 40 }}
      >
        {/* AnimatePresence lets the outgoing icon animate out as the new one enters */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={mode}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ display: "inline-flex" }}
          >
            {isDark ? (
              <DarkModeRoundedIcon fontSize="small" />
            ) : (
              <LightModeRoundedIcon fontSize="small" />
            )}
          </motion.span>
        </AnimatePresence>
      </IconButton>
    </Tooltip>
  );
};

export default memo(ThemeToggleButton);
