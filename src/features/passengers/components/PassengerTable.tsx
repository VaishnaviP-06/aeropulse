import { Search } from "lucide-react";
import { usePassengerOperations, cabinFilters } from "../hooks/usePassengerOperations";
import PassengerRow from "./PassengerRow";

const columns = [
  "PNR",
  "Passenger",
  "Flight",
  "Route",
  "Seat",
  "Class",
  "Gate",
  "Connection",
];

export default function PassengerTable() {
  const {
    passengers,
    total,
    loading,
    search,
    setSearch,
    cabin,
    setCabin,
    tightConnectionsOnly,
    setTightConnectionsOnly,
  } = usePassengerOperations();

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
            placeholder="Search PNR, name, flight, nationality..."
            className="w-full rounded-lg border border-border bg-card/40 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5">
            {cabinFilters.map((option) => (
              <button
                key={option}
                onClick={() => setCabin(option)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  cabin === option
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTightConnectionsOnly((value) => !value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              tightConnectionsOnly
                ? "border-status-critical/50 bg-status-critical/10 text-status-critical"
                : "border-border text-muted-foreground hover:border-status-critical/30 hover:text-status-critical"
            }`}
          >
            Tight connections only
          </button>
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
            {passengers.map((passenger, index) => (
              <PassengerRow
                key={passenger.pnr_code}
                passenger={passenger}
                index={index}
              />
            ))}
          </tbody>
        </table>

        {!loading && passengers.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No passengers match your filters.
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Loading passengers…
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing {passengers.length} of {total} passengers
        </span>
      </div>
    </div>
  );
}
