import { Bell, Mail, Search } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router";

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-6">
      <div className="flex-1 max-w-130 relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search task"
          className="
            w-full
            bg-white
            rounded-2xl
            h-17
            pl-14
            pr-5
            outline-none
            text-[15px]
            shadow-sm
          "
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Mail size={20} />
        </button>

        <button className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
          <Bell size={20} />
        </button>

        <div
          className="bg-white rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm hover:cursor-pointer hover:scale-105 active:scale-90"
          onClick={() => navigate("/my-profile")}
        >
          <img
            src="https://i.pravatar.cc/100"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <h3 className="font-semibold leading-none">{user.username}</h3>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
