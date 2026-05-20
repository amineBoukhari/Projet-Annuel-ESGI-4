import { useRef } from "react";
import InputPassword from "../../../components/form/Input/InputPassword";
import userService from "../../../services/userService";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";

export default function SecurityForm() {
  const inputNewPasswordRef = useRef()
  const inputOldPasswordRef = useRef()
  const { user } = useAuth();

  const  handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await userService.updatePassword(user.id, inputOldPasswordRef.current.value, inputNewPasswordRef.current.value)

      toast.success('Le mot de passe a bien été mis à jour');
    } catch (error) {
      toast.error(error.message);
    } finally {
      event.target.reset();
    }
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Sécurité</h2>
        <p className="text-sm text-slate-500 mt-1">
          Modifiez votre mot de passe pour sécuriser votre compte.
        </p>
      </div>

      <form
        className="space-y-6 max-w-md"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div>
          <InputPassword
            ref={inputOldPasswordRef}
            label="Ancien mot de passe"
            disableLink={true}
          />
        </div>

        <div>
          <InputPassword
            ref={inputNewPasswordRef}
            label="Nouveau mot de passe"
            disableLink={true}
          />
        </div>
        <div className="flex justify-end mt-8">
          <button className="bg-[#4CB5AD] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3ea29a] transition-colors shadow-sm shadow-[#4CB5AD]/30">
            Mettre à jour
          </button>
        </div>
      </form>
    </>
  );
}
