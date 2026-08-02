import {
  LayoutDashboard,
  Plane,
  DoorOpen,
  Users,
  Shield,
  Wrench,
  Briefcase,
  UserCog,
  ShoppingBag,
  Clock3,
  Settings,
} from "lucide-react";
import type { NavigationItem } from "../types/navigation";

export const navigation: NavigationItem[] = [
  {
    label: "Command Center",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Flights",
    href: "/flights",
    icon: Plane,
  },
  {
    label: "Gates",
    href: "/gates",
    icon: DoorOpen,
  },
  {
    label: "Passengers",
    href: "/passengers",
    icon: Users,
  },
  {
    label: "Security",
    href: "/security",
    icon: Shield,
  },
  {
    label: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    label: "Baggage",
    href: "/baggage",
    icon: Briefcase,
  },
  {
    label: "Staff",
    href: "/staff",
    icon: UserCog,
  },
  {
    label: "Retail",
    href: "/retail",
    icon: ShoppingBag,
  },
  {
    label: "Timeline",
    href: "/timeline",
    icon: Clock3,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];