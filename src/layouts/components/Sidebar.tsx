import { navigation } from "../../constants/navigation";
import SidebarItem from "./SidebarItem";
import StatusBadge from "../../components/ui/StatusBadge";

export default function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-background">
      <div className="border-b border-border p-6">
        <h1 className="text-3xl font-bold tracking-tight">
          AeroPulse
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Airport Operations
        </p>

        <div className="mt-5">
          <StatusBadge label="Operational" />
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
          />
        ))}
      </nav>

      <footer className="border-t border-border p-4 text-xs text-muted-foreground">
        AeroPulse v1.0.0
      </footer>
    </aside>
  );
}