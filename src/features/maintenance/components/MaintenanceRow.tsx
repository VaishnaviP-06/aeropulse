import { motion } from "framer-motion";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { MaintenanceLogWithContext } from "../utils/maintenanceAnalytics";

interface Props {
  log: MaintenanceLogWithContext;
  index: number;
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MaintenanceRow({ log, index }: Props) {
  const grounded =
    log.aircraft_grounded === true || String(log.aircraft_grounded) === "True";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
      className="border-b border-border/60 transition-colors hover:bg-cyan-400/[0.04]"
    >
      <td className="px-4 py-3 font-mono text-sm font-medium">
        {log.work_order_id}
      </td>

      <td className="px-4 py-3 font-mono text-sm">
        {log.aircraft_registration}
      </td>

      <td className="px-4 py-3 font-mono text-sm">
        {log.flight_id}
        {log.flight && (
          <p className="text-xs text-muted-foreground">
            {log.flight.origin} → {log.flight.destination}
          </p>
        )}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {formatTime(log.reported_time)}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {formatTime(log.resolved_time)}
      </td>

      <td className="px-4 py-3 text-sm">{log.issue_description}</td>

      <td className="px-4 py-3">
        {grounded ? (
          <StatusBadge label="Grounded" variant="danger" />
        ) : (
          <StatusBadge label="Airworthy" variant="success" />
        )}
      </td>

      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {log.reported_by_staff_id}
      </td>
    </motion.tr>
  );
}
