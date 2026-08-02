import { loadCSV } from "./csvLoader";
import passengersCSV from "../../csv/passengers.csv?url";

export async function getPassengers() {
  return loadCSV(passengersCSV);
}