import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { useUpdateProfile } from "../../hooks/useProfile";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import RHFTextField from "../form/RHFTextField";
import {
  profileSchema,
  type ProfileFormValues,
} from "../../validations/profile.schema";

// ---------------------------------------------------------------------------
// ProfileInfoForm
// ---------------------------------------------------------------------------
// Edit name + phone (email is read-only). Submits only when something changed,
// and omits an empty phone so the backend's min-length rule isn't tripped.
// ---------------------------------------------------------------------------

const ProfileInfoForm = () => {
  const user = useAppSelector(selectCurrentUser);
  const updateProfile = useUpdateProfile();
  const { notify } = useSnackbar();

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(
      { name: data.name, phone: data.phone?.trim() || undefined },
      {
        onSuccess: () => notify("Profile updated", "success"),
        onError: (err) => notify(getErrorMessage(err), "error"),
      },
    );
  };

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2} sx={{ maxWidth: 520 }}>
          <Grid size={{ xs: 12 }}>
            <RHFTextField name="name" label="Full name" autoComplete="name" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            {/* Email is fixed (identity) — shown read-only. */}
            <TextField
              label="Email"
              value={user?.email ?? ""}
              fullWidth
              disabled
              helperText="Email can’t be changed."
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RHFTextField name="phone" label="Phone (optional)" autoComplete="tel" />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          loading={updateProfile.isPending}
          disabled={!methods.formState.isDirty}
        >
          Save changes
        </Button>
      </Box>
    </FormProvider>
  );
};

export default ProfileInfoForm;
