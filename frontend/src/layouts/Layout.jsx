import { Outlet } from "react-router";
import Aside from "./components/Aside/Aside";
import Header from "./components/Header";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen p-4 bg-surface">
      <div className="flex gap-4 h-[calc(100vh-32px)]">
        <Aside />

        <main className="flex-1 overflow-auto flex flex-col">
          <Header />

          <div className="flex-1 p-6 pt-2 overflow-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
