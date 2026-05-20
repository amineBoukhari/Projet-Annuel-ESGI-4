import React, { useRef } from "react";
import { EyeOff } from "lucide-react";
import InputPassword from "../../../components/form/Input/InputPassword";

export default function SecurityForm() {
  const inputNewPasswordRef = useRef()
  const inputOldPasswordRef = useRef()
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Sécurité</h2>
        <p className="text-sm text-slate-500 mt-1">
          Modifiez votre mot de passe pour sécuriser votre compte.
        </p>
      </div>

      <div className="space-y-6 max-w-md">
        {/* Ancien mot de passe */}
        <div>
          <InputPassword
            ref={inputOldPasswordRef}
            label="Ancien mot de passe"
          />
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <InputPassword
            ref={inputNewPasswordRef}
            label="Nouveau mot de passe"
          />
          </div>
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end mt-8">
        <button className="bg-[#4CB5AD] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#3ea29a] transition-colors shadow-sm shadow-[#4CB5AD]/30">
          Mettre à jour
        </button>
      </div>
    </>
  );
}
