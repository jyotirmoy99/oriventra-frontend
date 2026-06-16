import { motion, type Variants } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { Order, OrderStatus } from "../../types/order.types";
import { STATUS_DESCRIPTIONS, STATUS_FLOW, STATUS_LABELS } from "./orderStatusConfig";

// ---------------------------------------------------------------------------
// OrderStatusTimeline (Framer Motion)
// ---------------------------------------------------------------------------
// Vertical fulfilment timeline. Completed/current steps fill in with a staggered
// reveal; future steps are muted. Cancelled orders show a distinct red branch.
// ---------------------------------------------------------------------------

const fmtDateTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : undefined;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const node: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

interface Step {
  label: string;
  description: string;
  time?: string;
  reached: boolean;
  isCancel?: boolean;
}

const Dot = ({ reached, isCancel }: { reached: boolean; isCancel?: boolean }) => (
  <Box
    component={motion.div}
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 400, damping: 18 }}
    sx={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      display: "grid",
      placeItems: "center",
      flexShrink: 0,
      color: reached ? "#fff" : "text.disabled",
      bgcolor: isCancel ? "error.main" : reached ? "primary.main" : "transparent",
      border: (t) =>
        `2px solid ${
          isCancel
            ? t.palette.error.main
            : reached
              ? t.palette.primary.main
              : t.palette.divider
        }`,
    }}
  >
    {isCancel ? (
      <CloseRoundedIcon sx={{ fontSize: 18 }} />
    ) : reached ? (
      <CheckRoundedIcon sx={{ fontSize: 18 }} />
    ) : null}
  </Box>
);

const OrderStatusTimeline = ({ order }: { order: Order }) => {
  // Timestamp for a status: prefer statusHistory, else createdAt for "pending".
  const timeFor = (status: OrderStatus): string | undefined => {
    const entry = [...order.statusHistory].reverse().find((h) => h.status === status);
    if (entry) return entry.at;
    if (status === "pending") return order.createdAt;
    return undefined;
  };

  const cancelled = order.status === "cancelled";

  const steps: Step[] = cancelled
    ? [
        { label: STATUS_LABELS.pending, description: STATUS_DESCRIPTIONS.pending, time: order.createdAt, reached: true },
        {
          label: STATUS_LABELS.cancelled,
          description: order.cancelReason || STATUS_DESCRIPTIONS.cancelled,
          time: order.cancelledAt ?? timeFor("cancelled"),
          reached: true,
          isCancel: true,
        },
      ]
    : STATUS_FLOW.map((status, i) => ({
        label: STATUS_LABELS[status],
        description: STATUS_DESCRIPTIONS[status],
        time: fmtDateTime(timeFor(status)),
        reached: i <= STATUS_FLOW.indexOf(order.status),
      }));

  // For cancelled steps we stored raw ISO in `time`; format it now.
  const displaySteps = cancelled
    ? steps.map((s) => ({ ...s, time: fmtDateTime(s.time) }))
    : steps;

  return (
    <Box component={motion.div} variants={container} initial="hidden" animate="show">
      {displaySteps.map((step, i) => {
        const isLast = i === displaySteps.length - 1;
        // Connector below a step is "filled" when the next step is also reached.
        const nextReached = !isLast && displaySteps[i + 1].reached;
        return (
          <Box component={motion.div} variants={node} key={i} sx={{ display: "flex", gap: 2 }}>
            {/* Rail */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Dot reached={step.reached} isCancel={step.isCancel} />
              {!isLast && (
                <Box
                  component={motion.div}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  sx={{
                    width: 2,
                    flex: 1,
                    minHeight: 32,
                    transformOrigin: "top",
                    bgcolor: (t) =>
                      nextReached ? t.palette.primary.main : alpha(t.palette.text.primary, 0.15),
                  }}
                />
              )}
            </Box>

            {/* Content */}
            <Box sx={{ pb: isLast ? 0 : 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: step.reached ? "text.primary" : "text.disabled" }}
              >
                {step.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
              {step.time && (
                <Typography variant="caption" color="text.secondary">
                  {step.time}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default OrderStatusTimeline;
