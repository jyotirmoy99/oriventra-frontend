import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
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
import { useAdminOrders, useUpdateOrderStatus } from "../../hooks/useAdmin";
import { useDebounce } from "../../hooks/useDebounce";
import { useSnackbar } from "../../hooks/useSnackbar";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatCurrency } from "../../utils/formatCurrency";
import { PaymentStatusChip } from "../../components/order/OrderStatusChip";
import { STATUS_LABELS } from "../../components/order/orderStatusConfig";
import { ORDER_STATUSES, type OrderStatus } from "../../types/order.types";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// AdminOrdersPage  (/admin/orders)
// ---------------------------------------------------------------------------
// All orders with filters; inline status updates (backend enforces valid
// transitions, so an invalid pick surfaces as an error toast).
// ---------------------------------------------------------------------------

const PAGE_SIZE = 20;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const AdminOrdersPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminOrders({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    page,
    limit: PAGE_SIZE,
  });
  const updateStatus = useUpdateOrderStatus();
  const { notify } = useSnackbar();

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  const onChangeStatus = (id: string, next: OrderStatus) => {
    updateStatus.mutate(
      { id, status: next },
      {
        onSuccess: () => notify("Order status updated", "success"),
        onError: (err) => notify(getErrorMessage(err), "error"),
      },
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Orders
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by order number…"
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
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OrderStatus | "all");
            setPage(1);
          }}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="all">All</MenuItem>
          {ORDER_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {STATUS_LABELS[s]}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {isError ? (
        <Alert severity="error">Couldn’t load orders.</Alert>
      ) : (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
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
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                        No orders found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order._id} hover>
                      <TableCell>
                        <Link component={RouterLink} to={PATHS.orderDetail(order._id)} underline="hover">
                          {order.orderNumber}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{order.user?.name ?? "—"}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.user?.email}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <PaymentStatusChip status={order.paymentStatus} />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={order.status}
                          onChange={(e) => onChangeStatus(order._id, e.target.value as OrderStatus)}
                          disabled={updateStatus.isPending}
                          sx={{ minWidth: 130 }}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <MenuItem key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>{fmtDate(order.createdAt)}</TableCell>
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
    </Box>
  );
};

export default AdminOrdersPage;
