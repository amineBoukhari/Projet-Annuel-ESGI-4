import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import * as z from "zod";
import Input from "../../../components/form/Input/Input.jsx";
import InputPassword from "../../../components/form/Input/InputPassword.jsx";
import Button from "../../../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { authService } from "../../../services/authService.js";

export default function LoginForm() {
  const { login } = useAuth();
  const inputLoginRef = useRef();
  const inputPasswordRef = useRef();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loginSchema = z.object({
    email: z.email("Email invalide").min(1, "Le champ ne doit pas être vide"),
    password: z.string().min(1, "Le champ ne doit pas être vide"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({
      email: inputLoginRef.current.value,
      password: inputPasswordRef.current.value,
    });

    if (!result.success) {
      const formErrors = {};
      result.error.issues.forEach(({ message, path }) => {
        formErrors[path] = message;
      });
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const { user, mustChangePassword } = await authService.login(
        inputLoginRef.current.value,
        inputPasswordRef.current.value,
      );

      login(user);
      toast.success("Connexion réussie", { duration: 4000 });

      if (mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.message === "Invalid email or password") {
        toast.error("Identifiants invalides");
      } else {
        toast.error("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-surface-raised rounded-[16px] p-8 shadow-elevated"
    >
      {/* Logo */}
      <div className="w-full flex flex-col items-center gap-4">
        <div className="bg-primary rounded-full font-bold text-white w-14 h-14 flex items-center justify-center text-2xl shadow-lifted">
          G
        </div>
        <div className="text-center">
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-tight">Connexion</h1>
          <p className="text-[0.8125rem] text-ink-muted mt-1">Gesto-Resto — Gestion de restaurant</p>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          type="text"
          identifier="login"
          errorMessage={errors["email"]}
          placeHolder="votre@email.com"
          ref={inputLoginRef}
        />
        <InputPassword
          ref={inputPasswordRef}
          label="Mot de passe"
          errorMessage={errors["password"]}
        />
      </div>

      {/* Submit */}
      <Button
        text={isLoading ? "Connexion..." : "Se connecter"}
        variant="primary"
        type="submit"
        disabled={isLoading}
        className="w-full py-3"
      />
    </form>
  );
}
