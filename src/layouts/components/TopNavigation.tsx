import { Bell, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { navigation } from "../../constants/navigation";
import { useCurrentTime } from "../../hooks/useCurrentTime";

export default function TopNavigation() {
  const location = useLocation();
  const time = useCurrentTime();

  const currentPage =
    navigation.find((item) => item.href === location.pathname)?.label ??
    "Command Center";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          {currentPage}
        </h2>

        <p className="text-sm text-muted-foreground">
          Airport Operations Control Center
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {time}
        </span>

        <button className="rounded-lg border border-border p-2 hover:bg-muted transition-colors">
          <Search size={18} />
        </button>

        <button className="rounded-lg border border-border p-2 hover:bg-muted transition-colors">
          <Bell size={18} />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          OP
        </div>
      </div>
    </header>
  );
}