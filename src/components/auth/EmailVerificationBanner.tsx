import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import { useAuth } from "../../hooks/useAuth";
import { useResendVerification } from "../../hooks/useAuthActions";

// ---------------------------------------------------------------------------
// EmailVerificationBanner
// ---------------------------------------------------------------------------
// Shown across the storefront when a signed-in user hasn't verified their email
// (the backend lets them in but flags `isEmailVerified: false`). Offers a
// one-click resend and is dismissible for the session.
// ---------------------------------------------------------------------------

const EmailVerificationBanner = () => {
  const { user, isAuthenticated } = useAuth();
  const resend = useResendVerification();
  const [dismissed, setDismissed] = useState(false);

  const show = isAuthenticated && user != null && !user.isEmailVerified;

  return (
    <Collapse in={show && !dismissed} unmountOnExit>
      <Alert
        severity={resend.isSuccess ? "success" : "warning"}
        onClose={() => setDismissed(true)}
        sx={{ borderRadius: 0 }}
        action={
          resend.isSuccess ? undefined : (
            <Button
              color="inherit"
              size="small"
              loading={resend.isPending}
              onClick={() => user && resend.mutate(user.email)}
            >
              Resend
            </Button>
          )
        }
      >
        {resend.isSuccess
          ? resend.data
          : "Please verify your email address to secure your account."}
      </Alert>
    </Collapse>
  );
};

export default EmailVerificationBanner;
