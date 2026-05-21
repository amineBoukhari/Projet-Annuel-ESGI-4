import { Drum, Eye } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
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
  const [errors, setErrors] = useState([]);

  const loginSchema = z.object({
    email: z.email("Email invalide").min(1, "Le champs ne doit pas être vide"),
    password: z.string().min(1, "Le champs ne doit pas être vide"),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      // toast.error(message);
      return;
    }

    try {
      const { user, mustChangePassword } = await authService.login(
        inputLoginRef.current.value,
        inputPasswordRef.current.value,
      );

      login(user);
      toast.success("Successfully logged in", { duration: 4000 });

      if (mustChangePassword) {
        console.log("redirect vers /change-password");
        navigate("/change-password");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error.message || "error");
      if (error.message === "Invalid email or password") {
        toast.error("Identifiants invalides");
      }
    }
  };
  return (
    <form
      method="post"
      className="flex flex-col gap-4 bg-white rounded-xl w-90 p-4 shadow-xl"
      onSubmit={handleSubmit}
    >
      <div className="w-full flex justify-center">
        <span className="bg-primary rounded-full font-bold text-white p-8 size-6 flex items-center justify-center text-4xl">
          G
        </span>
      </div>

      <h1 className="m-auto text-2xl">Connexion</h1>
      <Input
        label="Identifiant"
        type="text"
        identifier="login"
        errorMessage={errors["email"]}
        rightIcon={<Eye size={16} />}
        ref={inputLoginRef}
      />
      <InputPassword
        ref={inputPasswordRef}
        label="Mot de passe"
        errorMessage={errors["password"]}
      />
      <Button text={"Se connecter"} />
    </form>
  );
}
