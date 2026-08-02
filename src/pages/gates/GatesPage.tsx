import { Search } from "lucide-react";
import StatusBadge from "../../components/ui/StatusBadge";
import { useGateOperations } from "../../features/gates/hooks/useGateOperations";
import GateCard from "../../features/gates/components/GateCard";
import GateActivityFeed from "../../features/gates/components/GateActivityFeed";

export default function GatesPage() {
  const {
    gates,
    totalGates,
    totalConflicts,
    search,
    setSearch,
    activity,
    loading,
  } = useGateOperations();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Gate Intelligence
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Gate Occupancy & Conflicts
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Live gate assignments derived from the flight schedule, with
            turnaround conflicts flagged automatically.
          </p>
        </div>

        <StatusBadge
          label={
            totalConflicts > 0
              ? `${totalConflicts} conflicts detected`
              : "All gates clear"
          }
          variant={totalConflicts > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="glass rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Active Gates
          </p>
          <p className="mt-2 text-2xl font-semibold text-gradient">
            {totalGates}
          </p>
        </div>

        <div className="glass rounded-xl p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Conflicts
          </p>
          <p className="mt-2 text-2xl font-semibold text-gradient">
            {totalConflicts}
          </p>
        </div>

        <div className="glass col-span-2 rounded-xl p-4 lg:col-span-2">
          <div className="relative h-full">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search gate (e.g. B12)"
              className="h-full w-full rounded-lg border border-border bg-card/40 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {gates.map((summary, index) => (
              <GateCard key={summary.gate} summary={summary} index={index} />
            ))}
          </div>

          {!loading && gates.length === 0 && (
            <div className="glass rounded-xl p-10 text-center text-sm text-muted-foreground">
              No gates match your search.
            </div>
          )}
        </div>

        <GateActivityFeed activity={activity} />
      </div>
    </div>
  );
}
