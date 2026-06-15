import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import AuthHeader from "../../components/auth/AuthHeader";
import RHFTextField from "../../components/form/RHFTextField";
import { useForgotPassword } from "../../hooks/useAuthActions";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../../validations/auth.schema";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// ForgotPasswordPage
// ---------------------------------------------------------------------------
// Requests a reset link. The backend always responds generically (never reveals
// whether the email exists), so on success we show that message and stop.
// ---------------------------------------------------------------------------

const ForgotPasswordPage = () => {
  const forgot = useForgotPassword();

  const methods = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgot.mutate(values.email);
  };

  return (
    <FormProvider {...methods}>
      <AuthHeader
        title="Forgot password?"
        subtitle="Enter your email and we’ll send you a reset link"
      />

      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {/* Generic success message from the backend */}
          {forgot.isSuccess && <Alert severity="success">{forgot.data}</Alert>}
          {forgot.isError && (
            <Alert severity="error">{getErrorMessage(forgot.error)}</Alert>
          )}

          <RHFTextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
            disabled={forgot.isSuccess}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={forgot.isPending}
            disabled={forgot.isSuccess}
          >
            Send reset link
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Link component={RouterLink} to={PATHS.login} variant="body2" underline="hover">
              Back to sign in
            </Link>
          </Box>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default ForgotPasswordPage;
