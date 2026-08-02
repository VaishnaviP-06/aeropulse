import { ScanLine } from "lucide-react";
import type { CheckpointLoad } from "../utils/securityAnalytics";

export default function CheckpointLoadPanel({
  checkpoints,
}: {
  checkpoints: CheckpointLoad[];
}) {
  const max = Math.max(...checkpoints.map((c) => c.count), 1);

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2">
        <ScanLine size={14} className="text-cyan-400" />
        <h3 className="text-sm font-semibold">Checkpoint Load</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Screening volume per lane — balance staffing where load is heaviest
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {checkpoints.map((checkpoint) => (
          <div key={checkpoint.checkpoint_number} className="text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-medium text-sm">
                Lane {checkpoint.checkpoint_number}
              </span>
              <span className="text-muted-foreground">
                {checkpoint.count} screenings
              </span>
            </div>

            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-cyan-400/70"
                style={{ width: `${(checkpoint.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
