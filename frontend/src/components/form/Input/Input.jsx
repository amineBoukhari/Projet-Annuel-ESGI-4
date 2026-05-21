import { Children } from "react";

export default function Input({
  label,
  identifier,
  type,
  errorMessage,
  placeHolder,
  children,
  ref,
  defaultValue = null,
}) {
  return (
    <div>
      <label
        className="block text-sm font-bold text-slate-700 mb-2"
        htmlFor={identifier}
      >
        {label}
      </label>
      {errorMessage && (
        <p className="text-red-500 text-xs px-2">{errorMessage}</p>
      )}
      <div className="rounded-lg flex items-center">
        <input
          className={`w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium ${
            errorMessage ? "border-red-500" : ""
          }`}
          {...(placeHolder !== null && { placeholder: placeHolder })}
          type={type}
          name={identifier}
          ref={ref}
          defaultValue={defaultValue}
        />
        {children}
      </div>
    </div>
  );
}
