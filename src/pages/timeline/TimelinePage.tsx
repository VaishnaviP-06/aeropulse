import OperationalClock from "../../features/timeline/components/OperationalClock";
import TimelineFilters from "../../features/timeline/components/TimelineFilters";
import TimelineFeed from "../../features/timeline/components/TimelineFeed";

import { useTimeline } from "../../features/timeline/hooks/useTimeline";

export default function TimelinePage() {
  const {
    events,
    filteredEvents,

    categories,

    category,
    setCategory,

    severity,
    setSeverity,

    search,
    setSearch,

    clock,

    start,
    pause,
    reset,
    setSpeed,
  } = useTimeline();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Operational Timeline
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Replay airport operations from historical datasets in chronological order.
        </p>
      </div>


      {/* Operational Clock */}
      <OperationalClock
        clock={clock}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSpeedChange={setSpeed}
      />


      {/* Filters */}
      <TimelineFilters
        category={category}
        setCategory={setCategory}
        categories={categories}
        severity={severity}
        setSeverity={setSeverity}
        search={search}
        setSearch={setSearch}
      />


      {/* Timeline Feed */}
      <TimelineFeed
        events={filteredEvents}
      />


      {/* Debug count (optional remove later) */}
      <p className="text-xs text-gray-500">
        Total Events Loaded: {events.length}
      </p>

    </div>
  );
}