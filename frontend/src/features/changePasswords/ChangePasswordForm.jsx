import { Eye } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import InputPassword from "../../components/form/Input/InputPassword";
import { useAuth } from "../auth/hooks/useAuth";
import userService from "../../services/userService";


export default function ChangePasswordForm() {
  const inputOldPasswordRef = useRef();
  const inputNewPasswordRef = useRef();
  const [errors, setErrors] = useState([]);
  const { token } = useAuth();
  const { id } = JSON.parse(atob(token.split(".")[1]));
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await userService.updatePassword(id, token, inputOldPasswordRef.current.value, inputNewPasswordRef.current.value)

      if (response.status === 'error') {
        toast.error(response.message);

        return;
      }

      toast.success(response.message);

      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <section className="change-password-form flex justify-center items-center h-screen w-screen">
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

          <h1 className="m-auto text-2xl">Changer mon mot de passe</h1>
          <p className="text-sm text-center">
            Pour des raisons de sécurité, veuillez modifier votre mot de passe
          </p>
          <InputPassword
            label="Ancien mot de passe"
            type="text"
            identifier="login"
            errorMessage={errors["email"]}
            rightIcon={<Eye size={16} />}
            ref={inputOldPasswordRef}
          />
          <InputPassword
            label="Nouveau mot de passe"
            type="text"
            identifier="login"
            disableLink={true}
            errorMessage={errors["email"]}
            rightIcon={<Eye size={16} />}
            ref={inputNewPasswordRef}
          />

          <button className="bg-primary rounded-lg py-2 text-white hover:cursor-pointer hover:opacity-90">
            Changer mon mot de passe
          </button>
        </form>
      </section>
    </>
  );
}
