import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AuthHeader from "../../components/auth/AuthHeader";
import RHFTextField from "../../components/form/RHFTextField";
import { useLogin } from "../../hooks/useAuthActions";
import { loginSchema, type LoginFormValues } from "../../validations/auth.schema";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// LoginPage
// ---------------------------------------------------------------------------
// Email/password sign-in. On success, returns the user to the page they were
// trying to reach (PrivateRoute stashes it in location.state.from), else home.
// ---------------------------------------------------------------------------

interface LocationState {
  from?: { pathname?: string };
}

const LoginPage = () => {
  const login = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login: the intended page, or home.
  const from = (location.state as LocationState | null)?.from?.pathname;

  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => navigate(from ?? PATHS.home, { replace: true }),
    });
  };

  return (
    <FormProvider {...methods}>
      <AuthHeader title="Welcome back" subtitle="Sign in to your Oriventra account" />

      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {/* Surface the backend error (e.g. "Invalid email or password") */}
          {login.isError && (
            <Alert severity="error">{getErrorMessage(login.error)}</Alert>
          )}

          <RHFTextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <RHFTextField
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />

          <Box sx={{ textAlign: "right" }}>
            <Link
              component={RouterLink}
              to={PATHS.forgotPassword}
              variant="body2"
              underline="hover"
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            loading={login.isPending}
          >
            Sign in
          </Button>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
            Don’t have an account?{" "}
            <Link component={RouterLink} to={PATHS.register} underline="hover">
              Sign up
            </Link>
          </Typography>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default LoginPage;
