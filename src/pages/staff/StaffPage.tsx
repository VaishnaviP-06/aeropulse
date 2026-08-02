import { Users, CalendarDays, Clock, Languages } from "lucide-react";
import FlightMetricCard from "../../features/flights/components/FlightMetricCard";
import StaffTable from "../../features/staff/components/StaffTable";
import ShiftActivityFeed from "../../features/staff/components/ShiftActivityFeed";
import { useStaffOperations } from "../../features/staff/hooks/useStaffOperations";

export default function StaffPage() {
  const {
    totalStaff,
    activeShiftDates,
    overtimeCount,
    languageCoverage,
    recentShifts,
  } = useStaffOperations();

  const kpis = [
    {
      label: "Total Staff",
      value: totalStaff,
      description: "Unique roster members scheduled",
      icon: Users,
    },
    {
      label: "Active Shift Dates",
      value: activeShiftDates,
      description: "Distinct days covered",
      icon: CalendarDays,
    },
    {
      label: "Overtime Shifts",
      value: overtimeCount,
      description: "Shifts flagged as overtime",
      icon: Clock,
    },
    {
      label: "Languages Covered",
      value: languageCoverage,
      description: "Primary languages on roster",
      icon: Languages,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Staff Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Workforce Allocation
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Shift schedule across the ground operations roster.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <FlightMetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <StaffTable />
        </div>

        <ShiftActivityFeed shifts={recentShifts} />
      </div>
    </div>
  );
}
