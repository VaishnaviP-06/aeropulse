import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
} from "./charts/chartTheme";
import { useStaffCoverageOverview } from "../data/analyticsData";
import type { StaffCoveragePoint } from "../types/analytics.types";

interface StaffTooltipPayloadItem {
  payload: StaffCoveragePoint;
}

function StaffCoverageTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: StaffTooltipPayloadItem[];
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
                label: "Shifts starting",
                value: point.shiftsStarting,
                color: CHART_COLORS.chart1,
              },
            ]
          : []
      }
    />
  );
}

/**
 * 10. Staff Coverage -- area chart
 * Shifts beginning in each hour across the 24h roster clock -- department,
 * role, shift length and base location are all constant in this dataset,
 * so shift_start_time is where the real staffing signal lives.
 */
export default function StaffCoverage() {
  const { points, peakHourLabel, peakShiftsStarting, totalShifts } =
    useStaffCoverageOverview();

  return (
    <ChartCard
      eyebrow="Workforce Intelligence"
      title="Staff Coverage"
      subtitle="Shifts starting, by hour of day"
      icon={Clock}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Peak Hour
          </p>
          <p className="text-sm font-semibold text-gradient">
            {peakHourLabel} · {peakShiftsStarting}
          </p>
        </div>
      }
    >
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="staffCoverageFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.chart1}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.chart1}
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
              width={30}
            />

            <Tooltip
              content={<StaffCoverageTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Area
              type="monotone"
              dataKey="shiftsStarting"
              stroke={CHART_COLORS.chart1}
              strokeWidth={2.5}
              fill="url(#staffCoverageFill)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-muted-foreground">
        {totalShifts} shifts scheduled across the roster, peaking at{" "}
        {peakHourLabel}.
      </p>
    </ChartCard>
  );
}
