import { Play, Pause, RotateCcw } from "lucide-react";

import type {
  ClockSpeed,
  TimelineClockState,
} from "../../../types/timeline.types";

interface OperationalClockProps {
  clock: TimelineClockState;

  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: ClockSpeed) => void;
}

const speeds: ClockSpeed[] = [1, 2, 5];

export default function OperationalClock({
  clock,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
}: OperationalClockProps) {
  return (
    <div className="glass rounded-xl border border-white/10 p-4">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Operational Clock
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            {clock.simTime
              ? new Date(clock.simTime).toLocaleString()
              : "--"}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Status:{" "}
            <span className="font-medium capitalize">
              {clock.status}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStart}
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
          >
            <Play size={16} />
            Start
          </button>

          <button
            onClick={onPause}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            <Pause size={16} />
            Pause
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/5"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <select
            value={clock.speed}
            onChange={(e) =>
              onSpeedChange(Number(e.target.value) as ClockSpeed)
            }
            className="rounded-lg border border-white/10 bg-background px-3 py-2 text-sm"
          >
            {speeds.map((speed) => (
              <option key={speed} value={speed}>
                {speed}× Speed
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );    
}