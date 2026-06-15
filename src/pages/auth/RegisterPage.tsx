import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AuthHeader from "../../components/auth/AuthHeader";
import RHFTextField from "../../components/form/RHFTextField";
import { useRegister } from "../../hooks/useAuthActions";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../validations/auth.schema";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// RegisterPage
// ---------------------------------------------------------------------------
// Creates an account (the backend also emails a verification link). On success
// the user is signed in immediately and sent home; a verification banner nudges
// them to confirm their email (Feature 3 — EmailVerificationBanner).
// ---------------------------------------------------------------------------

const RegisterPage = () => {
  const register = useRegister();
  const navigate = useNavigate();

  const methods = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: RegisterFormValues) => {
    // Send only what the backend expects (drop confirmPassword).
    register.mutate(
      { name: values.name, email: values.email, password: values.password },
      { onSuccess: () => navigate(PATHS.home, { replace: true }) },
    );
  };

  return (
    <FormProvider {...methods}>
      <AuthHeader
        title="Create your account"
        subtitle="Join Oriventra in a few seconds"
      />

      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {register.isError && (
            <Alert severity="error">{getErrorMessage(register.error)}</Alert>
          )}

          <RHFTextField name="name" label="Full name" autoComplete="name" autoFocus />
          <RHFTextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />
          <RHFTextField
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
          />
          <RHFTextField
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={register.isPending}
          >
            Create account
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link component={RouterLink} to={PATHS.login} underline="hover">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default RegisterPage;
