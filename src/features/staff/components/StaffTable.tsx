import { Search } from "lucide-react";
import {
  useStaffOperations,
  staffSortOptions,
  type StaffSortKey,
} from "../hooks/useStaffOperations";
import StaffRow from "./StaffRow";

const columns = [
  "Staff ID",
  "Name",
  "Shift Date",
  "Start",
  "End",
  "Location",
  "Status",
  "Supervisor Ref",
];

export default function StaffTable() {
  const { shifts, total, loading, search, setSearch, sortKey, setSortKey } =
    useStaffOperations();

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
            placeholder="Search staff ID, name, supervisor ref..."
            className="w-full rounded-lg border border-border bg-card/40 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        <select
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as StaffSortKey)}
          className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary/50"
        >
          {staffSortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift, index) => (
              <StaffRow key={shift.staff_id} shift={shift} index={index} />
            ))}
          </tbody>
        </table>

        {!loading && shifts.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No staff shifts match your search.
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Loading staff shifts…
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing {shifts.length} of {total} staff shifts
        </span>
      </div>
    </div>
  );
}
