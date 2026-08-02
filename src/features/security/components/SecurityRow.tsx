import { motion } from "framer-motion";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { ScreeningWithContext } from "../utils/securityAnalytics";

interface Props {
  screening: ScreeningWithContext;
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

export default function SecurityRow({ screening, index }: Props) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
      className="border-b border-border/60 transition-colors hover:bg-cyan-400/[0.04]"
    >
      <td className="px-4 py-3 font-mono text-sm font-medium">
        {screening.screening_id}
      </td>

      <td className="px-4 py-3 text-sm">
        {screening.passenger
          ? `${screening.passenger.first_name} ${screening.passenger.last_name}`
          : "—"}
        <p className="font-mono text-xs text-muted-foreground">
          {screening.pnr_code}
        </p>
      </td>

      <td className="px-4 py-3 font-mono text-sm">
        {screening.flight?.flight_id ?? "—"}
        {screening.flight && (
          <p className="text-xs text-muted-foreground">
            {screening.flight.origin} → {screening.flight.destination}
          </p>
        )}
      </td>

      <td className="px-4 py-3 text-sm">
        Lane {screening.checkpoint_number}
        <p className="text-xs text-muted-foreground">
          {screening.checkpoint_lane}
        </p>
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {formatTime(screening.screening_time)}
      </td>

      <td className="px-4 py-3">
        <StatusBadge label={screening.screening_result} variant="success" />
      </td>

      <td className="px-4 py-3">
        {screening.secondary_screening_required === true ||
        String(screening.secondary_screening_required) === "True" ? (
          <StatusBadge label="Secondary" variant="warning" />
        ) : (
          <span className="text-xs text-muted-foreground">Clear</span>
        )}
      </td>

      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {screening.staff_id}
      </td>
    </motion.tr>
  );
}
