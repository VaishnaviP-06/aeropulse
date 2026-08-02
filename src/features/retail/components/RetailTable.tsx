import { Search } from "lucide-react";
import {
  useRetailOperations,
  retailSortOptions,
  type RetailSortKey,
} from "../hooks/useRetailOperations";
import RetailRow from "./RetailRow";

const columns = [
  "Transaction",
  "Time",
  "Flight",
  "Route",
  "Item",
  "Amount",
  "Payment",
];

export default function RetailTable() {
  const {
    transactions,
    total,
    loading,
    search,
    setSearch,
    sortKey,
    setSortKey,
    airlineFilter,
    setAirlineFilter,
    airlineOptions,
  } = useRetailOperations();

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
            placeholder="Search transaction, flight, operator, airline..."
            className="w-full rounded-lg border border-border bg-card/40 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={airlineFilter}
            onChange={(event) => setAirlineFilter(event.target.value)}
            className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary/50"
          >
            <option value="all">All airlines</option>
            {airlineOptions.map((airline) => (
              <option key={airline} value={airline}>
                {airline}
              </option>
            ))}
          </select>

          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as RetailSortKey)}
            className="rounded-lg border border-border bg-card/40 px-3 py-2 text-xs text-muted-foreground outline-none focus:border-primary/50"
          >
            {retailSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </div>
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
            {transactions.map((transaction, index) => (
              <RetailRow
                key={transaction.transaction_id}
                transaction={transaction}
                index={index}
              />
            ))}
          </tbody>
        </table>

        {!loading && transactions.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No transactions match your search.
          </div>
        )}

        {loading && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Loading retail transactions…
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing {transactions.length} of {total} transactions
        </span>
      </div>
    </div>
  );
}
