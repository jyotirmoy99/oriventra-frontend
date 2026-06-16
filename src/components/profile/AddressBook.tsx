import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  useAddresses,
  useAddAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "../../hooks/useAddresses";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import AddressForm from "../checkout/AddressForm";
import type { Address } from "../../types";
import type { AddressFormValues } from "../../validations/address.schema";

// ---------------------------------------------------------------------------
// AddressBook — list + add / edit / delete / set-default of saved addresses.
// ---------------------------------------------------------------------------

const AddressBook = () => {
  const { data: addresses, isLoading, isError } = useAddresses();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const { notify } = useSnackbar();

  const [editing, setEditing] = useState<Address | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (address: Address) => {
    setEditing(address);
    setFormOpen(true);
  };

  const handleSubmit = (values: AddressFormValues) => {
    const onDone = (msg: string) => () => {
      setFormOpen(false);
      notify(msg, "success");
    };
    const onError = (err: unknown) => notify(getErrorMessage(err), "error");

    if (editing) {
      updateAddress.mutate(
        { id: editing._id, payload: values },
        { onSuccess: onDone("Address updated"), onError },
      );
    } else {
      addAddress.mutate(values, { onSuccess: onDone("Address added"), onError });
    }
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteAddress.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null);
        notify("Address deleted", "success");
      },
      onError: (err) => notify(getErrorMessage(err), "error"),
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
    return <Alert severity="error">Couldn’t load your addresses.</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Saved addresses
        </Typography>
        <Button startIcon={<AddRoundedIcon />} onClick={openAdd} variant="outlined">
          Add address
        </Button>
      </Box>

      {addresses && addresses.length > 0 ? (
        <Stack spacing={1.5}>
          {addresses.map((address) => (
            <Paper key={address._id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
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
              </Box>

              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                {!address.isDefault && (
                  <Button
                    size="small"
                    onClick={() =>
                      setDefault.mutate(address._id, {
                        onSuccess: () => notify("Default address updated", "success"),
                        onError: (err) => notify(getErrorMessage(err), "error"),
                      })
                    }
                  >
                    Set as default
                  </Button>
                )}
                <Button size="small" onClick={() => openEdit(address)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => setDeleteId(address._id)}>
                  Delete
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      ) : (
        <Alert severity="info">You have no saved addresses yet.</Alert>
      )}

      {/* Add / edit dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit address" : "Add address"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <AddressForm
              defaultValues={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setFormOpen(false)}
              isSubmitting={addAddress.isPending || updateAddress.isPending}
              submitLabel={editing ? "Save changes" : "Add address"}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this address?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} disabled={deleteAddress.isPending}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} loading={deleteAddress.isPending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddressBook;
