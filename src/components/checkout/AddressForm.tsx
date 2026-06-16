import { Controller, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import RHFTextField from "../form/RHFTextField";
import {
  addressSchema,
  type AddressFormValues,
} from "../../validations/address.schema";

// ---------------------------------------------------------------------------
// AddressForm  (reused by checkout now and the profile address book in F9)
// ---------------------------------------------------------------------------
// RHF + Zod form for creating/editing an address. The parent owns persistence
// and passes `onSubmit`.
// ---------------------------------------------------------------------------

interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const EMPTY: AddressFormValues = {
  label: "",
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

const AddressForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = "Save address",
}: AddressFormProps) => {
  const methods = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <RHFTextField name="fullName" label="Full name" autoComplete="name" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <RHFTextField name="phone" label="Phone" autoComplete="tel" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RHFTextField name="addressLine1" label="Address line 1" autoComplete="address-line1" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RHFTextField name="addressLine2" label="Address line 2 (optional)" autoComplete="address-line2" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <RHFTextField name="city" label="City" autoComplete="address-level2" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <RHFTextField name="state" label="State / Province" autoComplete="address-level1" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <RHFTextField name="postalCode" label="Postal code" autoComplete="postal-code" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <RHFTextField name="country" label="Country" autoComplete="country-name" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <RHFTextField name="label" label="Label (e.g. Home, Work) — optional" />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="isDefault"
              control={methods.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox checked={!!field.value} onChange={field.onChange} />}
                  label="Set as default address"
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button type="submit" variant="contained" loading={isSubmitting}>
            {submitLabel}
          </Button>
          {onCancel && (
            <Button onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
        </Box>
      </Box>
    </FormProvider>
  );
};

export default AddressForm;
