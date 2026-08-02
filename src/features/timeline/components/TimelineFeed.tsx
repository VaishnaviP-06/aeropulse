import { AnimatePresence } from "framer-motion";

import TimelineEvent from "./TimelineEvent";
import type { TimelineEvent as TimelineEventType } from "../../../types/timeline.types";

interface TimelineFeedProps {
  events: TimelineEventType[];
}

export default function TimelineFeed({
  events,
}: TimelineFeedProps) {
  if (events.length === 0) {
    return (
      <div className="glass rounded-xl border border-white/10 p-8 text-center">
        <p className="text-muted-foreground">
          Timeline is waiting for the simulation to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl border border-white/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Operational Timeline
          </h2>

          <p className="text-sm text-muted-foreground">
            {events.length} event{events.length !== 1 ? "s" : ""} replayed
          </p>
        </div>
      </div>

      <div className="max-h-[700px] space-y-3 overflow-y-auto pr-2">
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <TimelineEvent
              key={event.id}
              event={event}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}