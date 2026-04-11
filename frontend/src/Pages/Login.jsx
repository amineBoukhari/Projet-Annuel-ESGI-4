import { Eye } from "lucide-react";
import Input from "../Components/Input/Input";
import InputPassword from "../Components/Input/InputPassword";
import { useRef } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const formRef = useRef();
  const inputLoginRef = useRef();
  const inputPasswordRef = useRef();
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("https://votre-backend.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:inputLoginRef.current.value, password:inputPasswordRef.current.value }),
      });
  
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
  
      const { token } = await response;
      localStorage.setItem('user_token', token);
      navigate("/");
  
    } catch (error) {
      console.error("Erreur login :", error);
    }
  }
    return (
      <section className="login-form flex justify-center items-center h-screen w-screen">
        <form method="post" className="flex flex-col gap-4 bg-white rounded-xl w-90 p-4 shadow-xl" onSubmit={handleSubmit} ref={formRef}>
          <div className="w-full flex justify-center">
            <span className="bg-primary rounded-full font-bold text-white p-8 size-6 flex items-center justify-center text-4xl">
              G
            </span>
          </div>

          <h1 className="m-auto text-2xl">Connexion</h1>
          <Input label='Identifiant' type='text' identifier='login' errorMessage={'Identifiant Invalides'} rightIcon={<Eye size={16} />} ref={inputLoginRef}/>
          <InputPassword ref={inputPasswordRef}/>
          <button className="bg-primary rounded-lg py-2 text-white hover:cursor-pointer hover:opacity-90">
            Se connecter
          </button>
        </form>
      </section>
    );
}