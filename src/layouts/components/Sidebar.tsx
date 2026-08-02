import { motion } from "framer-motion";
import {
  Plane,
  LayoutDashboard,
  PlaneTakeoff,
  DoorOpen,
  Users,
  ShieldCheck,
  Wrench,
  BriefcaseBusiness,
  UserRound,
  ShoppingBag,
  Clock3,
  PanelLeft,
} from "lucide-react";


import SidebarItem from "./SidebarItem";
import OperationalBadge from "../../components/ui/OperationalBadge";
import { useUIStore } from "../../store/uiStore";

const navigationItems = [
  {
    label: "Command Center",
    icon: LayoutDashboard,
    path: "/command-center",
  },
  {
    label: "Flights",
    icon: PlaneTakeoff,
    path: "/flights",
  },
  {
    label: "Gates",
    icon: DoorOpen,
    path: "/gates",
  },
  {
    label: "Passengers",
    icon: Users,
    path: "/passengers",
  },
  {
    label: "Security",
    icon: ShieldCheck,
    path: "/security",
  },
  {
    label: "Maintenance",
    icon: Wrench,
    path: "/maintenance",
  },
  {
    label: "Baggage",
    icon: BriefcaseBusiness,
    path: "/baggage",
  },
  {
    label: "Staff",
    icon: UserRound,
    path: "/staff",
  },
  {
    label: "Retail",
    icon: ShoppingBag,
    path: "/retail",
  },
  {
    label: "Timeline",
    icon: Clock3,
    path: "/timeline",
  },
];

export default function Sidebar() {
  const {
    sidebarCollapsed,
    toggleSidebar,
  } = useUIStore();

  return (
    <motion.aside
      animate={{
        width: sidebarCollapsed ? 80 : 288,
      }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
      className="
        relative
        z-10
        h-screen
        border-r
        border-border
        bg-sidebar/90
        backdrop-blur-2xl
        flex
        flex-col
        overflow-hidden
      "
    >
      <div className="flex items-center justify-between px-4 py-5">
        <div className="relative flex items-center gap-3">
          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            transition={{
              duration: 0.15,
            }}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              border
              border-primary/30
              bg-primary/10
              text-primary
              shadow-[0_0_20px_-4px_oklch(0.78_0.12_220_/_50%)]
            "
          >
            <Plane size={18} />
          </motion.div>

          {!sidebarCollapsed && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              <p
                className="
                  text-[15px]
                  font-semibold
                  tracking-tight
                "
              >
                AeroPulse
              </p>

              <p className="text-xs text-muted-foreground">
                Airport Operations Center
              </p>
            </motion.div>
          )}

          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="
                absolute
                left-0
                top-0
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-background
                opacity-0
                hover:opacity-100
                transition-opacity
              "
            >
              <PanelLeft size={16} />
            </button>
          )}
        </div>

        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="
              rounded-md
              p-2
              text-muted-foreground
              hover:bg-muted
              transition-colors
            "
          >
            <PanelLeft size={16} />
          </button>
        )}
      </div>

      <div className="px-4 pb-5">
        {sidebarCollapsed ? (
          <div className="flex justify-center">
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-500
              "
            />
          </div>
        ) : (
          <OperationalBadge />
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            collapsed={sidebarCollapsed}
          />
        ))}
      </nav>

      <div
        className="
          border-t
          border-border
          px-4
          py-4
          text-xs
          text-muted-foreground
        "
      >
        {!sidebarCollapsed && (
          <span className="font-mono tracking-wide">
            AeroPulse v1.0.0
          </span>
        )}
      </div>
    </motion.aside>
  );
}