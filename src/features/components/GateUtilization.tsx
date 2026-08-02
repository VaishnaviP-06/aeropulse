import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DoorOpen } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  STATUS_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
} from "./charts/chartTheme";
import { useGateUtilizationOverview } from "../data/analyticsData";
import type { GateUtilizationBar } from "../types/analytics.types";

interface GateTooltipPayloadItem {
  dataKey: string;
  value: number;
  payload: GateUtilizationBar;
}

function GateUtilizationTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: GateTooltipPayloadItem[];
  label?: string;
}) {
  return (
    <ChartTooltip
      active={active}
      title={label}
      rows={[
        {
          label: "On time",
          value: payload?.find((p) => p.dataKey === "onTimeFlights")?.value ?? 0,
          color: STATUS_COLORS.operational,
        },
        {
          label: "Delayed",
          value: payload?.find((p) => p.dataKey === "delayedFlights")?.value ?? 0,
          color: STATUS_COLORS.warning,
        },
      ]}
    />
  );
}

/**
 * 5. Gate Utilization -- horizontal stacked bar chart
 * The 10 busiest gates by scheduled flight volume, split on-time vs
 * delayed, reusing the same gate-window derivation as the Gates page.
 */
export default function GateUtilization() {
  const { bars, busiestGate, busiestGateFlights, totalConflicts } =
    useGateUtilizationOverview();

  return (
    <ChartCard
      eyebrow="Gate Intelligence"
      title="Gate Utilization"
      subtitle="Top 10 gates by flight volume, on-time vs delayed"
      icon={DoorOpen}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Busiest Gate
          </p>
          <p className="text-sm font-semibold text-gradient">
            {busiestGate} · {busiestGateFlights}
          </p>
        </div>
      }
    >
      <div className="flex items-center gap-4 pb-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: STATUS_COLORS.operational }}
          />
          On time
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: STATUS_COLORS.warning }}
          />
          Delayed
        </span>
        <span className="ml-auto">
          {totalConflicts} turnaround conflict{totalConflicts === 1 ? "" : "s"} across all gates
        </span>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bars}
            layout="vertical"
            margin={{ top: 8, right: 16, left: 4, bottom: 0 }}
            barCategoryGap={10}
          >
            <CartesianGrid {...CHART_GRID_PROPS} horizontal={false} />

            <XAxis
              type="number"
              tick={CHART_AXIS_STYLE}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />

            <YAxis
              dataKey="gate"
              type="category"
              tick={CHART_AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              width={48}
            />

            <Tooltip
              content={<GateUtilizationTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Bar
              dataKey="onTimeFlights"
              stackId="gate"
              fill={STATUS_COLORS.operational}
              radius={[0, 0, 0, 0]}
              animationDuration={900}
            />

            <Bar
              dataKey="delayedFlights"
              stackId="gate"
              fill={STATUS_COLORS.warning}
              radius={[0, 4, 4, 0]}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
