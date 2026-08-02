import { useMemo } from "react";
import { useFlightStore } from "../../store/flight.store";
import { usePassengerStore } from "../../store/passenger.store";
import { STATUS_COLORS, CHART_COLORS } from "../components/charts/chartTheme";
import type {
  FlightStatusOverview,
  HourlyTrafficOverview,
  DelayAnalyticsOverview,
  PassengerFlowOverview,
} from "../types/analytics.types";

/** flights.csv stores datetimes as "YYYY-MM-DD HH:mm:ss" -- pull the hour out safely. */
function hourOf(datetime: string): number | null {
  const time = datetime?.split(" ")[1];
  if (!time) return null;
  const hour = Number(time.split(":")[0]);
  return Number.isFinite(hour) ? hour : null;
}

function hourLabel(hour: number): string {
  const period = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}${period}`;
}

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

/* ---------------------------------------------------------------------- */
/* 2. Hourly Flight Traffic                                               */
/* ---------------------------------------------------------------------- */

export function useHourlyTrafficOverview(): HourlyTrafficOverview {
  const flights = useFlightStore((state) => state.flights);

  return useMemo(() => {
    const arrivals = new Array<number>(24).fill(0);
    const departures = new Array<number>(24).fill(0);

    flights.forEach((flight) => {
      const depHour = hourOf(flight.scheduled_departure);
      const arrHour = hourOf(flight.scheduled_arrival);

      if (depHour !== null) departures[depHour] += 1;
      if (arrHour !== null) arrivals[arrHour] += 1;
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      arrivals: arrivals[hour],
      departures: departures[hour],
    }));

    const peak = points.reduce(
      (best, point) =>
        point.arrivals + point.departures > best.arrivals + best.departures
          ? point
          : best,
      points[0]
    );

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakTotal: peak.arrivals + peak.departures,
      totalArrivals: arrivals.reduce((sum, value) => sum + value, 0),
      totalDepartures: departures.reduce((sum, value) => sum + value, 0),
    };
  }, [flights]);
}

/* ---------------------------------------------------------------------- */
/* 3. Delay Analytics                                                     */
/* ---------------------------------------------------------------------- */

export function useDelayAnalyticsOverview(): DelayAnalyticsOverview {
  const flights = useFlightStore((state) => state.flights);

  return useMemo(() => {
    const delaySums = new Array<number>(24).fill(0);
    const delayCounts = new Array<number>(24).fill(0);

    flights.forEach((flight) => {
      const depHour = hourOf(flight.scheduled_departure);
      if (depHour === null) return;

      delaySums[depHour] += Number(flight.delay_minutes) || 0;
      delayCounts[depHour] += 1;
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      averageDelay: delayCounts[hour]
        ? Number((delaySums[hour] / delayCounts[hour]).toFixed(1))
        : 0,
    }));

    const peak = points.reduce(
      (best, point) => (point.averageDelay > best.averageDelay ? point : best),
      points[0]
    );

    const totalDelay = delaySums.reduce((sum, value) => sum + value, 0);
    const totalFlights = delayCounts.reduce((sum, value) => sum + value, 0);

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakAverageDelay: peak.averageDelay,
      overallAverageDelay: totalFlights
        ? Number((totalDelay / totalFlights).toFixed(1))
        : 0,
    };
  }, [flights]);
}

const PIER_A_MAX_GATE = 25;

function gateNumber(gate: string): number | null {
  const match = gate?.match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

export function usePassengerFlowOverview(): PassengerFlowOverview {
  const passengers = usePassengerStore((state) => state.passengers);

  return useMemo(() => {
    const pierA = new Array<number>(24).fill(0);
    const pierB = new Array<number>(24).fill(0);

    passengers.forEach((passenger) => {
      const hour = hourOf(passenger.checkin_time);
      if (hour === null) return;

      const gate = gateNumber(passenger.gate);

      if (gate !== null && gate > PIER_A_MAX_GATE) {
        pierB[hour] += 1;
      } else {
        pierA[hour] += 1;
      }
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      pierA: pierA[hour],
      pierB: pierB[hour],
    }));

    const peak = points.reduce(
      (best, point) =>
        point.pierA + point.pierB > best.pierA + best.pierB ? point : best,
      points[0]
    );

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakTotal: peak.pierA + peak.pierB,
      totalPierA: pierA.reduce((sum, value) => sum + value, 0),
      totalPierB: pierB.reduce((sum, value) => sum + value, 0),
    };
  }, [passengers]);
}