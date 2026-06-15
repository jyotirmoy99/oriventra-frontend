import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

// ---------------------------------------------------------------------------
// RHFTextField
// ---------------------------------------------------------------------------
// MUI TextField wired to React Hook Form via Controller + useFormContext, so
// forms read as `<RHFTextField name="email" label="Email" />`. Validation
// errors render inline. When `type="password"` it adds a show/hide toggle.
// Requires a parent <FormProvider>.
// ---------------------------------------------------------------------------

type RHFTextFieldProps = Omit<TextFieldProps, "name" | "error"> & {
  name: string;
};

const RHFTextField = ({ name, type, ...rest }: RHFTextFieldProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const effectiveType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          type={effectiveType}
          fullWidth
          error={Boolean(fieldState.error)}
          // Show the validation message, else any caller-provided helper text.
          helperText={fieldState.error?.message ?? rest.helperText}
          slotProps={
            isPassword
              ? {
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffRoundedIcon fontSize="small" />
                          ) : (
                            <VisibilityRoundedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }
              : rest.slotProps
          }
        />
      )}
    />
  );
};

export default RHFTextField;
