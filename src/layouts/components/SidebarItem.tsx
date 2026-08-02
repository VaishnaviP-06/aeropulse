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
    <NavLink to={path} title={collapsed ? label : undefined}>
      {({ isActive }) => (
        <motion.div
          whileHover={{
            x: 4,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 24,
          }}
          className={clsx(
            "group relative flex items-center overflow-hidden rounded-xl px-3 py-2.5 text-sm transition-all duration-300",
            collapsed ? "justify-center" : "gap-3",
            isActive
              ? "bg-primary/10 text-primary shadow-[0_0_24px_rgba(0,180,255,.12)]"
              : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
          )}
        >
          {/* Active Indicator */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
          )}

          {/* Hover Glow */}
          <div
            className="
              absolute
              inset-0
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
              bg-gradient-to-r
              from-primary/5
              via-primary/10
              to-transparent
            "
          />

          {/* Icon */}
          <motion.div
            whileHover={{
              rotate: -8,
              scale: 1.15,
            }}
            transition={{
              duration: 0.2,
            }}
            className="relative z-10"
          >
            <Icon size={18} />
          </motion.div>

          {/* Label */}
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 whitespace-nowrap font-medium"
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      )}
    </NavLink>
  );
}