import StatusBadge from "../../components/ui/StatusBadge";
import { useFlightMetrics } from "../../features/flights/hooks/useFlightMetrics";
import {
  Plane,
  Clock,
  Activity,
  AlertTriangle,
  Gauge,
} from "lucide-react";
import FlightMetricCard from "../../features/flights/components/FlightMetricCard";

const modules = [
  { label: "Flights", status: "success" as const, note: "Nominal" },
  { label: "Gates", status: "warning" as const, note: "1 conflict" },
  { label: "Baggage", status: "success" as const, note: "Nominal" },
  { label: "Security", status: "success" as const, note: "Nominal" },
  { label: "Maintenance", status: "warning" as const, note: "2 open logs" },
  { label: "Staff", status: "success" as const, note: "Fully staffed" },
];

export default function CommandCenterPage() {
  const metrics = useFlightMetrics();

  const kpis = [
    {
      label: "Flights Today",
      value: metrics.totalFlights,
      description: "Scheduled operations",
      icon: Plane,
    },
    {
      label: "Delayed Flights",
      value: metrics.delayedFlights,
      description: "Requires attention",
      icon: Clock,
    },
    {
      label: "Active Flights",
      value: metrics.activeFlights,
      description: "Currently operating",
      icon: Activity,
    },
    {
      label: "Risk Flights",
      value: metrics.riskFlights,
      description: "Operational monitoring",
      icon: AlertTriangle,
    },
    {
      label: "Load Factor",
      value: `${metrics.averageLoadFactor}%`,
      description: "Passenger utilization",
      icon: Gauge,
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            AeroPulse
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Airport Operations Overview
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Live operational intelligence powered by airport datasets
          </p>
        </div>

        <StatusBadge
          label="All systems operational"
          variant="success"
        />

      </div>


      {/* Flight Intelligence */}

      <div className="
        grid
        grid-cols-2
        gap-4
        lg:grid-cols-5
      ">

        {kpis.map((kpi)=>(
          <FlightMetricCard
            key={kpi.label}
            {...kpi}
          />
        ))}

      </div>



      <div className="grid gap-4 lg:grid-cols-3">


        {/* Operational Systems */}

        <div className="glass rounded-xl p-5 lg:col-span-2">

          <h3 className="text-sm font-semibold">
            Operational Systems
          </h3>

          <p className="text-xs text-muted-foreground">
            Live health across airport departments
          </p>


          <div className="mt-4 grid gap-3 sm:grid-cols-2">

            {modules.map((module)=>(

              <div
                key={module.label}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-border
                  bg-card/40
                  px-4
                  py-3
                "
              >

                <span className="text-sm font-medium">
                  {module.label}
                </span>


                <StatusBadge
                  label={module.note}
                  variant={module.status}
                />

              </div>

            ))}

          </div>

        </div>



        {/* Event Feed */}

        <div className="glass rounded-xl p-5">

          <h3 className="text-sm font-semibold">
            Event Feed
          </h3>

          <p className="text-xs text-muted-foreground">
            Simulated real-time airport events
          </p>


          <div
            className="
              mt-4
              flex
              h-64
              items-center
              justify-center
              rounded-lg
              border
              border-dashed
              border-border
              text-center
              text-xs
              text-muted-foreground
            "
          >
            Monitoring flight,
            <br />
            gate and security streams
          </div>

        </div>


      </div>

    </div>
  );
}