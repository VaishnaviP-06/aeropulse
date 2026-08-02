import { loadCSV } from "./csvLoader";
import securityCSV from "../../csv/security_screening.csv?url";

export async function getSecurityScreening() {
  return loadCSV(securityCSV);
}