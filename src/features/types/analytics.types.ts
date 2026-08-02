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

export interface GateUtilizationBar {
  gate: string;
  totalFlights: number;
  delayedFlights: number;
  onTimeFlights: number;
}

export interface GateUtilizationOverview {
  bars: GateUtilizationBar[];
  busiestGate: string;
  busiestGateFlights: number;
  totalConflicts: number;
}


export interface RevenueHourPoint {
  hour: number;
  hourLabel: string;
  revenue: number;
}

export interface RevenueTrendOverview {
  points: RevenueHourPoint[];
  peakHourLabel: string;
  peakRevenue: number;
  totalRevenue: number;
}


export interface CheckpointFlowPoint {
  hour: number;
  hourLabel: string;
  lanesOneToFour: number;
  lanesFiveToEight: number;
}

export interface CheckpointFlowOverview {
  points: CheckpointFlowPoint[];
  peakHourLabel: string;
  peakTotal: number;
  totalLanesOneToFour: number;
  totalLanesFiveToEight: number;
}


export interface BaggageHourPoint {
  hour: number;
  hourLabel: string;
  bagCount: number;
  averageWeightKg: number;
}

export interface BaggageWeightOverview {
  points: BaggageHourPoint[];
  peakHourLabel: string;
  peakBagCount: number;
  overallAverageWeightKg: number;
}

export interface MaintenanceHourPoint {
  hour: number;
  hourLabel: string;
  workOrders: number;
}

export interface MaintenanceVolumeOverview {
  points: MaintenanceHourPoint[];
  peakHourLabel: string;
  peakWorkOrders: number;
  totalWorkOrders: number;
}

export interface StaffCoveragePoint {
  hour: number;
  hourLabel: string;
  shiftsStarting: number;
}

export interface StaffCoverageOverview {
  points: StaffCoveragePoint[];
  peakHourLabel: string;
  peakShiftsStarting: number;
  totalShifts: number;
}

export interface WeatherConditionsBar {
  timeOfDay: string;
  averageWeatherScore: number;
  flightCount: number;
}

export interface WeatherConditionsOverview {
  bars: WeatherConditionsBar[];
  bestConditionsLabel: string;
  bestConditionsScore: number;
  overallAverageScore: number;
}

