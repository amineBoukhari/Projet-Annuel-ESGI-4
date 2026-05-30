import { Bell, Mail, Search } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useNavigate } from "react-router";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-6 px-6 pt-4 pb-2">
      {/* Search */}
      <div className="flex-1 max-w-[480px] relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
          size={16}
          strokeWidth={2}
        />

        <input
          type="text"
          placeholder="Rechercher..."
          className="
            w-full
            bg-surface-raised
            rounded-[10px]
            h-10
            pl-9
            pr-4
            outline-none
            text-[0.875rem]
            text-ink
            placeholder:text-ink-muted
            border border-border
            transition-all duration-200
            hover:border-border-strong
            focus:border-primary focus:shadow-lifted
          "
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          className="w-9 h-9 rounded-full bg-surface-raised border border-border flex items-center justify-center hover:border-border-strong hover:shadow-ambient transition-all duration-200 text-ink-muted hover:text-ink"
          title="Messages"
        >
          <Mail size={16} strokeWidth={2} />
        </button>

        <button
          className="w-9 h-9 rounded-full bg-surface-raised border border-border flex items-center justify-center hover:border-border-strong hover:shadow-ambient transition-all duration-200 text-ink-muted hover:text-ink relative"
          title="Notifications"
        >
          <Bell size={16} strokeWidth={2} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>

        <div
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-surface-raised hover:shadow-ambient transition-all duration-200 cursor-pointer border border-transparent hover:border-border"
          onClick={() => navigate("/my-profile")}
        >
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[0.6875rem] font-bold shrink-0">
            {getInitials(user?.username)}
          </div>

          <div className="hidden sm:block">
            <p className="font-semibold text-[0.75rem] leading-tight text-ink">{user?.username || "Utilisateur"}</p>
            <p className="text-[0.6875rem] text-ink-muted leading-tight">{user?.email || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
