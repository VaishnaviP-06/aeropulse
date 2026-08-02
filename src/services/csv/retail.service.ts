import { loadCSV } from "./csvLoader";
import retailCSV from "../../csv/retail_transactions.csv?url";

export async function getRetailTransactions() {
  return loadCSV(retailCSV);
}