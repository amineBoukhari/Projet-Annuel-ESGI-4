import { useRef } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import InputPassword from "../../components/form/Input/InputPassword";
import { useAuth } from "../auth/hooks/useAuth";
import userService from "../../services/userService";
import Button from "../../components/ui/Button";

export default function ChangePasswordForm() {
  const inputOldPasswordRef = useRef();
  const inputNewPasswordRef = useRef();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await userService.updatePassword(
        user.id,
        inputOldPasswordRef.current.value,
        inputNewPasswordRef.current.value,
      );

      if (response.status === "error") {
        toast.error(response.message);
        return;
      }

      refreshUser();
      toast.success(response.message);
      navigate("/");
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-surface p-6">
      <div className="w-full max-w-[420px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 bg-surface-raised rounded-[16px] p-8 shadow-elevated"
        >
          <div className="w-full flex flex-col items-center gap-4">
            <div className="bg-primary rounded-full font-bold text-white w-14 h-14 flex items-center justify-center text-2xl shadow-lifted">
              G
            </div>
            <div className="text-center">
              <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">
                Changer mon mot de passe
              </h1>
              <p className="text-[0.8125rem] text-ink-muted mt-1">
                Pour des raisons de sécurité, veuillez modifier votre mot de passe
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
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
          </div>

          <Button
            text="Changer mon mot de passe"
            variant="primary"
            type="submit"
            className="w-full py-3"
          />
        </form>
      </div>
    </section>
  );
}
