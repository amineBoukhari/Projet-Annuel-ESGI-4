import { useRef } from "react";
import InputPassword from "../../../components/form/Input/InputPassword";
import userService from "../../../services/userService";
import { useAuth } from "../../auth/hooks/useAuth";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";

export default function SecurityForm() {
  const inputNewPasswordRef = useRef();
  const inputOldPasswordRef = useRef();
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await userService.updatePassword(
        user.id,
        inputOldPasswordRef.current.value,
        inputNewPasswordRef.current.value,
      );

      toast.success("Le mot de passe a bien été mis à jour");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-[1.125rem] font-medium text-ink">Sécurité</h2>
        <p className="text-[0.8125rem] text-ink-muted mt-1">
          Modifiez votre mot de passe pour sécuriser votre compte.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <InputPassword
          ref={inputOldPasswordRef}
          label="Ancien mot de passe"
          disableLink={true}
        />
        <InputPassword
          ref={inputNewPasswordRef}
          label="Nouveau mot de passe"
          disableLink={true}
        />
        <div className="flex justify-end mt-6">
          <Button
            text="Mettre à jour"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}
