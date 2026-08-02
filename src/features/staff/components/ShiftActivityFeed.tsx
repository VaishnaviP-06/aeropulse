import { Users } from "lucide-react";
import type { StaffShift } from "../../../types/staff.types";

export default function ShiftActivityFeed({
  shifts,
}: {
  shifts: StaffShift[];
}) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <Users size={14} className="text-cyan-400" />
        <h3 className="text-sm font-semibold">Recent Shifts</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Most recently scheduled staff shifts
      </p>

      <div className="mt-4 flex max-h-80 flex-col gap-3 overflow-y-auto pr-1">
        {shifts.length === 0 && (
          <p className="text-xs text-muted-foreground">No recent shifts.</p>
        )}

        {shifts.map((shift) => (
          <div
            key={shift.staff_id}
            className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">{shift.staff_name}</p>
              <p className="text-xs text-muted-foreground">
                {shift.department} · {shift.role}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {shift.shift_date}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground/70">
                {shift.staff_id}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
