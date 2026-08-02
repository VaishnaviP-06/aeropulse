import { loadCSV } from "./csvLoader";
import baggageCSV from "../../csv/baggage.csv?url";

export async function getBaggage() {
  return loadCSV(baggageCSV);
}