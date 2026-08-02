import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

interface ChartCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Shared shell for every analytics chart on AeroPulse.
 * Reuses the `.glass` surface + heading rhythm already established by
 * page headers and cards (see GatesPage, SecurityPage, FlightMetricCard).
 */
export default function ChartCard({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  action,
  className,
  children,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass relative overflow-hidden rounded-xl p-5",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-cyan-400/[0.03]" />

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {eyebrow}
              </p>
            )}

            <div className="mt-1.5 flex items-center gap-2">
              {Icon && <Icon size={16} className="text-cyan-400" />}
              <h3 className="text-sm font-semibold text-foreground">
                {title}
              </h3>
            </div>

            {subtitle && (
              <p className="mt-1 text-xs text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>

        <div>{children}</div>
      </div>
    </motion.div>
  );
}
