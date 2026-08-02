import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
  STATUS_COLORS,
} from "./charts/chartTheme";
import { useDelayAnalyticsOverview } from "../data/analyticsData";
import type { DelayByHourPoint } from "../types/analytics.types";

interface DelayTooltipPayloadItem {
  payload: DelayByHourPoint;
}

function DelayTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: DelayTooltipPayloadItem[];
  label?: string;
}) {
  const point = payload?.[0]?.payload;

  return (
    <ChartTooltip
      active={active}
      title={label}
      rows={
        point
          ? [
              {
                label: "Avg delay",
                value: `${point.averageDelay} min`,
                color: CHART_COLORS.chart3,
              },
            ]
          : []
      }
    />
  );
}

/**
 * 3. Delay Analytics -- line chart
 * Average departure delay by hour, with the peak congestion hour flagged.
 */
export default function DelayChart() {
  const { points, peakHourLabel, peakAverageDelay, overallAverageDelay } =
    useDelayAnalyticsOverview();

  const peakPoint = points.find((point) => point.hourLabel === peakHourLabel);

  return (
    <ChartCard
      eyebrow="Flight Intelligence"
      title="Delay Analytics"
      subtitle="Average departure delay by scheduled hour"
      icon={TrendingUp}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Peak Congestion
          </p>
          <p className="text-sm font-semibold text-gradient">
            {peakHourLabel} · {peakAverageDelay}m
          </p>
        </div>
      }
    >
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
            margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
          >
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
              width={36}
              tickFormatter={(value) => `${value}m`}
            />

            <Tooltip
              content={<DelayTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Line
              type="monotone"
              dataKey="averageDelay"
              stroke={CHART_COLORS.chart3}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
              animationDuration={1100}
              animationEasing="ease-out"
            />

            {peakPoint && (
              <ReferenceDot
                x={peakPoint.hourLabel}
                y={peakPoint.averageDelay}
                r={5}
                fill={STATUS_COLORS.critical}
                stroke="var(--card)"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Fleet-wide average delay of {overallAverageDelay} minutes across the
        schedule, with congestion peaking at {peakHourLabel}.
      </p>
    </ChartCard>
  );
}
