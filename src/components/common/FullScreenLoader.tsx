import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// ---------------------------------------------------------------------------
// FullScreenLoader
// ---------------------------------------------------------------------------
// Centered spinner used as the Suspense fallback for lazy routes and while the
// auth guards verify a session.
// ---------------------------------------------------------------------------

const FullScreenLoader = ({ label }: { label?: string }) => {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress color="primary" />
      {label ? (
        <Box component="span" sx={{ color: "text.secondary", fontSize: 14 }}>
          {label}
        </Box>
      ) : null}
    </Box>
  );
};

export default FullScreenLoader;
