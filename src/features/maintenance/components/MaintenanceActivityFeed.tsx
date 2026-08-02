import { Wrench } from "lucide-react";
import type { MaintenanceLogWithContext } from "../utils/maintenanceAnalytics";

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

export default function MaintenanceActivityFeed({
  workOrders,
}: {
  workOrders: MaintenanceLogWithContext[];
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Wrench size={14} className="text-cyan-400" />
        <h3 className="text-sm font-semibold">Recent Work Orders</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Latest maintenance activity, linked to route where available
      </p>

      <div className="mt-4 flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
        {workOrders.length === 0 && (
          <p className="text-xs text-muted-foreground">No recent activity.</p>
        )}

        {workOrders.map((log, index) => (
          <div
            key={`${log.work_order_id}-${index}`}
            className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="font-mono text-sm font-medium">
                {log.work_order_id}
              </p>
              <p className="text-xs text-muted-foreground">
                {log.flight
                  ? `${log.flight.airline} · ${log.flight.origin} → ${log.flight.destination}`
                  : log.flight_id}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {formatTime(log.reported_time)}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/70">
                {log.reported_by_staff_id}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
