import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ScanLine } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
} from "./charts/chartTheme";
import { useCheckpointFlowOverview } from "../data/analyticsData";
import type { CheckpointFlowPoint } from "../types/analytics.types";

interface FlowTooltipPayloadItem {
  dataKey: string;
  value: number;
  payload: CheckpointFlowPoint;
}

function CheckpointFlowTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: FlowTooltipPayloadItem[];
  label?: string;
}) {
  return (
    <ChartTooltip
      active={active}
      title={label}
      rows={[
        {
          label: "Checkpoints 1-4",
          value: payload?.find((p) => p.dataKey === "lanesOneToFour")?.value ?? 0,
          color: CHART_COLORS.chart3,
        },
        {
          label: "Checkpoints 5-8",
          value: payload?.find((p) => p.dataKey === "lanesFiveToEight")?.value ?? 0,
          color: CHART_COLORS.chart4,
        },
      ]}
    />
  );
}

/**
 * 7. Checkpoint Flow -- stacked area chart
 * Hourly screening volume across the two checkpoint lane banks (1-4 vs
 * 5-8) -- checkpoint_number is the one field in security_screening.csv
 * with genuine spread, since wait time, queue length and result are
 * constant across the dataset.
 */
export default function CheckpointFlow() {
  const {
    points,
    peakHourLabel,
    peakTotal,
    totalLanesOneToFour,
    totalLanesFiveToEight,
  } = useCheckpointFlowOverview();

  return (
    <ChartCard
      eyebrow="Security Intelligence"
      title="Checkpoint Flow"
      subtitle="Hourly screening volume, checkpoint lanes 1-4 vs 5-8"
      icon={ScanLine}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Peak Hour
          </p>
          <p className="text-sm font-semibold text-gradient">
            {peakHourLabel} · {peakTotal}
          </p>
        </div>
      }
    >
      <div className="flex items-center gap-4 pb-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CHART_COLORS.chart3 }}
          />
          Checkpoints 1-4 ({totalLanesOneToFour.toLocaleString()})
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CHART_COLORS.chart4 }}
          />
          Checkpoints 5-8 ({totalLanesFiveToEight.toLocaleString()})
        </span>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="laneAFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.chart3}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.chart3}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="laneBFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.chart4}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.chart4}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid {...CHART_GRID_PROPS} />

            <XAxis
              dataKey="hourLabel"
              tick={CHART_AXIS_STYLE}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              interval={2}
            />

            <YAxis
              tick={CHART_AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              width={32}
            />

            <Tooltip
              content={<CheckpointFlowTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Area
              type="monotone"
              dataKey="lanesOneToFour"
              stackId="flow"
              stroke={CHART_COLORS.chart3}
              strokeWidth={2}
              fill="url(#laneAFill)"
              animationDuration={900}
            />

            <Area
              type="monotone"
              dataKey="lanesFiveToEight"
              stackId="flow"
              stroke={CHART_COLORS.chart4}
              strokeWidth={2}
              fill="url(#laneBFill)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
