import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import RHFTextField from "../form/RHFTextField";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  newsletterSchema,
  type NewsletterFormValues,
} from "../../validations/newsletter.schema";

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------
// Email capture (RHF + Zod). NOTE: the backend has no newsletter endpoint yet,
// so this confirms locally (toast + reset). When an endpoint exists, swap the
// onSubmit body for a service call + React Query mutation — the form stays the
// same.
// ---------------------------------------------------------------------------

const Newsletter = () => {
  const { notify } = useSnackbar();
  const methods = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: NewsletterFormValues) => {
    // No backend endpoint yet — confirm locally.
    notify(`You're subscribed: ${values.email}`, "success");
    methods.reset();
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 6 },
          borderRadius: 4,
          border: (t) => `1px solid ${t.palette.divider}`,
          textAlign: "center",
        }}
      >
        <MarkEmailReadRoundedIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Stay in the loop
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 520, mx: "auto" }}>
          Subscribe for new arrivals, exclusive offers, and the occasional good
          deal. No spam — unsubscribe anytime.
        </Typography>

        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            sx={{ maxWidth: 480, mx: "auto" }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ alignItems: "flex-start" }}
            >
              <Box sx={{ flex: 1, width: "100%" }}>
                <RHFTextField
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-label="Email address"
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ height: 40, whiteSpace: "nowrap" }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>
        </FormProvider>
      </Paper>
    </Container>
  );
};

export default Newsletter;
