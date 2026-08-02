import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopNavigation from "./components/TopNavigation";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNavigation />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}