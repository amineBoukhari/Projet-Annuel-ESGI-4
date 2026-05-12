import { Outlet } from "react-router";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div className="p-3 flex gap-3 h-full">
      <div className="side-menu w-1/3">
        <aside className="bg-white rounded-2xl h-full flex justify-center pt-3">
          <h1 className="uppercase font-bold text-2xl text-primary">
            Gesto-resto
          </h1>
        </aside>
      </div>
      <div className="hero-menu w-full h-full flex flex-col gap-3">
        <Header />
        <main className="content h-full w-full rounded-2xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
