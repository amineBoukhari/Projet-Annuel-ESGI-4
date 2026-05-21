import { Outlet } from "react-router";
import Aside from "./components/Aside/Aside";
import Header from "./components/Header";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen p-4">
      <div className="flex gap-4 h-[calc(100vh-32px)]">
        <Aside />

        <main className="flex-1 bg-[#efefef] rounded-4xl p-6 overflow-auto">
          <Header />

          <div className="mt-6 grid gap-6 grid-cols-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
