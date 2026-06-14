import { isRouteErrorResponse, useRouteError, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// RouteError
// ---------------------------------------------------------------------------
// React Router `errorElement`. Renders when a route's loader/action/render
// throws. Distinguishes HTTP-style route errors (404/500) from unexpected JS
// errors and always offers a way back home.
// ---------------------------------------------------------------------------

const RouteError = () => {
  const error = useRouteError();

  let title = "Unexpected error";
  let detail = "Something went wrong while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    detail =
      error.status === 404
        ? "We couldn't find the page you were looking for."
        : error.data?.message ?? detail;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
        px: 3,
      }}
    >
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
        {detail}
      </Typography>
      <Button component={RouterLink} to={PATHS.home} variant="contained">
        Back to home
      </Button>
    </Box>
  );
};

export default RouteError;
