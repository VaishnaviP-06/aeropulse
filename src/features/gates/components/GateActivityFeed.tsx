import { Radio } from "lucide-react";
import type { Flight } from "../../../types/flight.types";
import type { GateEvent } from "../../../types/gate.types";

interface ActivityItem extends GateEvent {
  flight: Flight | null;
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

export default function GateActivityFeed({
  activity,
}: {
  activity: ActivityItem[];
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Radio size={14} className="text-cyan-400" />
        <h3 className="text-sm font-semibold">Gate Activity</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Recent boarding events across the terminal
      </p>

      <div className="mt-4 flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
        {activity.length === 0 && (
          <p className="text-xs text-muted-foreground">No recent activity.</p>
        )}

        {activity.map((item) => (
          <div
            key={item.event_id}
            className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-mono text-sm font-medium">
                {item.flight_id}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.flight
                  ? `${item.flight.airline} · ${item.flight.origin} → ${item.flight.destination}`
                  : "Boarding start"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {formatTime(item.event_time)}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/70">
                {item.staff_id}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
