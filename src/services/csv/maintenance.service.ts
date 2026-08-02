import { loadCSV } from "./csvLoader";
import maintenanceCSV from "../../csv/maintenance_logs.csv?url";
import type { MaintenanceLog } from "../../types/maintenance.types";

const maintenanceHeaders = [
  "work_order_id",
  "aircraft_registration",
  "flight_id",
  "maintenance_type",
  "reported_by_staff_id",
  "reported_time",
  "resolved_time",
  "priority_level",
  "defect_code",
  "issue_description",
  "component",
  "estimated_hours",
  "closed_by_staff_id",
  "aircraft_grounded",
  "recurring_issue",
  "unused_1",
];

export async function getMaintenanceLogs(): Promise<MaintenanceLog[]> {
  return loadCSV<MaintenanceLog>(maintenanceCSV, maintenanceHeaders);
}
