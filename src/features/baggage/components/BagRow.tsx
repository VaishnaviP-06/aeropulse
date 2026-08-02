import { motion } from "framer-motion";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { BagWithContext } from "../utils/baggageAnalytics";

interface Props {
  bag: BagWithContext;
  index: number;
}

export default function BagRow({ bag, index }: Props) {
  const flagged =
    bag.flagged_for_inspection === true ||
    String(bag.flagged_for_inspection) === "True";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
      className="border-b border-border/60 transition-colors hover:bg-cyan-400/[0.04]"
    >
      <td className="px-4 py-3 font-mono text-sm font-medium">
        {bag.bag_tag}
      </td>

      <td className="px-4 py-3 text-sm">
        {bag.passenger
          ? `${bag.passenger.first_name} ${bag.passenger.last_name}`
          : "—"}
        <p className="font-mono text-xs text-muted-foreground">
          {bag.pnr_code}
        </p>
      </td>

      <td className="px-4 py-3 font-mono text-sm">{bag.flight_id}</td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {bag.flight
          ? `${bag.flight.origin} → ${bag.flight.destination}`
          : "—"}
      </td>

      <td className="px-4 py-3 text-sm">
        {Number(bag.weight_kg).toFixed(1)} kg
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        #{bag.bag_sequence}
      </td>

      <td className="px-4 py-3">
        <StatusBadge label={bag.status} variant="success" />
      </td>

      <td className="px-4 py-3">
        {flagged ? (
          <StatusBadge label="Inspection" variant="warning" />
        ) : (
          <span className="text-xs text-muted-foreground">Clear</span>
        )}
      </td>
    </motion.tr>
  );
}
