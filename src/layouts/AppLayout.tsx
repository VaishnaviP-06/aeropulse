import AmbientGlow from "../components/ui/AmbientGlow";
import Sidebar from "./components/Sidebar";
import TopNavigation from "./components/TopNavigation";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: Props) {
  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-background
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_left,rgba(107,200,255,0.10),transparent_35%)]
          dark:bg-[radial-gradient(circle_at_top_left,rgba(107,200,255,0.14),transparent_35%)]
        "
      />

      <AmbientGlow />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <TopNavigation />

          <main
            className="
              flex-1
              overflow-auto
              p-6
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}