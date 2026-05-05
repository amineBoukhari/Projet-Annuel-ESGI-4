import { useAuth } from "../../../Context/authContext";
import ProfileMenuItem from "./ProfileMenuItem";

export default function ProfileMenu() {
  const { logout } = useAuth();
  return (
    <div className="absolute flex flex-col right-4 top-24 rounded-xl bg-white p-2">
      <ProfileMenuItem text={"Profil"} />
      <ProfileMenuItem text={"Se déconnecter"} onClickAction={() => logout()} danger />
    </div>
  );
}
