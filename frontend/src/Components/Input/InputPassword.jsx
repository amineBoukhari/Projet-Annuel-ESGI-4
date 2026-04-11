import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";
import { useState } from "react";

export default function InputPassword({ref, errorMessage}) {
const [inputType, setInputType] = useState('password');
const [showPassword, setShowPassword] = useState(false);

const handleShowPassword = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === 'text' ? 'password' : 'text');
}

return (
  <div>
    <Input
      type={inputType}
      label="Mot de passe"
      ref={ref}
      errorMessage={errorMessage}
    >
      <div className="px-1" onClick={handleShowPassword}>
        {showPassword && <Eye size={16} />}
        {!showPassword && <EyeOff size={16} />}
      </div>
    </Input>
    <div className="mt-1 text-right text-primary text-sm hover:cursor-pointer hover:opacity-90">
      Mot de passe oublié ?
    </div>
  </div>
);
}
