import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import RHFTextField from "../form/RHFTextField";
import { useResendVerification } from "../../hooks/useAuthActions";
import {
  resendVerificationSchema,
  type ResendVerificationFormValues,
} from "../../validations/auth.schema";
import { getErrorMessage } from "../../utils/getErrorMessage";

// ---------------------------------------------------------------------------
// ResendVerificationForm
// ---------------------------------------------------------------------------
// Small RHF form to re-send a verification email. Reused by the verify page
// (when a link is bad) and anywhere else we need it. `defaultEmail` pre-fills
// the field when we already know the address (e.g. a logged-in user).
// ---------------------------------------------------------------------------

const ResendVerificationForm = ({ defaultEmail = "" }: { defaultEmail?: string }) => {
  const resend = useResendVerification();

  const methods = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: defaultEmail },
  });

  const onSubmit = (values: ResendVerificationFormValues) => {
    resend.mutate(values.email);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2}>
          {resend.isSuccess && <Alert severity="success">{resend.data}</Alert>}
          {resend.isError && (
            <Alert severity="error">{getErrorMessage(resend.error)}</Alert>
          )}

          <RHFTextField
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            disabled={resend.isSuccess}
          />
          <Button
            type="submit"
            variant="outlined"
            loading={resend.isPending}
            disabled={resend.isSuccess}
          >
            Resend verification email
          </Button>
        </Stack>
      </Box>
    </FormProvider>
  );
};

export default ResendVerificationForm;
