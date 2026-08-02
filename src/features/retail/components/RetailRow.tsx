import { motion } from "framer-motion";
import StatusBadge from "../../../components/ui/StatusBadge";
import type { TransactionWithFlight } from "../utils/retailAnalytics";

interface Props {
  transaction: TransactionWithFlight;
  index: number;
}

export default function RetailRow({ transaction, index }: Props) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.4) }}
      className="border-b border-border/60 transition-colors hover:bg-cyan-400/[0.04]"
    >
      <td className="px-4 py-3 font-mono text-sm font-medium">
        {transaction.transaction_id}
      </td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {new Date(transaction.transaction_time).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>

      <td className="px-4 py-3 font-mono text-sm">{transaction.flight_id}</td>

      <td className="px-4 py-3 text-sm text-muted-foreground">
        {transaction.flight
          ? `${transaction.flight.airline} · ${transaction.flight.origin} → ${transaction.flight.destination}`
          : "Unmatched flight"}
      </td>

      <td className="px-4 py-3 text-sm">{transaction.item_category}</td>

      <td className="px-4 py-3 text-sm font-semibold">
        ₹{Number(transaction.total_amount_inr).toLocaleString("en-IN")}
      </td>

      <td className="px-4 py-3">
        <StatusBadge label={transaction.payment_method} variant="success" />
      </td>
    </motion.tr>
  );
}
