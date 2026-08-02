import { TrendingUp, Store } from "lucide-react";
import type {
  AirlineRevenue,
  FlightRevenue,
  DatasetProfileField,
} from "../utils/retailAnalytics";

interface Props {
  revenueByAirline: AirlineRevenue[];
  topFlightsByRevenue: FlightRevenue[];
  datasetProfile: DatasetProfileField[];
}

export default function RetailRevenuePanel({
  revenueByAirline,
  topFlightsByRevenue,
  datasetProfile,
}: Props) {
  const maxAirlineRevenue = Math.max(
    ...revenueByAirline.map((a) => a.revenue),
    1
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-cyan-400" />
          <h3 className="text-sm font-semibold">Revenue by Airline</h3>
        </div>

        <p className="text-xs text-muted-foreground">
          Duty Free spend attributed via each transaction's flight — the
          real driver of variety in this dataset
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {revenueByAirline.map((airline) => (
            <div key={airline.airline} className="text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{airline.airline}</span>
                <span className="text-muted-foreground">
                  ₹{airline.revenue.toLocaleString("en-IN")} ·{" "}
                  {airline.transactionCount} txns
                </span>
              </div>

              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-cyan-400/70"
                  style={{
                    width: `${(airline.revenue / maxAirlineRevenue) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold">Top Flights by Spend</h3>

        <p className="text-xs text-muted-foreground">
          Highest Duty Free revenue linked to a single flight
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {topFlightsByRevenue.map((flight) => (
            <div
              key={flight.flight_id}
              className="flex items-center justify-between text-xs"
            >
              <span className="font-mono font-medium text-sm">
                {flight.flight_id}
              </span>
              <span className="text-muted-foreground">
                ₹{flight.revenue.toLocaleString("en-IN")} ·{" "}
                {flight.transactionCount} txns
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2">
          <Store size={14} className="text-cyan-400" />
          <h3 className="text-sm font-semibold">Store &amp; Category Profile</h3>
        </div>

        <p className="text-xs text-muted-foreground">
          This dataset covers a single retail counter — these fields don't
          vary, so a store/category breakdown chart would just be one bar.
          Shown here as a truthful operational fact instead.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {datasetProfile.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">{field.label}</span>
              <span className="font-medium">
                {field.value}{" "}
                <span className="text-muted-foreground">
                  ({field.coveragePercent}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
