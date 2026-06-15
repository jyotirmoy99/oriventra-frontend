import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import AuthHeader from "../../components/auth/AuthHeader";
import RHFTextField from "../../components/form/RHFTextField";
import { useResetPassword } from "../../hooks/useAuthActions";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../../validations/auth.schema";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// ResetPasswordPage
// ---------------------------------------------------------------------------
// Sets a new password using the single-use `token` from the email link
// (CLIENT_URL/reset-password?token=…). Missing token → can't proceed.
// ---------------------------------------------------------------------------

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const reset = useResetPassword();
  const navigate = useNavigate();

  const methods = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    reset.mutate(
      { token, password: values.password },
      // Brief pause so the success message is seen, then go to login.
      { onSuccess: () => setTimeout(() => navigate(PATHS.login), 1200) },
    );
  };

  // No token in the URL — nothing we can do.
  if (!token) {
    return (
      <>
        <AuthHeader title="Reset password" />
        <Alert severity="error" sx={{ mb: 2 }}>
          This reset link is invalid or has expired. Please request a new one.
        </Alert>
        <Box sx={{ textAlign: "center" }}>
          <Link component={RouterLink} to={PATHS.forgotPassword} underline="hover">
            Request a new link
          </Link>
        </Box>
      </>
    );
  }

  return (
    <FormProvider {...methods}>
      <AuthHeader title="Set a new password" subtitle="Choose a strong password" />

      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {reset.isSuccess && (
            <Alert severity="success">
              {reset.data} Redirecting to sign in…
            </Alert>
          )}
          {reset.isError && (
            <Alert severity="error">{getErrorMessage(reset.error)}</Alert>
          )}

          <RHFTextField
            name="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            autoFocus
            disabled={reset.isSuccess}
          />
          <RHFTextField
            name="confirmPassword"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            disabled={reset.isSuccess}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={reset.isPending}
            disabled={reset.isSuccess}
          >
            Reset password
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default ResetPasswordPage;
