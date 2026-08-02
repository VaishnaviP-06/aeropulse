import type { RetailTransaction } from "../../../types/retail.types";
import type { Flight } from "../../../types/flight.types";

export interface TransactionWithFlight extends RetailTransaction {
  flight: Flight | null;
}

export function joinRetailWithFlight(
  transactions: RetailTransaction[],
  flights: Flight[]
): TransactionWithFlight[] {
  const flightMap = new Map(flights.map((flight) => [flight.flight_id, flight]));

  return transactions.map((transaction) => ({
    ...transaction,
    flight: flightMap.get(transaction.flight_id) ?? null,
  }));
}

export function getTotalRevenue(transactions: RetailTransaction[]) {
  return transactions.reduce(
    (sum, transaction) => sum + Number(transaction.total_amount_inr || 0),
    0
  );
}

export function getTotalTransactions(transactions: RetailTransaction[]) {
  return transactions.length;
}

export function getAverageTransactionValue(transactions: RetailTransaction[]) {
  if (!transactions.length) return 0;
  return Number(
    (getTotalRevenue(transactions) / transactions.length).toFixed(0)
  );
}

export function getUniqueFlightsServed(transactions: RetailTransaction[]) {
  return new Set(transactions.map((transaction) => transaction.flight_id)).size;
}

export interface AirlineRevenue {
  airline: string;
  revenue: number;
  transactionCount: number;
}

/**
 * Revenue grouped by airline via the verified flight_id join. This is the
 * dataset's real analogue to a "category" breakdown — store_name and
 * item_category themselves are constant (see getDatasetProfile).
 */
export function getRevenueByAirline(
  transactions: TransactionWithFlight[],
  limit = 8
): AirlineRevenue[] {
  const byAirline = new Map<string, { revenue: number; transactionCount: number }>();

  transactions.forEach((transaction) => {
    const airline = transaction.flight?.airline ?? "Unmatched flight";
    const entry = byAirline.get(airline) ?? { revenue: 0, transactionCount: 0 };

    entry.revenue += Number(transaction.total_amount_inr || 0);
    entry.transactionCount += 1;

    byAirline.set(airline, entry);
  });

  return Array.from(byAirline.entries())
    .map(([airline, stats]) => ({
      airline,
      revenue: stats.revenue,
      transactionCount: stats.transactionCount,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export interface FlightRevenue {
  flight_id: string;
  revenue: number;
  transactionCount: number;
}

export function getTopFlightsByRevenue(
  transactions: RetailTransaction[],
  limit = 5
): FlightRevenue[] {
  const byFlight = new Map<string, { revenue: number; transactionCount: number }>();

  transactions.forEach((transaction) => {
    const entry = byFlight.get(transaction.flight_id) ?? {
      revenue: 0,
      transactionCount: 0,
    };

    entry.revenue += Number(transaction.total_amount_inr || 0);
    entry.transactionCount += 1;

    byFlight.set(transaction.flight_id, entry);
  });

  return Array.from(byFlight.entries())
    .map(([flight_id, stats]) => ({
      flight_id,
      revenue: stats.revenue,
      transactionCount: stats.transactionCount,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export interface DayOfWeekRevenue {
  day: string;
  revenue: number;
  transactionCount: number;
}

const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function getRevenueByDayOfWeek(
  transactions: RetailTransaction[]
): DayOfWeekRevenue[] {
  const byDay = new Map<string, { revenue: number; transactionCount: number }>();

  transactions.forEach((transaction) => {
    const date = new Date(transaction.transaction_time);
    if (Number.isNaN(date.getTime())) return;

    const day = DAY_ORDER[(date.getDay() + 6) % 7];
    const entry = byDay.get(day) ?? { revenue: 0, transactionCount: 0 };

    entry.revenue += Number(transaction.total_amount_inr || 0);
    entry.transactionCount += 1;

    byDay.set(day, entry);
  });

  return DAY_ORDER.map((day) => ({
    day,
    revenue: byDay.get(day)?.revenue ?? 0,
    transactionCount: byDay.get(day)?.transactionCount ?? 0,
  }));
}

export interface DatasetProfileField {
  label: string;
  value: string;
  coveragePercent: number;
}

/**
 * store_name, store_category, item_category, payment_method, terminal and
 * location are 100% constant in this dataset (a single Duty Free perfume
 * counter at T3, card-only). Rather than fabricate a store/category
 * breakdown that doesn't exist, this surfaces that as a truthful
 * operational fact — every transaction table row already shows the same
 * store and item, so a "top stores" chart would just be one bar.
 */
export function getDatasetProfile(
  transactions: RetailTransaction[]
): DatasetProfileField[] {
  if (!transactions.length) return [];

  const total = transactions.length;

  const fieldOf = (key: keyof RetailTransaction, label: string) => {
    const counts = new Map<string, number>();
    transactions.forEach((transaction) => {
      const value = String(transaction[key]);
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });

    const [topValue, topCount] = Array.from(counts.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0];

    return {
      label,
      value: topValue,
      coveragePercent: Number(((topCount / total) * 100).toFixed(1)),
    };
  };

  return [
    fieldOf("store_name", "Store"),
    fieldOf("item_category", "Item sold"),
    fieldOf("payment_method", "Payment method"),
    fieldOf("terminal", "Terminal"),
    fieldOf("location", "Location"),
  ];
}
