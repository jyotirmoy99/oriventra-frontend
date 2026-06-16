import { z } from "zod";

// ---------------------------------------------------------------------------
// Address validation (matches the backend addressBase schema)
// ---------------------------------------------------------------------------

export const addressSchema = z.object({
  label: z.string().trim().max(30).optional(),
  fullName: z.string().trim().min(2, "Full name is required").max(60),
  phone: z.string().trim().min(5, "Phone is required").max(20),
  addressLine1: z.string().trim().min(3, "Address line 1 is required").max(120),
  addressLine2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2, "City is required").max(60),
  state: z.string().trim().min(2, "State is required").max(60),
  postalCode: z.string().trim().min(3, "Postal code is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(60),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
