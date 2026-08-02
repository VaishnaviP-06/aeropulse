
export interface Passenger {
  pnr_code: string;
  passenger_id: string;
  passport_masked: string;

  first_name: string;
  last_name: string;
  nationality: string;
  date_of_birth: string;
  gender: string;

  seat_number: string;
  cabin_class: string;

  flight_id: string;

  checkin_time: string;
  boarding_time: string;
  gate: string;

  checkin_duration_minutes: number;

  email: string;
  phone: string;

  special_assistance_required: boolean;
  buffer_time_hours: number;
  checked_baggage: boolean;

  fare_class: string;
  age: number;
  age_group: "Adult" | "Child" | "Senior" | "Youth" | string;
}
