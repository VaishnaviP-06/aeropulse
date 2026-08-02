import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

import { navigation } from "../../constants/navigation";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { useCurrentTime } from "../../hooks/useCurrentTime";

export default function TopNavigation() {
  const location = useLocation();
  const time = useCurrentTime();

  const currentPage =
    navigation.find((item) => item.href === location.pathname)?.label ??
    "Command Center";

  return (
    <header className="relative z-10 flex h-16 items-center justify-between border-b border-border bg-background/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-operational opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-status-operational" />
        </span>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {currentPage}
          </h2>

          <p className="text-sm text-muted-foreground">
            Airport Operations Control Center
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-mono text-sm tabular-nums tracking-wide text-muted-foreground">
          {time}
        </span>

        <button
          className="
            rounded-lg
            border
            border-border
            p-2
            text-muted-foreground
            hover:border-primary/40
            hover:text-primary
            hover:bg-primary/10
            transition-colors
          "
        >
          <Search size={18} />
        </button>

        <ThemeToggle />

        <button
          className="
            relative
            rounded-lg
            border
            border-border
            p-2
            text-muted-foreground
            hover:border-primary/40
            hover:text-primary
            hover:bg-primary/10
            transition-colors
          "
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-status-critical" />
        </button>

        <div
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-primary/30
            bg-primary/10
            text-sm
            font-semibold
            text-primary
            shadow-[0_0_16px_-4px_oklch(0.78_0.12_220_/_60%)]
          "
        >
          OP
        </div>
      </div>
    </header>
  );
}