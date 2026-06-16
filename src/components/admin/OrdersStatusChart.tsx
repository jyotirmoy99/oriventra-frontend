import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@mui/material/styles";
import { ORDER_STATUSES, type OrderStatus } from "../../types/order.types";
import { STATUS_LABELS } from "../order/orderStatusConfig";

// ---------------------------------------------------------------------------
// OrdersStatusChart — orders grouped by status (recharts bar chart).
// ---------------------------------------------------------------------------

const OrdersStatusChart = ({ data }: { data: Record<OrderStatus, number> }) => {
  const theme = useTheme();

  // Per-status colors from the theme palette.
  const colors: Record<OrderStatus, string> = {
    pending: theme.palette.warning.main,
    processing: theme.palette.info.main,
    shipped: theme.palette.primary.main,
    delivered: theme.palette.success.main,
    cancelled: theme.palette.error.main,
  };

  const chartData = ORDER_STATUSES.map((status) => ({
    status,
    name: STATUS_LABELS[status],
    value: data[status] ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          stroke={theme.palette.divider}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
          stroke={theme.palette.divider}
        />
        <Tooltip
          cursor={{ fill: theme.palette.action.hover }}
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            color: theme.palette.text.primary,
          }}
        />
        <Bar dataKey="value" name="Orders" radius={[6, 6, 0, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.status} fill={colors[entry.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrdersStatusChart;
