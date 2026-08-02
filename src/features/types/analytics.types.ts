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
