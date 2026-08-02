export interface Flight {
  flight_id: string;
  airline: string;
  airline_code: string;

  origin: string;
  destination: string;

  scheduled_departure: string;
  estimated_departure: string;

  scheduled_arrival: string;
  estimated_arrival: string;

  aircraft_type: string;
  aircraft_registration: string;

  capacity: number;
  passengers: number;

  status: string;

  delay_minutes: number;
  delay_reason: string;

  terminal: string;
  gate: string;

  boarding_completed: boolean;

  distance_km: number;
  flight_duration_minutes: number;

  actual_departure: string;

  crew_ready: boolean;

  risk_level: string;

  load_factor: number;
  weather_score: number;
  operational_efficiency: number;

  time_of_day: string;
  day: string;

  international: boolean;

  season: string;

  route_type: string;
}