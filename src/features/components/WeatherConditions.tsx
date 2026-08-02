import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CloudSun } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
} from "./charts/chartTheme";
import { useWeatherConditionsOverview } from "../data/analyticsData";
import type { WeatherConditionsBar } from "../types/analytics.types";

const BAR_COLORS = [
  CHART_COLORS.chart1,
  CHART_COLORS.chart2,
  CHART_COLORS.chart4,
];

interface WeatherTooltipPayloadItem {
  payload: WeatherConditionsBar;
}

function WeatherTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: WeatherTooltipPayloadItem[];
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
                label: "Avg conditions score",
                value: point.averageWeatherScore,
                color: CHART_COLORS.chart1,
              },
              {
                label: "Flights",
                value: point.flightCount,
              },
            ]
          : []
      }
    />
  );
}

/**
 * 11. Weather Conditions -- bar chart
 * Average per-flight weather_score by time-of-day window -- the field
 * doesn't causally track delay_minutes in this dataset (checked: delayed
 * vs on-time flights average within ~1pt of each other), so this reads as
 * a conditions index by time window, not a delay driver.
 */
export default function WeatherConditions() {
  const { bars, bestConditionsLabel, bestConditionsScore, overallAverageScore } =
    useWeatherConditionsOverview();

  return (
    <ChartCard
      eyebrow="Operations Intelligence"
      title="Weather Conditions"
      subtitle="Average conditions score by time-of-day window"
      icon={CloudSun}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Best Window
          </p>
          <p className="text-sm font-semibold text-gradient">
            {bestConditionsLabel} · {bestConditionsScore}
          </p>
        </div>
      }
    >
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={bars}
            margin={{ top: 8, right: 8, left: -6, bottom: 0 }}
            barCategoryGap="30%"
          >
            <CartesianGrid {...CHART_GRID_PROPS} />

            <XAxis
              dataKey="timeOfDay"
              tick={CHART_AXIS_STYLE}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />

            <YAxis
              tick={CHART_AXIS_STYLE}
              axisLine={false}
              tickLine={false}
              width={32}
            />

            <Tooltip
              content={<WeatherTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Bar
              dataKey="averageWeatherScore"
              radius={[6, 6, 0, 0]}
              animationDuration={900}
            >
              {bars.map((bar, index) => (
                <Cell
                  key={bar.timeOfDay}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-muted-foreground">
        Fleet-wide average conditions score of {overallAverageScore} across
        the schedule, tracked by time-of-day window rather than delay
        outcome -- the two don't correlate in this dataset.
      </p>
    </ChartCard>
  );
}
