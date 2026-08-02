import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IndianRupee } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
} from "./charts/chartTheme";
import { useRevenueTrendOverview } from "../data/analyticsData";
import type { RevenueHourPoint } from "../types/analytics.types";

interface RevenueTooltipPayloadItem {
  payload: RevenueHourPoint;
}

function RevenueTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: RevenueTooltipPayloadItem[];
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
                label: "Revenue",
                value: `₹${point.revenue.toLocaleString("en-IN")}`,
                color: CHART_COLORS.chart2,
              },
            ]
          : []
      }
    />
  );
}

/**
 * 6. Revenue Trend -- area chart
 * Duty Free revenue by hour of transaction, the one dimension in
 * retail_transactions.csv with genuine hourly spread (store, category,
 * payment method and terminal are constant across this dataset).
 */
export default function RevenueTrend() {
  const { points, peakHourLabel, peakRevenue, totalRevenue } =
    useRevenueTrendOverview();

  return (
    <ChartCard
      eyebrow="Retail Intelligence"
      title="Revenue Trend"
      subtitle="Duty Free spend by hour of transaction"
      icon={IndianRupee}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Peak Hour
          </p>
          <p className="text-sm font-semibold text-gradient">
            {peakHourLabel} · ₹{peakRevenue.toLocaleString("en-IN")}
          </p>
        </div>
      }
    >
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: -6, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.chart2}
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.chart2}
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
              width={44}
              tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
            />

            <Tooltip
              content={<RevenueTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke={CHART_COLORS.chart2}
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-muted-foreground">
        ₹{totalRevenue.toLocaleString("en-IN")} in Duty Free spend tracked
        across the full schedule.
      </p>
    </ChartCard>
  );
}
