import { Users, Briefcase, Accessibility, AlarmClockOff } from "lucide-react";
import FlightMetricCard from "../../features/flights/components/FlightMetricCard";
import PassengerTable from "../../features/passengers/components/PassengerTable";
import PassengerFlow from "../../features/components/PassengerFlow";
import { usePassengerOperations } from "../../features/passengers/hooks/usePassengerOperations";

export default function PassengersPage() {
  const {
    totalPassengers,
    businessClassCount,
    specialAssistanceCount,
    tightConnectionCount,
  } = usePassengerOperations();

  const kpis = [
    {
      label: "Total Passengers",
      value: totalPassengers,
      description: "Across all flights",
      icon: Users,
    },
    {
      label: "Business Class",
      value: businessClassCount,
      description: "Premium cabin",
      icon: Briefcase,
    },
    {
      label: "Special Assistance",
      value: specialAssistanceCount,
      description: "Requires support",
      icon: Accessibility,
    },
    {
      label: "Tight Connections",
      value: tightConnectionCount,
      description: "Under 30 min buffer",
      icon: AlarmClockOff,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Passenger Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Passenger Manifest
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Every passenger cross-referenced with their flight, gate and connection risk.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <FlightMetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <PassengerTable />

      {/* Passenger flow analytics */}

      <PassengerFlow />
    </div>
  );
}
