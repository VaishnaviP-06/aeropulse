import { motion } from "framer-motion";
import {
  Plane,
  Clock3,
  Shield,
  ShoppingBag,
  Wrench,
  Briefcase,
  Users,
  AlertTriangle,
} from "lucide-react";
import type { TimelineEvent as TimelineEventType } from "../../../types/timeline.types";

interface Props {
  event: TimelineEventType;
}

const iconMap = {
  Boarding: Plane,
  Departure: Plane,
  Delay: Clock3,
  Gate: AlertTriangle,
  CheckIn: Users,
  Security: Shield,
  Baggage: Briefcase,
  Maintenance: Wrench,
  Retail: ShoppingBag,
};

const severityClasses = {
  info: "border-emerald-500 bg-emerald-500/10",
  warning: "border-yellow-500 bg-yellow-500/10",
  critical: "border-red-500 bg-red-500/10",
};

export default function TimelineEvent({ event }: Props) {
  const Icon = iconMap[event.category] ?? Clock3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 backdrop-blur ${severityClasses[event.severity]}`}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-black/10 p-2">
          <Icon size={18} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">{event.title}</h4>

            <span className="text-xs opacity-70">
              {new Date(event.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <p className="mt-1 text-sm opacity-80">{event.description}</p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {event.flightId && (
              <span className="rounded bg-white/10 px-2 py-1">
                ✈ {event.flightId}
              </span>
            )}

            {event.gate && (
              <span className="rounded bg-white/10 px-2 py-1">
                Gate {event.gate}
              </span>
            )}

            <span className="rounded bg-white/10 px-2 py-1">
              {event.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}