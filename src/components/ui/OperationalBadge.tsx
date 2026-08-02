import { motion } from "framer-motion";

export default function OperationalBadge() {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-status-operational/25
        bg-status-operational/[0.06]
        px-3
        py-1.5
        text-xs
        font-medium
        text-muted-foreground
        backdrop-blur-xl
      "
    >
      <motion.span
        animate={{
          opacity: [1, 0.4, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="
          h-2
          w-2
          rounded-full
          bg-status-operational
          shadow-[0_0_8px_0_oklch(0.78_0.18_155_/_70%)]
        "
      />

      <span className="text-status-operational">
        Operational
      </span>
    </div>
  );
}