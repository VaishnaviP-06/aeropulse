import { PackageSearch } from "lucide-react";
import type { FlightBagLoad } from "../utils/baggageAnalytics";

export default function TopBaggageFlights({
  flights,
}: {
  flights: FlightBagLoad[];
}) {
  const max = Math.max(...flights.map((f) => f.bagCount), 1);

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <PackageSearch size={14} className="text-cyan-400" />
        <h3 className="text-sm font-semibold">Heaviest Baggage Load</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Flights with the most checked bags — plan ramp crew accordingly
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {flights.map((flight) => (
          <div key={flight.flight_id} className="text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-sm">
                {flight.flight_id}
              </span>
              <span className="text-muted-foreground">
                {flight.bagCount} bags · {flight.totalWeightKg} kg
              </span>
            </div>

            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-cyan-400/70"
                style={{ width: `${(flight.bagCount / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
