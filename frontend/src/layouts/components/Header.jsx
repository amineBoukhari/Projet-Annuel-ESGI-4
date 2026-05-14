import { SidebarIcon } from "lucide-react";

import { useState } from "react";

import Avatar from "../../components/ui/Temp/Avatar";
import ProfileMenu from "../../features/profile/components/ProfileMenu";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function Header({ setOpenAsideMenu }) {
  const { user } = useAuth();
  const [menuOpened, setMenuOpened] = useState(false);
  return (
    <header className="bg-white flex items-center justify-between px-3 py-3 rounded-2xl">
      <button
        className="hover:opacity-50 hover:cursor-pointer text-primary"
        onClick={() => setOpenMenu(!setOpenMenu)}
      >
        <SidebarIcon />
      </button>

      {/*  HERO BUTTON */}
      <div
        className="flex items-center max-w-1/5 gap-3 hover:opacity-75 hover:cursor-pointer"
        onClickCapture={() => setMenuOpened(!menuOpened)}
      >
        <p className="uppercase font-semibold text-primary">{user.username}</p>
        <Avatar attributes={"rounded-full size-12 border-3 border-primary"} seed={user.username} />
      </div>

      {menuOpened && (
        <ProfileMenu />
      )}
    </header>
  );
}
