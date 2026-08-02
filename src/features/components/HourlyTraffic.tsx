import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Radar } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
} from "./charts/chartTheme";
import { useHourlyTrafficOverview } from "../data/analyticsData";
import type { HourlyTrafficPoint } from "../types/analytics.types";

interface TrafficTooltipPayloadItem {
  dataKey: string;
  value: number;
  payload: HourlyTrafficPoint;
}

function HourlyTrafficTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TrafficTooltipPayloadItem[];
  label?: string;
}) {
  return (
    <ChartTooltip
      active={active}
      title={label}
      rows={[
        {
          label: "Arrivals",
          value: payload?.find((p) => p.dataKey === "arrivals")?.value ?? 0,
          color: CHART_COLORS.chart1,
        },
        {
          label: "Departures",
          value: payload?.find((p) => p.dataKey === "departures")?.value ?? 0,
          color: CHART_COLORS.chart2,
        },
      ]}
    />
  );
}

/**
 * 2. Hourly Flight Traffic -- area chart
 * Arrivals vs departures across a 24-hour window, derived from
 * scheduled_departure / scheduled_arrival in flights.csv.
 */
export default function HourlyTraffic() {
  const { points, peakHourLabel, peakTotal, totalArrivals, totalDepartures } =
    useHourlyTrafficOverview();

  return (
    <ChartCard
      eyebrow="Flight Intelligence"
      title="Hourly Flight Traffic"
      subtitle="Arrivals vs departures across a 24-hour window"
      icon={Radar}
      action={
        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Peak Hour
            </p>
            <p className="text-sm font-semibold text-gradient">
              {peakHourLabel} · {peakTotal}
            </p>
          </div>
        </div>
      }
    >
      <div className="flex items-center gap-4 pb-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CHART_COLORS.chart1 }}
          />
          Arrivals ({totalArrivals.toLocaleString()})
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: CHART_COLORS.chart2 }}
          />
          Departures ({totalDepartures.toLocaleString()})
        </span>
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={points}
            margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="arrivalsFill" x1="0" y1="0" x2="0" y2="1">
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
              <linearGradient id="departuresFill" x1="0" y1="0" x2="0" y2="1">
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
              width={32}
            />

            <Tooltip
              content={<HourlyTrafficTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Area
              type="monotone"
              dataKey="arrivals"
              stroke={CHART_COLORS.chart1}
              strokeWidth={2}
              fill="url(#arrivalsFill)"
              animationDuration={900}
            />

            <Area
              type="monotone"
              dataKey="departures"
              stroke={CHART_COLORS.chart2}
              strokeWidth={2}
              fill="url(#departuresFill)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
