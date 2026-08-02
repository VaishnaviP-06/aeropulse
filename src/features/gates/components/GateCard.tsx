import { motion } from "framer-motion";
import { DoorOpen, AlertTriangle } from "lucide-react";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { GateSummary } from "../utils/gateAnalytics";

function formatTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface Props {
  summary: GateSummary;
  index: number;
}

export default function GateCard({ summary, index }: Props) {
  const hasConflict = summary.conflicts.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
      className="glass rounded-xl p-4 relative overflow-hidden transition-colors hover:border-primary/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DoorOpen size={16} className="text-cyan-400" />
          <span className="font-mono text-sm font-semibold">
            {summary.gate}
          </span>
        </div>

        <StatusBadge
          label={hasConflict ? "Conflict" : "Clear"}
          variant={hasConflict ? "danger" : "success"}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <p className="text-sm font-medium text-foreground">
            {summary.totalFlights}
          </p>
          <p>Assigned flights</p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">
            {summary.delayedFlights}
          </p>
          <p>Delayed</p>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3 text-xs">
        <p className="text-muted-foreground">Next departure</p>
        <p className="mt-0.5 font-mono text-sm">
          {summary.nextDeparture
            ? `${summary.nextDeparture.flight_id} · ${formatTime(
                summary.nextDeparture.scheduled_departure
              )}`
            : "No flights scheduled"}
        </p>
      </div>

      {hasConflict && (
        <div className="mt-3 flex items-start gap-1.5 rounded-lg border border-status-critical/25 bg-status-critical/[0.06] px-2.5 py-2 text-xs text-status-critical">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            {summary.conflicts[0].flightA} and {summary.conflicts[0].flightB}{" "}
            overlap by {summary.conflicts[0].overlapMinutes}m
            {summary.conflicts.length > 1
              ? ` (+${summary.conflicts.length - 1} more)`
              : ""}
          </span>
        </div>
      )}
    </motion.div>
  );
}
