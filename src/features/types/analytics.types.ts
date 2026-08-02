export type FlightStatusKey = "onTime" | "delayed" | "cancelled" | "diverted";

export interface FlightStatusSlice {
  key: FlightStatusKey;
  label: string;
  value: number;
  percent: number;
  color: string;
}

export interface FlightStatusOverview {
  slices: FlightStatusSlice[];
  total: number;
  onTimePercent: number;
}

export interface HourlyTrafficPoint {
  hour: number;
  hourLabel: string;
  arrivals: number;
  departures: number;
}

export interface HourlyTrafficOverview {
  points: HourlyTrafficPoint[];
  peakHourLabel: string;
  peakTotal: number;
  totalArrivals: number;
  totalDepartures: number;
}

export interface DelayByHourPoint {
  hour: number;
  hourLabel: string;
  averageDelay: number;
}

export interface DelayAnalyticsOverview {
  points: DelayByHourPoint[];
  peakHourLabel: string;
  peakAverageDelay: number;
  overallAverageDelay: number;
}

export interface PassengerFlowPoint {
  hour: number;
  hourLabel: string;
  pierA: number;
  pierB: number;
}

export interface PassengerFlowOverview {
  points: PassengerFlowPoint[];
  peakHourLabel: string;
  peakTotal: number;
  totalPierA: number;
  totalPierB: number;
}
