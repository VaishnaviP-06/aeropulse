import { Wrench, Plane, Link2, AlertTriangle } from "lucide-react";
import FlightMetricCard from "../../features/flights/components/FlightMetricCard";
import MaintenanceTable from "../../features/maintenance/components/MaintenanceTable";
import MaintenanceActivityFeed from "../../features/maintenance/components/MaintenanceActivityFeed";
import { useMaintenanceOperations } from "../../features/maintenance/hooks/useMaintenanceOperations";

export default function MaintenancePage() {
  const {
    totalWorkOrders,
    aircraftTracked,
    linkedFlights,
    groundedCount,
    recentWorkOrders,
  } = useMaintenanceOperations();

  const kpis = [
    {
      label: "Total Work Orders",
      value: totalWorkOrders,
      description: "Logged maintenance line items",
      icon: Wrench,
    },
    {
      label: "Aircraft Tracked",
      value: aircraftTracked,
      description: "Tail numbers under maintenance",
      icon: Plane,
    },
    {
      label: "Linked Flights",
      value: linkedFlights,
      description: "Distinct flights referenced",
      icon: Link2,
    },
    {
      label: "Grounded Events",
      value: groundedCount,
      description: "Work orders marking the aircraft grounded",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Maintenance Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Aircraft Maintenance
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Work orders traced from report to resolution, linked to the flight they reference.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <FlightMetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MaintenanceTable />
        </div>

        <MaintenanceActivityFeed workOrders={recentWorkOrders} />
      </div>
    </div>
  );
}
