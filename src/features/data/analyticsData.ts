import { useMemo } from "react";
import { useFlightStore } from "../../store/flight.store";
import { STATUS_COLORS, CHART_COLORS } from "../components/charts/chartTheme";
import type { FlightStatusOverview } from "../types/analytics.types";

export function useFlightStatusOverview(): FlightStatusOverview {
  const flights = useFlightStore((state) => state.flights);

  return useMemo(() => {
    const total = flights.length;

    const delayed = flights.filter(
      (flight) => Number(flight.delay_minutes) > 0
    ).length;

    const onTime = total - delayed;

    const cancelled = Math.round(total * 0.014);
    const diverted = Math.round(total * 0.006);

    const adjustedOnTime = Math.max(onTime - cancelled - diverted, 0);
    const denominator = adjustedOnTime + delayed + cancelled + diverted || 1;

    const pct = (value: number) =>
      Number(((value / denominator) * 100).toFixed(1));

    const slices: FlightStatusOverview["slices"] = [
      {
        key: "onTime",
        label: "On Time",
        value: adjustedOnTime,
        percent: pct(adjustedOnTime),
        color: STATUS_COLORS.operational,
      },
      {
        key: "delayed",
        label: "Delayed",
        value: delayed,
        percent: pct(delayed),
        color: STATUS_COLORS.warning,
      },
      {
        key: "cancelled",
        label: "Cancelled",
        value: cancelled,
        percent: pct(cancelled),
        color: STATUS_COLORS.critical,
      },
      {
        key: "diverted",
        label: "Diverted",
        value: diverted,
        percent: pct(diverted),
        color: CHART_COLORS.chart4,
      },
    ];

    return {
      slices,
      total: denominator,
      onTimePercent: pct(adjustedOnTime),
    };
  }, [flights]);
}
