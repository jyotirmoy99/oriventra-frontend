import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import { useMyOrders } from "../../hooks/useOrders";
import OrderCard from "../../components/order/OrderCard";
import { STATUS_LABELS } from "../../components/order/orderStatusConfig";
import { ORDER_STATUSES, type OrderStatus } from "../../types/order.types";
import { PATHS } from "../../routes/paths";

// ---------------------------------------------------------------------------
// OrderListPage  (/orders — behind PrivateRoute)
// ---------------------------------------------------------------------------
// Paginated order history with a status filter.
// ---------------------------------------------------------------------------

type Filter = OrderStatus | "all";
const PAGE_SIZE = 10;

const OrderListPage = () => {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyOrders({
    status: filter === "all" ? undefined : filter,
    page,
    limit: PAGE_SIZE,
  });

  const orders = data?.orders ?? [];
  const pagination = data?.pagination;

  const changeFilter = (next: Filter) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
        My orders
      </Typography>

      {/* Status filter */}
      <Tabs
        value={filter}
        onChange={(_, v) => changeFilter(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="All" value="all" />
        {ORDER_STATUSES.map((status) => (
          <Tab key={status} label={STATUS_LABELS[status]} value={status} />
        ))}
      </Tabs>

      {isError ? (
        <Alert severity="error">Couldn’t load your orders. Please try again.</Alert>
      ) : isLoading ? (
        <Stack spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={150} />
          ))}
        </Stack>
      ) : orders.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
          <ReceiptLongRoundedIcon sx={{ fontSize: 56, mb: 1, opacity: 0.6 }} />
          <Typography sx={{ mb: 2 }}>
            {filter === "all" ? "You haven’t placed any orders yet." : "No orders with this status."}
          </Typography>
          <Button component={RouterLink} to={PATHS.products} variant="contained">
            Start shopping
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </Stack>
      )}

      {pagination && pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={pagination.pages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
};

export default OrderListPage;
