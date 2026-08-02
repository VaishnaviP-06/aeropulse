
export interface MaintenanceLog {
  work_order_id: string;
  aircraft_registration: string;
  flight_id: string;

  maintenance_type: string;

  reported_by_staff_id: string;
  reported_time: string;
  resolved_time: string;

  priority_level: number;
  defect_code: number;
  issue_description: string;
  component: string;
  estimated_hours: number;

  closed_by_staff_id: string;

  aircraft_grounded: boolean;
  recurring_issue: boolean;

  unused_1: string;
}
