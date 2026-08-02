import { ShieldCheck, ScanLine, UserCheck, Users } from "lucide-react";
import FlightMetricCard from "../../features/flights/components/FlightMetricCard";
import SecurityTable from "../../features/security/components/SecurityTable";
import CheckpointLoadPanel from "../../features/security/components/CheckpointLoadPanel";
import CheckpointFlow from "../../features/components/CheckpointFlow";
import { useSecurityOperations } from "../../features/security/hooks/useSecurityOperations";

export default function SecurityPage() {
  const {
    totalScreenings,
    activeCheckpoints,
    passengerMatchRate,
    staffOnDuty,
    checkpointLoad,
  } = useSecurityOperations();

  const kpis = [
    {
      label: "Total Screenings",
      value: totalScreenings,
      description: "Recorded across all checkpoints",
      icon: ShieldCheck,
    },
    {
      label: "Active Checkpoints",
      value: activeCheckpoints,
      description: "Screening lanes in operation",
      icon: ScanLine,
    },
    {
      label: "Passenger Match Rate",
      value: `${passengerMatchRate}%`,
      description: "Screenings linked to a passenger record",
      icon: UserCheck,
    },
    {
      label: "Staff Logged",
      value: staffOnDuty,
      description: "Unique officers on screening duty",
      icon: Users,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Security Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Passenger Screening
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Checkpoint throughput and screening records, linked to passengers and flights where available.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <FlightMetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SecurityTable />
        </div>

        <CheckpointLoadPanel checkpoints={checkpointLoad} />
      </div>

      {/* Checkpoint flow analytics */}

      <CheckpointFlow />
    </div>
  );
}
