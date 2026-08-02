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
import { Wrench } from "lucide-react";
import ChartCard from "./charts/ChartCard";
import ChartTooltip from "./charts/ChartTooltip";
import {
  CHART_COLORS,
  CHART_GRID_PROPS,
  CHART_AXIS_STYLE,
  CHART_CURSOR_PROPS,
  STATUS_COLORS,
} from "./charts/chartTheme";
import { useMaintenanceVolumeOverview } from "../data/analyticsData";
import type { MaintenanceHourPoint } from "../types/analytics.types";

interface MaintenanceTooltipPayloadItem {
  payload: MaintenanceHourPoint;
}

function MaintenanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: MaintenanceTooltipPayloadItem[];
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
                label: "Work orders reported",
                value: point.workOrders,
                color: CHART_COLORS.chart3,
              },
            ]
          : []
      }
    />
  );
}

/**
 * 9. Maintenance Report Volume -- line chart
 * Work orders reported by hour of day -- priority level, defect code,
 * component and aircraft registration are all constant in this dataset,
 * so reported_time is the one field with genuine hourly spread.
 */
export default function MaintenanceVolume() {
  const { points, peakHourLabel, peakWorkOrders, totalWorkOrders } =
    useMaintenanceVolumeOverview();

  const peakPoint = points.find((point) => point.hourLabel === peakHourLabel);

  return (
    <ChartCard
      eyebrow="Maintenance Intelligence"
      title="Report Volume"
      subtitle="Work orders reported, by hour of day"
      icon={Wrench}
      action={
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Peak Hour
          </p>
          <p className="text-sm font-semibold text-gradient">
            {peakHourLabel} · {peakWorkOrders}
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
              width={30}
            />

            <Tooltip
              content={<MaintenanceTooltip />}
              cursor={CHART_CURSOR_PROPS}
              wrapperStyle={{ outline: "none" }}
            />

            <Line
              type="monotone"
              dataKey="workOrders"
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
                y={peakPoint.workOrders}
                r={5}
                fill={STATUS_COLORS.warning}
                stroke="var(--card)"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[10px] text-muted-foreground">
        {totalWorkOrders} work orders logged across the schedule, peaking at{" "}
        {peakHourLabel}.
      </p>
    </ChartCard>
  );
}
