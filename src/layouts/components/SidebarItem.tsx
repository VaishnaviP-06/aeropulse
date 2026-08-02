import clsx from "clsx";
import { NavLink } from "react-router-dom";
import type { NavigationItem } from "../../types/navigation";

interface Props {
  item: NavigationItem;
}

export default function SidebarItem({ item }: Props) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        clsx(
          "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )
      }
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{item.label}</span>
    </NavLink>
  );
}