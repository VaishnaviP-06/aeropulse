import { motion } from "framer-motion";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { StaffShift } from "../../../types/staff.types";

interface Props {
  shift: StaffShift;
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

export default function StaffRow({ shift, index }: Props) {
  const overtime = shift.overtime === true || String(shift.overtime) === "True";

  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
      className="border-b border-border/60 transition-colors hover:bg-cyan-400/[0.04]"
    >
      <td className="px-4 py-3 font-mono text-sm font-medium">
        {shift.staff_id}
      </td>

      <td className="px-4 py-3 text-sm">
        {shift.staff_name}
        <p className="text-xs text-muted-foreground">
          {shift.department} · {shift.role}
        </p>
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {shift.shift_date}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {formatTime(shift.shift_start_time)}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {formatTime(shift.shift_end_time)}
      </td>

      <td className="px-4 py-3 text-sm">
        {shift.terminal} · {shift.base_location}
      </td>

      <td className="px-4 py-3">
        {overtime ? (
          <StatusBadge label="Overtime" variant="warning" />
        ) : (
          <span className="text-xs text-muted-foreground">Standard</span>
        )}
      </td>

      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
        {shift.supervisor_id}
      </td>
    </motion.tr>
  );
}
