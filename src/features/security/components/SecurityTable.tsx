import { Search } from "lucide-react";
import {
  useSecurityOperations,
  securitySortOptions,
  type SecuritySortKey,
} from "../hooks/useSecurityOperations";
import SecurityRow from "./SecurityRow";

const columns = [
  "Screening ID",
  "Passenger",
  "Flight",
  "Checkpoint",
  "Screening Time",
  "Result",
  "Secondary",
  "Officer",
];

const checkpoints = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SecurityTable() {
  const {
    screenings,
    total,
    loading,
    search,
    setSearch,
    sortKey,
    setSortKey,
    checkpointFilter,
    setCheckpointFilter,
  } = useSecurityOperations();

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
            placeholder="Search screening ID, PNR, passport, officer..."
            className="w-full rounded-lg border border-border bg-card/40 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={checkpointFilter}
            onChange={(event) =>
              setCheckpointFilter(
                event.target.value === "all"
                  ? "all"
                  : Number(event.target.value)
              )
            }
            className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary/50"
          >
            <option value="all">All checkpoints</option>
            {checkpoints.map((checkpoint) => (
              <option key={checkpoint} value={checkpoint}>
                Lane {checkpoint}
              </option>
            ))}
          </select>

          <select
            value={sortKey}
            onChange={(event) =>
              setSortKey(event.target.value as SecuritySortKey)
            }
            className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary/50"
          >
            {securitySortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {screenings.map((screening, index) => (
              <SecurityRow
                key={screening.screening_id}
                screening={screening}
                index={index}
              />
            ))}
          </tbody>
        </table>

        {!loading && screenings.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No screening records match your search.
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Loading security screening records…
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing {screenings.length} of {total} screenings
        </span>
      </div>
    </div>
  );
}
