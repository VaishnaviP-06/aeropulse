export { default as RetailTable } from "./components/RetailTable";
export { default as RetailRow } from "./components/RetailRow";
export { default as RetailRevenuePanel } from "./components/RetailRevenuePanel";
export {
  useRetailOperations,
  retailSortOptions,
} from "./hooks/useRetailOperations";
export type { RetailSortKey } from "./hooks/useRetailOperations";
export {
  joinRetailWithFlight,
  getTotalRevenue,
  getTotalTransactions,
  getAverageTransactionValue,
  getUniqueFlightsServed,
  getRevenueByAirline,
  getTopFlightsByRevenue,
  getRevenueByDayOfWeek,
  getDatasetProfile,
} from "./utils/retailAnalytics";
export type {
  TransactionWithFlight,
  AirlineRevenue,
  FlightRevenue,
  DayOfWeekRevenue,
  DatasetProfileField,
} from "./utils/retailAnalytics";
