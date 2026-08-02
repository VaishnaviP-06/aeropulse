import { motion } from "framer-motion";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { Flight } from "../../../types/flight.types";
import {
  getFlightPhase,
  type FlightPhase,
} from "../hooks/useFlightFilters";

const phaseVariant: Record<FlightPhase, "success" | "warning" | "danger"> = {
  Scheduled: "success",
  Boarding: "warning",
  Delayed: "danger",
  Departed: "success",
};

const riskVariant: Record<string, "success" | "warning" | "danger"> = {
  "On-Time": "success",
  Moderate: "warning",
};

interface Props {
  flight: Flight;
  index: number;
}

export default function FlightRow({ flight, index }: Props) {
  const phase = getFlightPhase(flight);
  const delay = Number(flight.delay_minutes) || 0;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
      className="border-b border-border/60 transition-colors hover:bg-cyan-400/[0.04]"
    >
      <td className="px-4 py-3 font-mono text-sm font-medium">
        {flight.flight_id}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {flight.airline}
      </td>

      <td className="px-4 py-3 text-sm">
        <span className="font-medium">{flight.origin}</span>
        <span className="mx-1.5 text-muted-foreground">→</span>
        <span className="font-medium">{flight.destination}</span>
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {flight.aircraft_type}
      </td>

      <td className="px-4 py-3 font-mono text-sm">{flight.gate || "—"}</td>

      <td className="px-4 py-3">
        <StatusBadge label={phase} variant={phaseVariant[phase]} />
      </td>

      <td className="px-4 py-3 text-sm">
        {delay > 0 ? (
          <span className="font-medium text-status-critical">
            +{delay}m
          </span>
        ) : (
          <span className="text-muted-foreground">On schedule</span>
        )}
      </td>

      <td className="px-4 py-3">
        <StatusBadge
          label={flight.risk_level}
          variant={riskVariant[flight.risk_level] ?? "success"}
        />
      </td>
    </motion.tr>
  );
}
