import { motion } from "framer-motion";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { PassengerWithFlight } from "../utils/passengerAnalytics";

interface Props {
  passenger: PassengerWithFlight;
  index: number;
}

export default function PassengerRow({ passenger, index }: Props) {
  const buffer = Number(passenger.buffer_time_hours);
  const tight = buffer < 0.5;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
      className="border-b border-border/60 transition-colors hover:bg-cyan-400/[0.04]"
    >
      <td className="px-4 py-3 font-mono text-sm font-medium">
        {passenger.pnr_code}
      </td>

      <td className="px-4 py-3 text-sm">
        {passenger.first_name} {passenger.last_name}
        <p className="text-xs text-muted-foreground">
          {passenger.nationality} · {passenger.age_group}
        </p>
      </td>

      <td className="px-4 py-3 font-mono text-sm">{passenger.flight_id}</td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {passenger.flight
          ? `${passenger.flight.origin} → ${passenger.flight.destination}`
          : "—"}
      </td>

      <td className="px-4 py-3 font-mono text-sm">
        {passenger.seat_number || "—"}
      </td>

      <td className="px-4 py-3">
        <StatusBadge
          label={passenger.cabin_class}
          variant={passenger.cabin_class === "Business" ? "success" : "warning"}
        />
      </td>

      <td className="px-4 py-3 font-mono text-sm">{passenger.gate || "—"}</td>

      <td className="px-4 py-3">
        {tight ? (
          <StatusBadge label="Tight connection" variant="danger" />
        ) : (
          <span className="text-xs text-muted-foreground">
            {buffer.toFixed(1)}h buffer
          </span>
        )}
      </td>
    </motion.tr>
  );
}
