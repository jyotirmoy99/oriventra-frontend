import { useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useAdminProducts, useDeleteProduct } from "../../hooks/useAdmin";
import { useDebounce } from "../../hooks/useDebounce";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import ProductFormDialog from "../../components/admin/ProductFormDialog";
import type { Product } from "../../types/product.types";

// ---------------------------------------------------------------------------
// AdminProductsPage  (/admin/products)
// ---------------------------------------------------------------------------

type ActiveFilter = "all" | "true" | "false";
const PAGE_SIZE = 20;

const AdminProductsPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminProducts({
    search: search || undefined,
    isActive: activeFilter === "all" ? undefined : activeFilter === "true",
    page,
    limit: PAGE_SIZE,
  });

  const deleteProduct = useDeleteProduct();
  const { notify } = useSnackbar();

  const [dialog, setDialog] = useState<{ open: boolean; product?: Product }>({ open: false });
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct.mutate(deleteTarget._id, {
      onSuccess: () => {
        setDeleteTarget(null);
        notify("Product deleted", "success");
      },
      onError: (err) => notify(getErrorMessage(err), "error"),
    });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Products
        </Typography>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialog({ open: true })}>
          New product
        </Button>
      </Box>

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by name…"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          size="small"
          label="Status"
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value as ActiveFilter);
            setPage(1);
          }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="true">Active</MenuItem>
          <MenuItem value="false">Inactive</MenuItem>
        </TextField>
      </Stack>

      {isError ? (
        <Alert severity="error">Couldn’t load products.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={6}>
                        <Skeleton height={40} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                        No products found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product._id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                          <Avatar variant="rounded" src={product.images[0]?.url} alt={product.name} sx={{ bgcolor: "action.hover" }}>
                            {product.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{product.category?.name ?? "—"}</TableCell>
                      <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                      <TableCell align="right">{product.stock}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Chip
                            label={product.isActive ? "Active" : "Inactive"}
                            size="small"
                            color={product.isActive ? "success" : "default"}
                            variant={product.isActive ? "filled" : "outlined"}
                          />
                          {product.isFeatured && <Chip label="Featured" size="small" color="primary" variant="outlined" />}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => setDialog({ open: true, product })} aria-label="Edit">
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => setDeleteTarget(product)} aria-label="Delete">
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

      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination count={pagination.pages} page={page} onChange={(_, p) => setPage(p)} color="primary" shape="rounded" />
        </Box>
      )}

      {/* Create / edit */}
      {dialog.open && (
        <ProductFormDialog
          open={dialog.open}
          product={dialog.product}
          onClose={() => setDialog({ open: false })}
        />
      )}

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete “{deleteTarget?.name}”?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleteProduct.isPending}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete} loading={deleteProduct.isPending}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProductsPage;
