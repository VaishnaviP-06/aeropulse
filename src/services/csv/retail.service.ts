import { loadCSV } from "./csvLoader";
import retailCSV from "../../csv/retail_transactions.csv?url";
import type { RetailTransaction } from "../../types/retail.types";

const retailHeaders = [
  "transaction_id",
  "operator_id",
  "store_name",
  "store_category",
  "passport_masked",
  "flight_id",
  "transaction_time",
  "item_category",
  "quantity",
  "unit_price_inr",
  "total_amount_inr",
  "payment_method",
  "currency",
  "discount_code",
  "terminal",
  "location",
  "duty_free_eligible",
];

export async function getRetailTransactions(): Promise<RetailTransaction[]> {
  return loadCSV<RetailTransaction>(retailCSV, retailHeaders);
}
