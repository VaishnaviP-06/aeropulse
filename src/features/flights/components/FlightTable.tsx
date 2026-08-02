import { Search } from "lucide-react";
import {
  useFlightFilters,
  statusFilters,
  sortOptions,
  type StatusFilter,
  type SortKey,
} from "../hooks/useFlightFilters";
import FlightRow from "./FlightRow";

const columns = [
  "Flight",
  "Airline",
  "Route",
  "Aircraft",
  "Gate",
  "Status",
  "Delay",
  "Risk",
];

export default function FlightTable() {
  const {
    flights,
    total,
    loading,
    search,
    setSearch,
    status,
    setStatus,
    sortKey,
    setSortKey,
  } = useFlightFilters();

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search flight ID, airline, route, gate..."
            className="w-full rounded-lg border border-border bg-card/40 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map((option) => (
              <button
                key={option}
                onClick={() => setStatus(option as StatusFilter)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  status === option
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary/50"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {flights.map((flight, index) => (
              <FlightRow key={flight.flight_id} flight={flight} index={index} />
            ))}
          </tbody>
        </table>

        {!loading && flights.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No flights match your filters.
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Loading flight operations…
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing {flights.length} of {total} flights
        </span>
      </div>
    </div>
  );
}
