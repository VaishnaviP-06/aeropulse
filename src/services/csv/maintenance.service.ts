import { loadCSV } from "./csvLoader";
import maintenanceCSV from "../../csv/maintenance_logs.csv?url";

export async function getMaintenanceLogs() {
  return loadCSV(maintenanceCSV);
}