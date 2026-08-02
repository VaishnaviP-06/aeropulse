export interface RetailTransaction {
  transaction_id: string;
  operator_id: string;

  store_name: string;
  store_category: string;

  passport_masked: string;
  flight_id: string;

  transaction_time: string;

  item_category: string;
  quantity: number;

  unit_price_inr: number;
  total_amount_inr: number;

  payment_method: string;
  currency: string;
  discount_code: string;

  terminal: string;
  location: string;

  duty_free_eligible: boolean;
}
