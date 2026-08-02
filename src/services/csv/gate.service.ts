import { loadCSV } from "./csvLoader";
import gateEventsCSV from "../../csv/gate_events.csv?url";

export async function getGateEvents() {
  return loadCSV(gateEventsCSV);
}