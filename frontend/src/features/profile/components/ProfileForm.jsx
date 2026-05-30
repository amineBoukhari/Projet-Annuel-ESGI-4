import React, { useRef } from "react";
import { Upload } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import Input from "../../../components/form/Input/Input";
import userService from "../../../services/userService";
import toast from "react-hot-toast";

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
    } finally {
      event.target.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Mon profil</h2>
        <p className="text-sm text-slate-500 mt-1">
          Gérez vos informations personnelles et préférences.
        </p>
      </div>
      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <img
            src="https://i.pravatar.cc/150?img=11"
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-teal-600 shadow-sm transition-colors"
          >
            <Upload size={14} />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{user.username}</h3>
          <p className="text-sm font-medium text-slate-500 mb-3">
            {user.role?.name}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Changer la photo
            </button>
            <button
              type="button"
              className="text-xs font-semibold text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
      <hr className="border-slate-100 my-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <button
          type="submit"
          className="bg-[#4CB5AD] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3ea29a] transition-colors shadow-sm shadow-[#4CB5AD]/30"
        >
          Enregistrer les modifications
        </button>
      </div>
    </form>
  );
}
