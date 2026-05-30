import { useRef } from "react";
import { Trash2, User } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import Input from "../../../components/form/Input/Input";
import userService from "../../../services/userService";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileForm() {
  const { user, refreshUser } = useAuth();

  const inputEmailRef = useRef();
  const inputUsernameRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await userService.updateProfile(
        user.id,
        inputEmailRef.current.value,
        inputUsernameRef.current.value,
      );
      await refreshUser();
      toast.success("Le profil a bien été mis à jour");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <h2 className="text-[1.5rem] font-semibold text-ink tracking-tight">Mon profil</h2>
        <p className="text-[0.9375rem] text-ink-muted mt-1">
          Gérez vos informations personnelles et préférences.
        </p>
      </div>

      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold border-2 border-border">
            {getInitials(user?.username)}
          </div>
        </div>
        <div>
          <h3 className="text-[1.125rem] font-semibold text-ink">{user.username}</h3>
          <p className="text-[0.8125rem] font-medium text-ink-muted mb-3">
            {user.role?.name}
          </p>
          <div className="flex gap-2">
            <Button text="Changer la photo" variant="ghost" icon={User} />
            <Button text="Supprimer" variant="danger" icon={Trash2} />
          </div>
        </div>
      </div>

      <hr className="border-border my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Nom d'utilisateur"
          type="text"
          identifier="username"
          defaultValue={user.username}
          ref={inputUsernameRef}
        />
        <Input
          label="Email"
          type="email"
          identifier="email"
          defaultValue={user.email}
          ref={inputEmailRef}
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          text="Enregistrer les modifications"
          variant="primary"
          type="submit"
        />
      </div>
    </form>
  );
}
