import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ErrorBoundary from "../common/ErrorBoundary";
import AnimatedOutlet from "../common/AnimatedOutlet";

// ---------------------------------------------------------------------------
// RootLayout
// ---------------------------------------------------------------------------
// The public storefront shell: sticky Navbar, animated page content, Footer.
// A flex column keeps the footer pinned to the bottom on short pages. The
// content region is wrapped in an ErrorBoundary (rule (n)) so a crash in one
// page never takes down the chrome.
// ---------------------------------------------------------------------------

const RootLayout = () => {
  return (
    <Box
      sx={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Navbar />
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ErrorBoundary>
          <AnimatedOutlet />
        </ErrorBoundary>
      </Box>
      <Footer />
    </Box>
  );
};

export default RootLayout;
