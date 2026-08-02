import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";
import { motion } from "framer-motion";


interface Props {
  label: string;
  icon: LucideIcon;
  path: string;
  collapsed?: boolean;
}


export default function SidebarItem({
  label,
  icon: Icon,
  path,
  collapsed = false,
}: Props) {

  return (
    <NavLink
      to={path}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        clsx(
          "group relative flex items-center rounded-lg px-3 py-2 text-sm transition-colors",

          "hover:bg-muted",

          isActive
            ? "bg-primary/10 text-foreground before:absolute before:left-0 before:top-1/2 before:h-5 before:w-[3px] before:-translate-y-1/2 before:rounded-full before:bg-primary before:shadow-[0_0_10px_1px_oklch(0.78_0.12_220_/_70%)]"
            : "text-muted-foreground",

          collapsed
            ? "justify-center"
            : "gap-3"
        )
      }
    >

      <Icon
        size={18}
        className="shrink-0"
      />


      {!collapsed && (
        <motion.span
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ duration:0.15 }}
          className="
            whitespace-nowrap
          "
        >
          {label}
        </motion.span>
      )}

    </NavLink>
  );
}