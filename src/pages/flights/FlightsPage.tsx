import FlightTable from "../../features/flights/components/FlightTable";
import HourlyTraffic from "../../features/components/HourlyTraffic";
import DelayChart from "../../features/components/DelayChart";

export default function FlightsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Flight Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Flight Monitoring
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Search, filter and investigate every scheduled flight across the operation.
        </p>
      </div>

      <FlightTable />

      {/* Traffic & delay analytics */}

      <div className="grid gap-4 lg:grid-cols-2">
        <HourlyTraffic />
        <DelayChart />
      </div>
    </div>
  );
}
