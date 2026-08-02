import { ShoppingBag, Receipt, Wallet, Plane } from "lucide-react";
import FlightMetricCard from "../../features/flights/components/FlightMetricCard";
import RetailTable from "../../features/retail/components/RetailTable";
import RetailRevenuePanel from "../../features/retail/components/RetailRevenuePanel";
import { useRetailOperations } from "../../features/retail/hooks/useRetailOperations";

export default function RetailPage() {
  const {
    totalRevenue,
    totalTransactions,
    averageTransactionValue,
    uniqueFlightsServed,
    revenueByAirline,
    topFlightsByRevenue,
    datasetProfile,
  } = useRetailOperations();

  const kpis = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      description: "Duty Free spend, all transactions",
      icon: Wallet,
    },
    {
      label: "Transactions",
      value: totalTransactions,
      description: "Recorded retail purchases",
      icon: Receipt,
    },
    {
      label: "Average Basket",
      value: `₹${averageTransactionValue.toLocaleString("en-IN")}`,
      description: "Per transaction",
      icon: ShoppingBag,
    },
    {
      label: "Flights Served",
      value: uniqueFlightsServed,
      description: "Unique flights linked to a purchase",
      icon: Plane,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Retail Operations
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Airport Retail Intelligence
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Duty Free spend traced to the flight that generated it — revenue,
          basket size, and airline mix at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <FlightMetricCard key={kpi.label} {...kpi} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RetailTable />
        </div>

        <RetailRevenuePanel
          revenueByAirline={revenueByAirline}
          topFlightsByRevenue={topFlightsByRevenue}
          datasetProfile={datasetProfile}
        />
      </div>
    </div>
  );
}
