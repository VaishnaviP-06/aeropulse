import AppLayout from "../layouts/AppLayout";
import CommandCenterPage from "../pages/command-center/CommandCenterPage";
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
    ],
  },
];