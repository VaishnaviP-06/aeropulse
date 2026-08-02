import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PlaneTakeoff } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import { useFlightStatusOverview } from "../data/analyticsData";
import type { FlightStatusSlice } from "../types/analytics.types";

interface DonutTooltipPayloadItem {
  payload: FlightStatusSlice;
}

function StatusDonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: DonutTooltipPayloadItem[];
}) {
  const slice = payload?.[0]?.payload;

  return (
    <ChartTooltip
      active={active}
      title={slice?.label}
      rows={
        slice
          ? [
              {
                label: "Flights",
                value: slice.value.toLocaleString(),
                color: slice.color,
              },
              {
                label: "Share",
                value: `${slice.percent}%`,
              },
            ]
          : []
      }
    />
  );
}

/**
 * 1. Flight Status Overview -- donut chart
 * On Time / Delayed / Cancelled / Diverted split, with a centered
 * on-time-performance readout.
 */
export default function FlightAnalytics() {
  const { slices, total, onTimePercent } = useFlightStatusOverview();

  return (
    <ChartCard
      eyebrow="Flight Intelligence"
      title="Flight Status Overview"
      subtitle="Live operational split across the schedule"
      icon={PlaneTakeoff}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative h-[220px] w-full max-w-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="value"
                nameKey="label"
                innerRadius="68%"
                outerRadius="100%"
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                stroke="var(--card)"
                strokeWidth={2}
                animationBegin={100}
                animationDuration={900}
              >
                {slices.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>

              <Tooltip
                content={<StatusDonutTooltip />}
                wrapperStyle={{ outline: "none" }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-gradient">
              {onTimePercent}%
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
              On Time
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2.5">
          {slices.map((slice) => (
            <div
              key={slice.key}
              className="flex items-center justify-between rounded-lg border border-border bg-card/40 px-3.5 py-2.5"
            >
              <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: slice.color,
                    boxShadow: `0 0 8px 0 ${slice.color}`,
                  }}
                />
                {slice.label}
              </span>

              <span className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-foreground">
                  {slice.value.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {slice.percent}%
                </span>
              </span>
            </div>
          ))}

          <p className="mt-1 text-[10px] text-muted-foreground">
            {total.toLocaleString()} flights tracked today
          </p>
        </div>
      </div>
    </ChartCard>
  );
}
