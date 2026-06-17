import { useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useAdminCategories, useDeleteCategory } from "../../hooks/useCategories";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import CategoryFormDialog from "../../components/admin/CategoryFormDialog";
import type { Category } from "../../types/category.types";

// ---------------------------------------------------------------------------
// AdminCategoriesPage  (/admin/categories)
// ---------------------------------------------------------------------------
// Lists all categories (active + inactive) with create / edit / delete. Delete
// is blocked server-side (409) when products still reference the category; the
// error message is surfaced via the snackbar.
// ---------------------------------------------------------------------------

const AdminCategoriesPage = () => {
  const { data: categories, isLoading, isError } = useAdminCategories();
  const deleteCategory = useDeleteCategory();
  const { notify } = useSnackbar();

  const [dialog, setDialog] = useState<{ open: boolean; category?: Category }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteCategory.mutate(deleteTarget._id, {
      onSuccess: () => {
        setDeleteTarget(null);
        notify("Category deleted", "success");
      },
      onError: (err) => notify(getErrorMessage(err), "error"),
    });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Categories
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialog({ open: true })}>
          New category
        </Button>
      </Box>

      {isError ? (
        <Alert severity="error">Couldn’t load categories.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Accent</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton height={40} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (categories?.length ?? 0) === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                        No categories yet — create your first one.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories!.map((category) => (
                    <TableRow key={category._id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          <Avatar
                            variant="rounded"
                            src={category.image?.url}
                            alt={category.name}
                            sx={{
                              bgcolor: category.color ?? "action.hover",
                              color: category.color ? "#fff" : "text.secondary",
                            }}
                          >
                            {category.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {category.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.slug}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {category.description || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {category.color ? (
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            <Box
                              sx={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                bgcolor: category.color,
                                border: (t) => `1px solid ${t.palette.divider}`,
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {category.color}
                            </Typography>
                          </Stack>
                        ) : (
                          <Typography variant="caption" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? "Active" : "Inactive"}
                          size="small"
                          color={category.isActive ? "success" : "default"}
                          variant={category.isActive ? "filled" : "outlined"}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => setDialog({ open: true, category })} aria-label="Edit">
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(category)} aria-label="Delete">
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Create / edit */}
      {dialog.open && (
        <CategoryFormDialog
          open={dialog.open}
          category={dialog.category}
          onClose={() => setDialog({ open: false })}
        />
      )}

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete “{deleteTarget?.name}”?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            A category can only be deleted once no products reference it.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteCategory.isPending}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} loading={deleteCategory.isPending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCategoriesPage;
