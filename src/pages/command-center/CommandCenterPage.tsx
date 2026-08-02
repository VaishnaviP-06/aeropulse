import StatusBadge from "../../components/ui/StatusBadge";

const kpis = [
  { label: "Flights Today", value: "—", hint: "on schedule" },
  { label: "Active Gates", value: "—", hint: "in use" },
  { label: "Avg. Delay", value: "—", hint: "minutes" },
  { label: "Open Alerts", value: "—", hint: "needs attention" },
];

const modules = [
  { label: "Flights", status: "success" as const, note: "Nominal" },
  { label: "Gates", status: "warning" as const, note: "1 conflict" },
  { label: "Baggage", status: "success" as const, note: "Nominal" },
  { label: "Security", status: "success" as const, note: "Nominal" },
  { label: "Maintenance", status: "warning" as const, note: "2 open logs" },
  { label: "Staff", status: "success" as const, note: "Fully staffed" },
];

export default function CommandCenterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            AeroPulse
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Airport Operations Overview
          </h1>
        </div>

        <StatusBadge label="All systems operational" variant="success" />
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="glass rounded-xl p-5"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {kpi.label}
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-gradient">
              {kpi.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{kpi.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Module status grid */}
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold tracking-tight">
            Module Status
          </h3>
          <p className="text-xs text-muted-foreground">
            Live health across operational systems
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {modules.map((m) => (
              <div
                key={m.label}
                className="flex items-center justify-between rounded-lg border border-border bg-card/60 px-4 py-3"
              >
                <span className="text-sm font-medium">{m.label}</span>
                <StatusBadge label={m.note} variant={m.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Alert / event feed */}
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold tracking-tight">
            Event Feed
          </h3>
          <p className="text-xs text-muted-foreground">
            Simulated real-time operational events
          </p>

          <div className="mt-4 flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
            Waiting for dataset connection —
            <br />
            wire this to flights.csv / gate_events.csv
          </div>
        </div>
      </div>
    </div>
  );
}