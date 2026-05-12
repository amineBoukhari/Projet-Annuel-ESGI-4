import { useNavigate } from "react-router";
import { useAuth } from "../../../auth/hooks/useAuth";
import ProfileMenuItem from "./ProfileMenuItem";

export default function ProfileMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="absolute flex flex-col right-4 top-24 rounded-xl bg-white p-2">
      <ProfileMenuItem text={"Profil"} onClickAction={() => navigate('/my-profile')} />
      <ProfileMenuItem
        text={"Se déconnecter"}
        onClickAction={() => logout()}
        danger
      />
    </div>
  );
}
