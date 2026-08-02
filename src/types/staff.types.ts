
export interface StaffShift {
  staff_id: string;
  staff_name: string;

  department: string;
  role: string;

  shift_date: string;
  shift_start_time: string;
  shift_end_time: string;

  terminal: string;
  base_location: string;

  supervisor_id: string;

  shift_length_hours: number;
  overtime: boolean;
  unused_1: string;

  certification_date: string;
  primary_language: string;
}
