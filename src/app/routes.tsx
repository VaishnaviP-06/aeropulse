import AppLayout from "../layouts/AppLayout";
import CommandCenterPage from "../pages/command-center/CommandCenterPage";
import FlightsPage from "../pages/flights/FlightsPage";
import GatesPage from "../pages/gates/GatesPage";
import PassengersPage from "../pages/passengers/PassengersPage";
import BaggagePage from "../pages/baggage/BaggagePage";
import MaintenancePage from "../pages/maintenance/MaintenancePage";
import StaffPage from "../pages/staff/StaffPage";
import SecurityPage from "../pages/security/SecurityPage";
import RetailPage from "../pages/retail/RetailPage";
import TimelinePage from "../pages/timeline/TimelinePage";

import type { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <CommandCenterPage />,
      },

      {
        path: "command-center",
        element: <CommandCenterPage />,
      },

      {
        path: "flights",
        element: <FlightsPage />,
      },

      {
        path: "gates",
        element: <GatesPage />,
      },

      {
        path: "passengers",
        element: <PassengersPage />,
      },

      {
        path: "baggage",
        element: <BaggagePage />,
      },

      {
        path: "maintenance",
        element: <MaintenancePage />,
      },

      {
        path: "staff",
        element: <StaffPage />,
      },

      {
        path: "security",
        element: <SecurityPage />,
      },

      {
        path: "retail",
        element: <RetailPage />,
      },

      {
        path: "timeline",
        element: <TimelinePage />,
      },
    ],
  },
];