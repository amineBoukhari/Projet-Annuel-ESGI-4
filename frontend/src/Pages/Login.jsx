import { Drum, Eye } from "lucide-react";
import Input from "../Components/Input/Input";
import InputPassword from "../Components/Input/InputPassword";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../Context/authContext";
import toast from "react-hot-toast";
import * as z from "zod";

export default function Login() {
  const { setAuth } = useAuth();
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
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inputLoginRef.current.value,
          password: inputPasswordRef.current.value,
        }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        toast.error(error);

        return;
      }

      const { token, mustChangePassword } = await response.json();
      setAuth(token);
      toast.success("Successfully logged in", { duration: 4000 });

      if (mustChangePassword) {
        navigate("/change-password");
      } else {
        navigate("/");
      }
    } catch (error) {
      //log error
      console.log(error.message);
    }
  };
  return (
    <section className="login-form flex justify-center items-center h-screen w-screen">
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
        <button className="bg-primary rounded-lg py-2 text-white hover:cursor-pointer hover:opacity-90">
          Se connecter
        </button>
      </form>
    </section>
  );
}
