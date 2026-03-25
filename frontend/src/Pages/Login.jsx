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
  
  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO:Vérifier les login/mdp en bdd
    // TODO:Créer un token JWT pour garder la sesssion

    navigate('/')
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