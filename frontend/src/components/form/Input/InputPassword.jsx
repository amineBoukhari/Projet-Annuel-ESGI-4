import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";
import { useState } from "react";

export default function InputPassword({
  ref,
  errorMessage,
  label,
  disableLink = false,
}) {
  const [inputType, setInputType] = useState("password");
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    setInputType(inputType === "text" ? "password" : "text");
  };

  return (
    <div className="w-full">
      <Input
        type={inputType}
        label={label}
        ref={ref}
        errorMessage={errorMessage}
      >
        <button
          type="button"
          onClick={handleShowPassword}
          className="text-ink-muted hover:text-ink transition-colors duration-150 p-1"
          tabIndex={-1}
        >
          {showPassword ? <Eye size={16} strokeWidth={2} /> : <EyeOff size={16} strokeWidth={2} />}
        </button>
      </Input>
      {!disableLink && (
        <div className="mt-2 text-right">
          <span className="text-primary text-[0.8125rem] font-medium hover:cursor-pointer hover:text-primary-hover transition-colors duration-150">
            Mot de passe oublié ?
          </span>
        </div>
      )}
    </div>
  );
}
