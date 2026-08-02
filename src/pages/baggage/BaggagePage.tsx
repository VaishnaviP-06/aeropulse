import { Luggage, Weight, Scale, ScanEye } from "lucide-react";
import FlightMetricCard from "../../features/flights/components/FlightMetricCard";
import BaggageTable from "../../features/baggage/components/BaggageTable";
import TopBaggageFlights from "../../features/baggage/components/TopBaggageFlights";
import BaggageWeightProfile from "../../features/components/BaggageWeightProfile";
import { useBaggageOperations } from "../../features/baggage/hooks/useBaggageOperations";

export default function BaggagePage() {
  const {
    totalBags,
    totalWeightKg,
    averageWeightKg,
    flaggedCount,
    topBaggageFlights,
  } = useBaggageOperations();

  const kpis = [
    {
      label: "Total Bags",
      value: totalBags,
      description: "Checked across all flights",
      icon: Luggage,
    },
    {
      label: "Total Weight",
      value: `${Math.round(totalWeightKg).toLocaleString()} kg`,
      description: "Handled by ramp crews",
      icon: Weight,
    },
    {
      label: "Average Weight",
      value: `${averageWeightKg} kg`,
      description: "Per bag",
      icon: Scale,
    },
    {
      label: "Flagged for Screening",
      value: flaggedCount,
      description: "Requires inspection",
      icon: ScanEye,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Baggage Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Baggage Handling
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Every bag traced from check-in to ramp, linked to its passenger and flight.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <FlightMetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BaggageTable />
        </div>

        <TopBaggageFlights flights={topBaggageFlights} />
      </div>

      {/* Baggage weight analytics */}

      <BaggageWeightProfile />
    </div>
  );
}
