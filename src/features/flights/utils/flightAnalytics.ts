import type { Flight } from "../../../types/flight.types";

export function getTotalFlights(
  flights: Flight[]
) {
  return flights.length;
}


export function getDelayedFlights(
  flights: Flight[]
) {
  return flights.filter(
    (flight) =>
      Number(flight.delay_minutes) > 0
  ).length;
}


export function getActiveFlights(
  flights: Flight[]
) {
  return flights.filter(
    (flight) =>
      flight.status === "Departed" ||
      flight.status === "Boarding"
  ).length;
}


export function getAverageLoadFactor(
  flights: Flight[]
) {
  if (!flights.length) return 0;

  const total = flights.reduce(
    (sum, flight) =>
      sum + Number(flight.load_factor || 0),
    0
  );

  return Number(
    (total / flights.length).toFixed(1)
  );
}


export function getRiskFlights(
  flights: Flight[]
) {
  return flights.filter(
    (flight) =>
      flight.risk_level === "High" ||
      flight.risk_level === "Critical"
  ).length;
}