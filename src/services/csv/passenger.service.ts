import { loadCSV } from "./csvLoader";
import passengersCSV from "../../csv/passengers.csv?url";
import type { Passenger } from "../../types/passenger.types";

const passengerHeaders = [
  "pnr_code",
  "passenger_id",
  "passport_masked",
  "first_name",
  "last_name",
  "nationality",
  "date_of_birth",
  "gender",
  "seat_number",
  "cabin_class",
  "flight_id",
  "checkin_time",
  "boarding_time",
  "gate",
  "checkin_duration_minutes",
  "unused_1",
  "unused_2",
  "unused_3",
  "email",
  "phone",
  "unused_4",
  "unused_5",
  "special_assistance_required",
  "buffer_time_hours",
  "checked_baggage",
  "fare_class",
  "age",
  "age_group",
];

export async function getPassengers(): Promise<Passenger[]> {
  return loadCSV<Passenger>(passengersCSV, passengerHeaders);
}
