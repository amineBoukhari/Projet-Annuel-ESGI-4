import { Eye } from "lucide-react";
import Input from "../Components/Input/Input";
import InputPassword from "../Components/Input/InputPassword";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { useAuth } from "../Context/authContext";

export default function ChangePassword() {
    const inputOldPasswordRef = useRef();
    const inputNewPasswordRef = useRef();
    const [errors, setErrors] = useState([]);
    const { token, setAuth } = useAuth();
    const { id } = JSON.parse(atob(token.split(".")[1]));
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch(
              `http://localhost:3000/api/auth/changePassword`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                  id: id,
                  oldPassword: inputOldPasswordRef.current.value,
                  newPassword: inputNewPasswordRef.current.value,
                }),
              }
            );
      
            if (!response.ok) {
                console.log(response, 'ça a pas marché')
                toast.error('une erreur est survenue lors de la modification de mot de passe')
                return;
            }

            const { newToken, message } = await response.json();
            setAuth(newToken);
            toast.success(message)

            navigate('/')
        } catch (error) {
            console.log(error.message)
        }
    }
    
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
              disableLink={true}
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