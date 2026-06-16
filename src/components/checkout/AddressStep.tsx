import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useAddresses, useAddAddress } from "../../hooks/useAddresses";
import { getErrorMessage } from "../../utils/getErrorMessage";
import AddressForm from "./AddressForm";
import type { Address } from "../../types";
import type { AddressFormValues } from "../../validations/address.schema";

// ---------------------------------------------------------------------------
// AddressStep
// ---------------------------------------------------------------------------
// Pick a saved shipping address or add a new one. Selecting is controlled by the
// parent (it needs the id to place the order). Adding a new address selects it.
// ---------------------------------------------------------------------------

interface AddressStepProps {
  selectedId: string;
  onSelect: (addressId: string) => void;
}

const AddressCard = ({
  address,
  selected,
  onSelect,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}) => (
  <Paper
    variant="outlined"
    onClick={onSelect}
    sx={{
      p: 2,
      borderRadius: 2,
      cursor: "pointer",
      display: "flex",
      gap: 1,
      borderColor: selected ? "primary.main" : "divider",
      borderWidth: selected ? 2 : 1,
    }}
  >
    <Radio checked={selected} size="small" sx={{ p: 0, mt: 0.25 }} />
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {address.fullName}
        </Typography>
        {address.label && <Chip label={address.label} size="small" />}
        {address.isDefault && <Chip label="Default" size="small" color="primary" variant="outlined" />}
      </Box>
      <Typography variant="body2" color="text.secondary">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city},{" "}
        {address.state} {address.postalCode}, {address.country}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {address.phone}
      </Typography>
    </Box>
  </Paper>
);

const AddressStep = ({ selectedId, onSelect }: AddressStepProps) => {
  const { data: addresses, isLoading, isError } = useAddresses();
  const addAddress = useAddAddress();
  const [showForm, setShowForm] = useState(false);

  const handleAdd = (values: AddressFormValues) => {
    addAddress.mutate(values, {
      onSuccess: (created) => {
        setShowForm(false);
        onSelect(created._id); // select the newly added address
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Alert severity="error">Couldn’t load your addresses. Please try again.</Alert>;
  }

  const hasAddresses = (addresses?.length ?? 0) > 0;

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Delivery address
      </Typography>

      {hasAddresses && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {addresses!.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              selected={selectedId === address._id}
              onSelect={() => onSelect(address._id)}
            />
          ))}
        </Box>
      )}

      {!hasAddresses && !showForm && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have no saved addresses yet — add one to continue.
        </Alert>
      )}

      {showForm ? (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            New address
          </Typography>
          {addAddress.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {getErrorMessage(addAddress.error)}
            </Alert>
          )}
          <AddressForm
            onSubmit={handleAdd}
            onCancel={hasAddresses ? () => setShowForm(false) : undefined}
            isSubmitting={addAddress.isPending}
            submitLabel="Save & use this address"
          />
        </Paper>
      ) : (
        <Button startIcon={<AddRoundedIcon />} onClick={() => setShowForm(true)}>
          Add a new address
        </Button>
      )}
    </Box>
  );
};

export default AddressStep;
