import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Weight } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
} from "./charts/chartTheme";
import { useBaggageWeightOverview } from "../data/analyticsData";
import type { BaggageHourPoint } from "../types/analytics.types";

interface BaggageTooltipPayloadItem {
  payload: BaggageHourPoint;
}

function BaggageTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: BaggageTooltipPayloadItem[];
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
                label: "Bags checked in",
                value: point.bagCount,
                color: CHART_COLORS.chart1,
              },
              {
                label: "Avg weight",
                value: `${point.averageWeightKg} kg`,
                color: CHART_COLORS.chart5,
              },
            ]
          : []
      }
    />
  );
}

/**
 * 8. Baggage Weight Profile -- composed bar + line chart
 * Bag check-in volume by hour, with average weight overlaid -- the two
 * fields in baggage.csv with genuine spread (status, location, mishandled
 * flags etc. are constant across all 2,800 rows in this dataset).
 */
export default function BaggageWeightProfile() {
  const { points, peakHourLabel, peakBagCount, overallAverageWeightKg } =
    useBaggageWeightOverview();

  return (
    <ChartCard
      eyebrow="Baggage Intelligence"
      title="Baggage Weight Profile"
      subtitle="Hourly check-in volume with average bag weight"
      icon={Weight}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Peak Hour
          </p>
          <p className="text-sm font-semibold text-gradient">
            {peakHourLabel} · {peakBagCount} bags
          </p>
        </div>
      }
    >
      <div className="flex items-center gap-4 pb-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CHART_COLORS.chart1 }}
          />
          Bags checked in
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CHART_COLORS.chart5 }}
          />
          Avg weight ({overallAverageWeightKg} kg overall)
        </span>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={points}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
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
              yAxisId="count"
              tick={CHART_AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              width={30}
            />

            <YAxis
              yAxisId="weight"
              orientation="right"
              tick={CHART_AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              width={36}
              tickFormatter={(value) => `${value}kg`}
            />

            <Tooltip
              content={<BaggageTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Bar
              yAxisId="count"
              dataKey="bagCount"
              fill={CHART_COLORS.chart1}
              fillOpacity={0.55}
              radius={[3, 3, 0, 0]}
              animationDuration={900}
            />

            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="averageWeightKg"
              stroke={CHART_COLORS.chart5}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
              animationDuration={1100}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
