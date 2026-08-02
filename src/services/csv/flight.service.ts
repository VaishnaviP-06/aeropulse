import { loadCSV } from "./csvLoader";
import flightsCSV from "../../csv/flights.csv?url";
import type { Flight } from "../../types/flight.types";

const flightHeaders = [
  "flight_id",
  "airline",
  "airline_code",
  "origin",
  "destination",
  "scheduled_departure",
  "estimated_departure",
  "scheduled_arrival",
  "estimated_arrival",
  "aircraft_type",
  "aircraft_registration",
  "capacity",
  "passengers",
  "status",
  "delay_minutes",
  "delay_reason",
  "terminal",
  "gate",
  "boarding_completed",
  "distance_km",
  "flight_duration_minutes",
  "actual_departure",
  "crew_ready",
  "risk_level",
  "load_factor",
  "weather_score",
  "operational_efficiency",
  "time_of_day",
  "day",
  "international",
  "season",
  "route_type",
];

export async function getFlights(): Promise<Flight[]> {
  return loadCSV<Flight>(
    flightsCSV,
    flightHeaders
  );
}