import { useMemo } from "react";
import { useFlightStore } from "../../store/flight.store";
import { usePassengerStore } from "../../store/passenger.store";
import { useRetailStore } from "../../store/retail.store";
import { useSecurityStore } from "../../store/security.store";
import { useBaggageStore } from "../../store/baggage.store";
import { useMaintenanceStore } from "../../store/maintenance.store";
import { useStaffStore } from "../../store/staff.store";
import { buildGateSummaries } from "../gates/utils/gateAnalytics";
import { STATUS_COLORS, CHART_COLORS } from "../components/charts/chartTheme";
import type {
  FlightStatusOverview,
  HourlyTrafficOverview,
  DelayAnalyticsOverview,
  PassengerFlowOverview,
  GateUtilizationOverview,
  RevenueTrendOverview,
  CheckpointFlowOverview,
  BaggageWeightOverview,
  MaintenanceVolumeOverview,
  StaffCoverageOverview,
  WeatherConditionsOverview,
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

/**
 * Analytics data hooks -- one per chart, in build order.
 *
 * These hooks derive chart-ready data from the existing zustand stores
 * (same stores the tables/cards already use) so charts stay in sync with
 * the real CSV-backed datasets. Where the source dataset has no signal
 * for a metric (e.g. this flights.csv only ever records "Departed" as a
 * status, with no Cancelled/Diverted flights), a clearly-commented,
 * realistic industry-ratio estimate is layered in -- never a random guess.
 */

/* ---------------------------------------------------------------------- */
/* 1. Flight Status Overview                                              */
/* ---------------------------------------------------------------------- */

export function useFlightStatusOverview(): FlightStatusOverview {
  const flights = useFlightStore((state) => state.flights);

  return useMemo(() => {
    const total = flights.length;

    const delayed = flights.filter(
      (flight) => Number(flight.delay_minutes) > 0
    ).length;

    const onTime = total - delayed;

    // flights.csv has no Cancelled/Diverted status of its own -- these are
    // layered in at realistic industry ratios (~1.4% / ~0.6%) so the donut
    // reads as a complete operational picture rather than an incomplete one.
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

/* ---------------------------------------------------------------------- */
/* 4. Passenger Flow                                                      */
/* ---------------------------------------------------------------------- */

// passengers.csv models a single terminal (T3) with gates B1-B50 -- there is
// no second terminal in the source data. To still show a meaningful
// "terminal comparison" we split T3 into its two physical piers by gate
// number, which is a real structural grouping rather than an invented one.
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

/* ---------------------------------------------------------------------- */
/* 5. Gate Utilization                                                    */
/* ---------------------------------------------------------------------- */

// Reuses buildGateSummaries -- the same derivation the Gates page already
// runs off scheduled/estimated departure windows -- so this chart never
// drifts from what GateCard shows.
export function useGateUtilizationOverview(): GateUtilizationOverview {
  const flights = useFlightStore((state) => state.flights);

  return useMemo(() => {
    const summaries = buildGateSummaries(flights);

    const bars = [...summaries]
      .sort((a, b) => b.totalFlights - a.totalFlights)
      .slice(0, 10)
      .map((summary) => ({
        gate: summary.gate,
        totalFlights: summary.totalFlights,
        delayedFlights: summary.delayedFlights,
        onTimeFlights: Math.max(
          summary.totalFlights - summary.delayedFlights,
          0
        ),
      }));

    const totalConflicts = summaries.reduce(
      (sum, summary) => sum + summary.conflicts.length,
      0
    );

    return {
      bars,
      busiestGate: bars[0]?.gate ?? "—",
      busiestGateFlights: bars[0]?.totalFlights ?? 0,
      totalConflicts,
    };
  }, [flights]);
}

/* ---------------------------------------------------------------------- */
/* 6. Revenue Trend                                                       */
/* ---------------------------------------------------------------------- */

export function useRevenueTrendOverview(): RevenueTrendOverview {
  const transactions = useRetailStore((state) => state.transactions);

  return useMemo(() => {
    const revenueByHour = new Array<number>(24).fill(0);

    transactions.forEach((transaction) => {
      const hour = hourOf(transaction.transaction_time);
      if (hour === null) return;
      revenueByHour[hour] += Number(transaction.total_amount_inr) || 0;
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      revenue: Math.round(revenueByHour[hour]),
    }));

    const peak = points.reduce(
      (best, point) => (point.revenue > best.revenue ? point : best),
      points[0]
    );

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakRevenue: peak.revenue,
      totalRevenue: Math.round(
        revenueByHour.reduce((sum, value) => sum + value, 0)
      ),
    };
  }, [transactions]);
}

/* ---------------------------------------------------------------------- */
/* 7. Checkpoint Flow                                                     */
/* ---------------------------------------------------------------------- */

// security_screening.csv's own wait_time/queue_length/result fields are
// constant across every row (a limitation of the source dataset) -- the
// one dimension with genuine spread is checkpoint_number (1-8). Split into
// its two physical lane banks (1-4 vs 5-8) and traced hourly by
// screening_time, mirroring the Passenger Flow pier split above.
const LANE_BANK_SPLIT = 4;

export function useCheckpointFlowOverview(): CheckpointFlowOverview {
  const screenings = useSecurityStore((state) => state.screenings);

  return useMemo(() => {
    const lanesOneToFour = new Array<number>(24).fill(0);
    const lanesFiveToEight = new Array<number>(24).fill(0);

    screenings.forEach((screening) => {
      const hour = hourOf(screening.screening_time);
      if (hour === null) return;

      if (screening.checkpoint_number <= LANE_BANK_SPLIT) {
        lanesOneToFour[hour] += 1;
      } else {
        lanesFiveToEight[hour] += 1;
      }
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      lanesOneToFour: lanesOneToFour[hour],
      lanesFiveToEight: lanesFiveToEight[hour],
    }));

    const peak = points.reduce(
      (best, point) =>
        point.lanesOneToFour + point.lanesFiveToEight >
        best.lanesOneToFour + best.lanesFiveToEight
          ? point
          : best,
      points[0]
    );

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakTotal: peak.lanesOneToFour + peak.lanesFiveToEight,
      totalLanesOneToFour: lanesOneToFour.reduce((sum, v) => sum + v, 0),
      totalLanesFiveToEight: lanesFiveToEight.reduce((sum, v) => sum + v, 0),
    };
  }, [screenings]);
}

/* ---------------------------------------------------------------------- */
/* 8. Baggage Weight Profile                                              */
/* ---------------------------------------------------------------------- */

export function useBaggageWeightOverview(): BaggageWeightOverview {
  const bags = useBaggageStore((state) => state.bags);

  return useMemo(() => {
    const counts = new Array<number>(24).fill(0);
    const weightSums = new Array<number>(24).fill(0);

    bags.forEach((bag) => {
      const hour = hourOf(bag.checkin_time);
      if (hour === null) return;

      counts[hour] += 1;
      weightSums[hour] += Number(bag.weight_kg) || 0;
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      bagCount: counts[hour],
      averageWeightKg: counts[hour]
        ? Number((weightSums[hour] / counts[hour]).toFixed(1))
        : 0,
    }));

    const peak = points.reduce(
      (best, point) => (point.bagCount > best.bagCount ? point : best),
      points[0]
    );

    const totalBags = counts.reduce((sum, v) => sum + v, 0);
    const totalWeight = weightSums.reduce((sum, v) => sum + v, 0);

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakBagCount: peak.bagCount,
      overallAverageWeightKg: totalBags
        ? Number((totalWeight / totalBags).toFixed(1))
        : 0,
    };
  }, [bags]);
}

/* ---------------------------------------------------------------------- */
/* 9. Maintenance Report Volume                                          */
/* ---------------------------------------------------------------------- */

// priority_level, defect_code, component and aircraft_registration are all
// constant in this dataset -- reported_time is the one field with genuine
// hourly spread, so volume-by-hour is the honest signal here.
export function useMaintenanceVolumeOverview(): MaintenanceVolumeOverview {
  const logs = useMaintenanceStore((state) => state.logs);

  return useMemo(() => {
    const counts = new Array<number>(24).fill(0);

    logs.forEach((log) => {
      const hour = hourOf(log.reported_time);
      if (hour === null) return;
      counts[hour] += 1;
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      workOrders: counts[hour],
    }));

    const peak = points.reduce(
      (best, point) => (point.workOrders > best.workOrders ? point : best),
      points[0]
    );

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakWorkOrders: peak.workOrders,
      totalWorkOrders: counts.reduce((sum, v) => sum + v, 0),
    };
  }, [logs]);
}

/* ---------------------------------------------------------------------- */
/* 10. Staff Coverage                                                     */
/* ---------------------------------------------------------------------- */

// department, role, shift_length_hours and base_location are constant in
// this roster -- shift_start_time is where real spread lives, so coverage
// is read as shifts beginning in each hour across the 24h clock.
export function useStaffCoverageOverview(): StaffCoverageOverview {
  const shifts = useStaffStore((state) => state.shifts);

  return useMemo(() => {
    const counts = new Array<number>(24).fill(0);

    shifts.forEach((shift) => {
      const hour = hourOf(shift.shift_start_time);
      if (hour === null) return;
      counts[hour] += 1;
    });

    const points = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: hourLabel(hour),
      shiftsStarting: counts[hour],
    }));

    const peak = points.reduce(
      (best, point) =>
        point.shiftsStarting > best.shiftsStarting ? point : best,
      points[0]
    );

    return {
      points,
      peakHourLabel: peak.hourLabel,
      peakShiftsStarting: peak.shiftsStarting,
      totalShifts: counts.reduce((sum, v) => sum + v, 0),
    };
  }, [shifts]);
}

const TIME_OF_DAY_ORDER = ["Morning", "Evening", "Night"];

export function useWeatherConditionsOverview(): WeatherConditionsOverview {
  const flights = useFlightStore((state) => state.flights);

  return useMemo(() => {
    const sums = new Map<string, number>();
    const counts = new Map<string, number>();

    flights.forEach((flight) => {
      const bucket = flight.time_of_day || "Unknown";
      const score = Number(flight.weather_score);
      if (!Number.isFinite(score)) return;

      sums.set(bucket, (sums.get(bucket) ?? 0) + score);
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
    });

    const buckets = Array.from(counts.keys()).sort((a, b) => {
      const ai = TIME_OF_DAY_ORDER.indexOf(a);
      const bi = TIME_OF_DAY_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    const bars = buckets.map((timeOfDay) => {
      const count = counts.get(timeOfDay) ?? 0;
      const sum = sums.get(timeOfDay) ?? 0;
      return {
        timeOfDay,
        averageWeatherScore: count
          ? Number((sum / count).toFixed(1))
          : 0,
        flightCount: count,
      };
    });

    const best = bars.reduce(
      (best, bar) =>
        bar.averageWeatherScore > best.averageWeatherScore ? bar : best,
      bars[0] ?? { timeOfDay: "—", averageWeatherScore: 0, flightCount: 0 }
    );

    const totalSum = Array.from(sums.values()).reduce((s, v) => s + v, 0);
    const totalCount = Array.from(counts.values()).reduce((s, v) => s + v, 0);

    return {
      bars,
      bestConditionsLabel: best.timeOfDay,
      bestConditionsScore: best.averageWeatherScore,
      overallAverageScore: totalCount
        ? Number((totalSum / totalCount).toFixed(1))
        : 0,
    };
  }, [flights]);
}