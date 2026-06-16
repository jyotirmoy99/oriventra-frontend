import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import { useAdminStats } from "../../hooks/useAdmin";
import StatCard from "../../components/admin/StatCard";
import OrdersStatusChart from "../../components/admin/OrdersStatusChart";
import { OrderStatusChip, PaymentStatusChip } from "../../components/order/OrderStatusChip";
import { formatCurrency } from "../../utils/formatCurrency";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// DashboardPage  (/admin)
// ---------------------------------------------------------------------------
// KPI cards, an orders-by-status chart (recharts), and recent orders.
// ---------------------------------------------------------------------------

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

const DashboardPage = () => {
  const { data: stats, isLoading, isError } = useAdminStats();

  if (isError) {
    return <Alert severity="error">Couldn’t load dashboard stats.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Dashboard
      </Typography>

      {/* KPI cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Skeleton variant="rounded" height={92} />
            </Grid>
          ))
        ) : (
          <>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Revenue (paid)" value={formatCurrency(stats.totalRevenue)} icon={PaidRoundedIcon} color="success" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Orders" value={String(stats.totalOrders)} icon={ShoppingBagRoundedIcon} color="primary" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Customers" value={String(stats.totalUsers)} icon={GroupRoundedIcon} color="info" />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Products" value={String(stats.totalProducts)} icon={Inventory2RoundedIcon} color="warning" />
            </Grid>
          </>
        )}
      </Grid>

      {/* Chart */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Orders by status
        </Typography>
        {isLoading || !stats ? (
          <Skeleton variant="rounded" height={300} />
        ) : (
          <OrdersStatusChart data={stats.ordersByStatus} />
        )}
      </Paper>

      {/* Recent orders */}
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Recent orders
          </Typography>
          <Link component={RouterLink} to={PATHS.adminOrders} underline="hover">
            View all
          </Link>
        </Box>
        {isLoading || !stats ? (
          <Skeleton variant="rounded" height={200} />
        ) : stats.recentOrders.length === 0 ? (
          <Typography color="text.secondary">No orders yet.</Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Link component={RouterLink} to={PATHS.orderDetail(order._id)} underline="hover">
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell>{order.user?.name ?? "—"}</TableCell>
                    <TableCell>
                      <OrderStatusChip status={order.status} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusChip status={order.paymentStatus} />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>{fmtDate(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default DashboardPage;
