import { useEffect } from "react";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AuthHeader from "../../components/auth/AuthHeader";
import ResendVerificationForm from "../../components/auth/ResendVerificationForm";
import * as authService from "../../services/auth.service";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PATHS } from "../../routes/paths";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCurrentUser, setUser } from "../../features/auth/authSlice";

// ---------------------------------------------------------------------------
// VerifyEmailPage
// ---------------------------------------------------------------------------
// Lands from the email link (CLIENT_URL/verify-email?token=…) and verifies the
// token automatically. We model the one-shot verification as a React Query
// query (NOT a mutation-in-effect): it's keyed by the token, so it runs exactly
// once and — crucially — survives React StrictMode's mount/unmount/remount with
// its result intact (a mutation fired from useEffect would reset to idle on the
// remount and hang the loader). `retry: false` so a bad/expired token fails fast
// rather than retrying a single-use token.
// ---------------------------------------------------------------------------

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  const { isSuccess, isError, error } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => authService.verifyEmail(token),
    enabled: Boolean(token), // don't run without a token
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // If the user verified while signed in (same browser), reflect it in the
  // store immediately so the EmailVerificationBanner disappears without needing
  // a page refresh. The guard prevents this from looping after the update.
  useEffect(() => {
    if (isSuccess && currentUser && !currentUser.isEmailVerified) {
      dispatch(setUser({ ...currentUser, isEmailVerified: true }));
    }
  }, [isSuccess, currentUser, dispatch]);

  // No token at all.
  if (!token) {
    return (
      <>
        <AuthHeader title="Verify email" />
        <Alert severity="error">
          This verification link is invalid. Please use the link from your email.
        </Alert>
      </>
    );
  }

  // Verified!
  if (isSuccess) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <CheckCircleRoundedIcon color="success" sx={{ fontSize: 56, mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Email verified
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your email address has been confirmed. You can now enjoy the full
          Oriventra experience.
        </Typography>
        <Button component={RouterLink} to={PATHS.home} variant="contained">
          Continue shopping
        </Button>
      </Box>
    );
  }

  // Failed — likely an expired/invalid (or already-used) token; offer a resend.
  if (isError) {
    return (
      <>
        <AuthHeader title="Verification failed" />
        <Stack spacing={3}>
          <Alert severity="error">{getErrorMessage(error)}</Alert>
          <Divider>Need a new link?</Divider>
          <ResendVerificationForm />
          <Box sx={{ textAlign: "center" }}>
            <Button component={RouterLink} to={PATHS.login} variant="text">
              Back to sign in
            </Button>
          </Box>
        </Stack>
      </>
    );
  }

  // Verifying… (request in flight)
  return (
    <Box sx={{ textAlign: "center", py: 4 }}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Verifying your email…
      </Typography>
    </Box>
  );
};

export default VerifyEmailPage;
